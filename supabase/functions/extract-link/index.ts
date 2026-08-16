import { createClient } from 'npm:@supabase/supabase-js@2.90.1';

const allowedOrigins = new Set((Deno.env.get('CRAVEKEEP_ALLOWED_ORIGINS') ?? 'https://cravekeep.com,https://www.cravekeep.com').split(',').map((origin) => origin.trim()).filter(Boolean));
const corsHeaders = (request: Request) => {
  const headers: Record<string, string> = { 'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type', 'Access-Control-Allow-Methods': 'POST, OPTIONS', Vary: 'Origin' };
  const origin = request.headers.get('Origin');
  if (origin && allowedOrigins.has(origin)) headers['Access-Control-Allow-Origin'] = origin;
  return headers;
};

type RecipeDraft = { title: string; description: string; servings: number; prepMinutes: number; cookMinutes: number; ingredients: { id: string; quantity: string; name: string }[]; steps: string[] };
type ExtractionResponse = { status: 'needs_review'; draft: RecipeDraft; warnings: string[]; recoveryCode?: 'missing_recipe_data' };

const text = (value: unknown) => typeof value === 'string' ? value.trim() : '';
const numberValue = (value: unknown) => typeof value === 'number' && Number.isFinite(value) ? Math.max(0, Math.round(value)) : 0;
const findRecipe = (value: unknown): Record<string, unknown> | null => {
  if (Array.isArray(value)) {
    for (const item of value) { const found = findRecipe(item); if (found) return found; }
    return null;
  }
  if (!value || typeof value !== 'object') return null;
  const object = value as Record<string, unknown>;
  const type = object['@type'];
  if (type === 'Recipe' || (Array.isArray(type) && type.includes('Recipe'))) return object;
  if (Array.isArray(object['@graph'])) return findRecipe(object['@graph']);
  return null;
};
const parseJsonLd = (html: string) => {
  const matches = [...html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
  for (const match of matches) {
    try { const recipe = findRecipe(JSON.parse(match[1] ?? '')); if (recipe) return recipe; } catch { /* try the next JSON-LD block */ }
  }
  return null;
};
const instructionText = (value: unknown) => Array.isArray(value) ? value.map((item) => typeof item === 'string' ? item.trim() : item && typeof item === 'object' ? text((item as Record<string, unknown>).text) : '').filter(Boolean) : [];
const ingredientText = (value: unknown) => Array.isArray(value) ? value.map((item) => text(item)).filter(Boolean) : [];
const metaContent = (html: string, selector: string) => {
  const match = html.match(new RegExp(`<meta[^>]+(?:property|name)=["']${selector}["'][^>]+content=["']([^"']+)["'][^>]*>`, 'i')) ?? html.match(new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["']${selector}["'][^>]*>`, 'i'));
  return match?.[1]?.trim() ?? '';
};
const htmlTitle = (html: string) => html.match(/<title[^>]*>([\\s\\S]*?)<\\/title>/i)?.[1]?.replace(/<[^>]+>/g, '').trim() ?? '';

Deno.serve(async (request: Request) => {
  if (request.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders(request) });
  if (request.method !== 'POST') return Response.json({ error: 'Use POST.' }, { status: 405, headers: corsHeaders(request) });
  const supabaseUrl = Deno.env.get('SUPABASE_URL'); const anonKey = Deno.env.get('SUPABASE_ANON_KEY'); const authorization = request.headers.get('Authorization');
  if (!supabaseUrl || !anonKey || !authorization) return Response.json({ error: 'Authentication required.' }, { status: 401, headers: corsHeaders(request) });
  const userClient = createClient(supabaseUrl, anonKey, { global: { headers: { Authorization: authorization } } }); const { data: { user } } = await userClient.auth.getUser();
  if (!user) return Response.json({ error: 'Authentication required.' }, { status: 401, headers: corsHeaders(request) });
  let body: { url?: unknown; title?: unknown };
  try { body = await request.json(); } catch { return Response.json({ error: 'Invalid JSON body.' }, { status: 400, headers: corsHeaders(request) }); }
  const url = typeof body.url === 'string' ? body.url.trim() : '';
  const title = typeof body.title === 'string' && body.title.trim() ? body.title.trim().slice(0, 200) : 'Imported recipe';
  let parsed: URL;
  try { parsed = new URL(url); if (!['http:', 'https:'].includes(parsed.protocol)) throw new Error('unsupported'); if (parsed.hostname === 'localhost' || parsed.hostname.endsWith('.local') || /^127\.|^10\.|^192\.168\.|^169\.254\./.test(parsed.hostname)) throw new Error('private'); } catch { return Response.json({ error: 'The recipe link is not valid for server extraction.' }, { status: 400, headers: corsHeaders(request) }); }
  try {
    const response = await fetch(parsed.toString(), { headers: { Accept: 'text/html,application/xhtml+xml', 'User-Agent': 'CraveKeep/0.1' }, signal: AbortSignal.timeout(10000) });
    if (!response.ok) throw new Error('upstream');
    const html = await response.text();
    const recipe = parseJsonLd(html);
    if (!recipe) {
      const host = parsed.hostname.toLowerCase();
      const isVideo = host.includes('youtube.') || host === 'youtu.be' || host.includes('vimeo.') || host.includes('tiktok.');
      const pageTitle = metaContent(html, 'og:title') || htmlTitle(html) || title;
      const description = metaContent(html, 'og:description') || metaContent(html, 'description');
      const warning = isVideo
        ? 'Video captured successfully. Recipe details require transcript access; review the video and add ingredients and directions before saving.'
        : 'This link did not expose standard recipe metadata. The original source is attached for manual completion.';
      return Response.json({ status: 'needs_review', draft: { title: pageTitle.slice(0, 200), description, servings: 1, prepMinutes: 0, cookMinutes: 0, ingredients: [], steps: [] }, warnings: [warning], recoveryCode: 'missing_recipe_data' } satisfies ExtractionResponse, { headers: { ...corsHeaders(request), 'Cache-Control': 'no-store' } });
    }
    const ingredients = ingredientText(recipe.recipeIngredient);
    const steps = instructionText(recipe.recipeInstructions);
    const draft: RecipeDraft = { title: text(recipe.name) || title, description: text(recipe.description), servings: numberValue(recipe.recipeYield) || 1, prepMinutes: numberValue(recipe.prepTime), cookMinutes: numberValue(recipe.cookTime), ingredients: ingredients.map((name, index) => ({ id: `link_i${index + 1}`, quantity: '', name })), steps };
    return Response.json({ status: 'needs_review', draft, warnings: ['Review imported quantities and directions before saving.'] } satisfies ExtractionResponse, { headers: { ...corsHeaders(request), 'Cache-Control': 'no-store' } });
  } catch {
    return Response.json({ status: 'needs_review', draft: { title, description: '', servings: 1, prepMinutes: 0, cookMinutes: 0, ingredients: [], steps: [] }, warnings: ['This source could not be read automatically. The original link is attached for manual completion.'], recoveryCode: 'missing_recipe_data' } satisfies ExtractionResponse, { headers: { ...corsHeaders(request), 'Cache-Control': 'no-store' } });
  }
});
