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

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders(request) });
  if (request.method !== 'POST') return Response.json({ error: 'Use POST.' }, { status: 405, headers: corsHeaders(request) });

  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const anonKey = Deno.env.get('SUPABASE_ANON_KEY');
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  const openAiKey = Deno.env.get('OPENAI_API_KEY');
  const authorization = request.headers.get('Authorization');
  if (!supabaseUrl || !anonKey || !serviceKey || !authorization) return Response.json({ error: 'Authentication required.' }, { status: 401, headers: corsHeaders(request) });
  if (!openAiKey) return Response.json({ error: 'Recipe image extraction is not configured yet.' }, { status: 503, headers: corsHeaders(request) });

  const userClient = createClient(supabaseUrl, anonKey, { global: { headers: { Authorization: authorization } } });
  const { data: { user } } = await userClient.auth.getUser();
  if (!user) return Response.json({ error: 'Authentication required.' }, { status: 401, headers: corsHeaders(request) });

  let body: { storagePath?: unknown; title?: unknown };
  try { body = await request.json(); } catch { return Response.json({ error: 'Invalid JSON body.' }, { status: 400, headers: corsHeaders(request) }); }
  if (!body || typeof body.storagePath !== 'string' || !body.storagePath.startsWith(user.id + '/')) return Response.json({ error: 'A private recipe image is required.' }, { status: 400, headers: corsHeaders(request) });
  const title = typeof body.title === 'string' && body.title.trim() ? body.title.trim().slice(0, 200) : 'Scanned recipe';

  const admin = createClient(supabaseUrl, serviceKey);
  const { data: signed, error: signedError } = await admin.storage.from('recipe-imports').createSignedUrl(body.storagePath, 300);
  if (signedError || !signed?.signedUrl) return Response.json({ error: 'The private recipe image could not be opened.' }, { status: 502, headers: corsHeaders(request) });

  const prompt = `Read this recipe image and return only valid JSON with this shape: {"title":string,"description":string,"servings":number,"prepMinutes":number,"cookMinutes":number,"ingredients":[{"id":string,"quantity":string,"name":string}],"steps":[string]}. Preserve uncertain values conservatively, use empty strings or zero when unreadable, and never invent ingredients. The user-provided filename is "${title}".`;
  let providerResponse: Response;
  try {
    providerResponse = await fetch('https://api.openai.com/v1/responses', { method: 'POST', headers: { Authorization: `Bearer ${openAiKey}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ model: Deno.env.get('OPENAI_RECIPE_MODEL') ?? 'gpt-4.1-mini', input: [{ role: 'user', content: [{ type: 'input_text', text: prompt }, { type: 'input_image', image_url: signed.signedUrl, detail: 'high' }] }] }) });
  } catch {
    return Response.json({ error: 'Recipe image extraction is temporarily unavailable.' }, { status: 502, headers: corsHeaders(request) });
  }
  if (!providerResponse.ok) return Response.json({ error: 'Recipe image extraction is temporarily unavailable.' }, { status: 502, headers: corsHeaders(request) });

  const raw = await providerResponse.json() as { output_text?: string };
  let draft: RecipeDraft;
  try {
    draft = JSON.parse(raw.output_text ?? '') as RecipeDraft;
    if (!draft.title || !Array.isArray(draft.ingredients) || !Array.isArray(draft.steps)) throw new Error('Invalid extraction');
  } catch {
    return Response.json({ error: 'The recipe image could not be read reliably.' }, { status: 422, headers: corsHeaders(request) });
  }
  const payload: ExtractionResponse = { status: 'needs_review', draft, warnings: ['Review the extracted text and quantities before saving.'] };
  return Response.json(payload, { headers: { ...corsHeaders(request), 'Cache-Control': 'no-store' } });
});
