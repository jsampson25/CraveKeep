import { createClient } from 'npm:@supabase/supabase-js@2.90.1';

const corsHeaders = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type', 'Access-Control-Allow-Methods': 'POST, OPTIONS' };
const numberValue = (value: number | string | undefined) => { const parsed = typeof value === 'number' ? value : Number(value); return Number.isFinite(parsed) ? parsed : null; };
type OffProduct = { code?: string; product_name?: string; brands?: string; serving_quantity?: number; serving_size?: string; nutriments?: Record<string, number | string | undefined> };
type FatServing = { serving_id?: string; serving_description?: string; metric_serving_amount?: string; metric_serving_unit?: string; calories?: string; protein?: string; carbohydrate?: string; fat?: string; sodium?: string };
type FatFood = { food_id?: string; food_name?: string; brand_name?: string; food_url?: string; servings?: { serving?: FatServing | FatServing[] } };
let fatSecretToken: { value: string; expiresAt: number } | null = null;

const normalizeOff = (product: OffProduct) => {
  const nutrients = product.nutriments ?? {}; const sodiumGrams = numberValue(nutrients.sodium_100g);
  return { provider: 'open_food_facts', providerId: product.code ?? null, servingId: null, name: product.product_name?.trim() || 'Unnamed packaged food', brand: product.brands?.trim() || null, basis: 'per_100g', servingQuantityGrams: numberValue(product.serving_quantity), servingLabel: product.serving_size ?? null, nutrients: { calories: numberValue(nutrients['energy-kcal_100g']), proteinGrams: numberValue(nutrients.proteins_100g), carbohydrateGrams: numberValue(nutrients.carbohydrates_100g), fatGrams: numberValue(nutrients.fat_100g), sodiumMilligrams: sodiumGrams === null ? null : sodiumGrams * 1000 }, confidence: product.product_name && product.code ? 'medium' : 'low', attribution: 'Open Food Facts contributors', sourceUrl: product.code ? `https://world.openfoodfacts.org/product/${product.code}` : 'https://world.openfoodfacts.org/' };
};

const normalizeFatSecret = (food: FatFood) => {
  const rawServing = food.servings?.serving; const servings = Array.isArray(rawServing) ? rawServing : rawServing ? [rawServing] : [];
  const serving = servings.find((item) => item.metric_serving_unit === 'g' && numberValue(item.metric_serving_amount) === 100) ?? servings[0];
  return { provider: 'fatsecret', providerId: food.food_id ?? null, servingId: serving?.serving_id ?? null, name: food.food_name?.trim() || 'Unnamed food', brand: food.brand_name?.trim() || null, basis: 'per_serving', servingQuantityGrams: serving?.metric_serving_unit === 'g' ? numberValue(serving.metric_serving_amount) : null, servingLabel: serving?.serving_description ?? null, nutrients: { calories: numberValue(serving?.calories), proteinGrams: numberValue(serving?.protein), carbohydrateGrams: numberValue(serving?.carbohydrate), fatGrams: numberValue(serving?.fat), sodiumMilligrams: numberValue(serving?.sodium) }, confidence: food.food_id && serving ? 'medium' : 'low', attribution: 'FatSecret', sourceUrl: food.food_url ?? 'https://foods.fatsecret.com/' };
};

async function getFatSecretToken() {
  if (fatSecretToken && fatSecretToken.expiresAt > Date.now() + 60000) return fatSecretToken.value;
  const clientId = Deno.env.get('FATSECRET_CLIENT_ID'); const clientSecret = Deno.env.get('FATSECRET_CLIENT_SECRET');
  if (!clientId || !clientSecret) throw new Error('FatSecret credentials are not configured.');
  const response = await fetch('https://oauth.fatsecret.com/connect/token', { method: 'POST', headers: { Authorization: `Basic ${btoa(`${clientId}:${clientSecret}`)}`, 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams({ grant_type: 'client_credentials', scope: 'basic premier' }) });
  if (!response.ok) throw new Error('FatSecret Premier access is not active for these credentials.');
  const data = await response.json() as { access_token: string; expires_in: number };
  fatSecretToken = { value: data.access_token, expiresAt: Date.now() + data.expires_in * 1000 };
  return data.access_token;
}

async function searchFatSecret(query: string) {
  const token = await getFatSecretToken(); const endpoint = new URL('https://platform.fatsecret.com/rest/foods/search/v5');
  endpoint.searchParams.set('search_expression', query); endpoint.searchParams.set('max_results', '5'); endpoint.searchParams.set('format', 'json');
  const response = await fetch(endpoint, { headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' } });
  if (!response.ok) throw new Error(response.status === 429 ? 'FatSecret is temporarily rate limited.' : 'FatSecret could not complete this lookup.');
  const raw = await response.json() as { foods_search?: { results?: { food?: FatFood | FatFood[] } } };
  const value = raw.foods_search?.results?.food; const foods = Array.isArray(value) ? value : value ? [value] : [];
  return { provider: 'fatsecret', query, results: foods.map(normalizeFatSecret), cached: false };
}

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (request.method !== 'POST') return Response.json({ error: 'Use POST.' }, { status: 405, headers: corsHeaders });
  const supabaseUrl = Deno.env.get('SUPABASE_URL'); const anonKey = Deno.env.get('SUPABASE_ANON_KEY'); const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY'); const authorization = request.headers.get('Authorization');
  if (!supabaseUrl || !anonKey || !serviceKey || !authorization) return Response.json({ error: 'Authentication required.' }, { status: 401, headers: corsHeaders });
  const userClient = createClient(supabaseUrl, anonKey, { global: { headers: { Authorization: authorization } } }); const { data: { user } } = await userClient.auth.getUser();
  if (!user) return Response.json({ error: 'Authentication required.' }, { status: 401, headers: corsHeaders });
  let body: { query?: string; provider?: 'open_food_facts' | 'fatsecret' };
  try { body = await request.json(); } catch { return Response.json({ error: 'Invalid JSON body.' }, { status: 400, headers: corsHeaders }); }
  const query = body.query?.trim().replace(/\s+/g, ' '); const provider = body.provider ?? 'open_food_facts';
  if (!query || query.length < 2 || query.length > 120) return Response.json({ error: 'Ingredient search must contain 2 to 120 characters.' }, { status: 400, headers: corsHeaders });
  if (provider === 'fatsecret') {
    try { return Response.json(await searchFatSecret(query), { headers: { ...corsHeaders, 'Cache-Control': 'no-store' } }); }
    catch (error) { return Response.json({ error: error instanceof Error ? error.message : 'FatSecret lookup failed.', retryable: true }, { status: 502, headers: corsHeaders }); }
  }
  const queryKey = query.toLocaleLowerCase('en-US'); const admin = createClient(supabaseUrl, serviceKey);
  const { data: cached } = await admin.from('nutrition_provider_cache').select('payload, expires_at').eq('provider', 'open_food_facts').eq('query_key', queryKey).maybeSingle();
  if (cached && new Date(cached.expires_at).getTime() > Date.now()) return Response.json({ ...cached.payload as object, cached: true }, { headers: { ...corsHeaders, 'Cache-Control': 'private, max-age=300' } });
  const endpoint = new URL('https://world.openfoodfacts.org/api/v2/search'); endpoint.searchParams.set('search_terms', query); endpoint.searchParams.set('page_size', '5'); endpoint.searchParams.set('fields', 'code,product_name,brands,serving_quantity,serving_size,nutriments');
  const response = await fetch(endpoint, { headers: { 'User-Agent': 'CraveKeep/0.1 (api@cravekeep.com)', Accept: 'application/json' } });
  if (response.status === 429 || response.status === 503) return Response.json({ error: 'Open Food Facts is temporarily rate limited. Try again later.', retryable: true }, { status: 503, headers: corsHeaders });
  if (!response.ok) return Response.json({ error: 'Open Food Facts could not complete this lookup.', retryable: true }, { status: 502, headers: corsHeaders });
  const raw = await response.json() as { products?: OffProduct[] }; const payload = { provider: 'open_food_facts', query, results: (raw.products ?? []).map(normalizeOff), cached: false };
  await admin.from('nutrition_provider_cache').upsert({ provider: 'open_food_facts', query_key: queryKey, payload, fetched_at: new Date().toISOString(), expires_at: new Date(Date.now() + 86400000).toISOString() });
  return Response.json(payload, { headers: { ...corsHeaders, 'Cache-Control': 'private, max-age=300' } });
});
