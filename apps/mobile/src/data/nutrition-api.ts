import { supabase } from './supabase';

export type NutritionCandidate = { provider: 'open_food_facts' | 'fatsecret'; providerId: string | null; servingId?: string | null; name: string; brand: string | null; basis: 'per_100g' | 'per_serving'; servingQuantityGrams: number | null; servingLabel: string | null; nutrients: { calories: number | null; proteinGrams: number | null; carbohydrateGrams: number | null; fatGrams: number | null; sodiumMilligrams: number | null }; confidence: 'low' | 'medium'; attribution: string; sourceUrl: string };

export async function searchPackagedNutrition(query: string): Promise<NutritionCandidate[]> {
  if (!supabase) throw new Error('Cloud nutrition lookup is not configured.');
  const { data, error } = await supabase.functions.invoke<{ results: NutritionCandidate[] }>('nutrition-lookup', { body: { query } });
  if (error) throw new Error('Packaged-food lookup is temporarily unavailable.');
  return data?.results ?? [];
}

export async function searchFatSecretNutrition(query: string): Promise<NutritionCandidate[]> {
  if (!supabase) throw new Error('Cloud nutrition lookup is not configured.');
  const { data, error } = await supabase.functions.invoke<{ results: NutritionCandidate[] }>('nutrition-lookup', { body: { query, provider: 'fatsecret' } });
  if (error) throw new Error('FatSecret lookup is temporarily unavailable.');
  return data?.results ?? [];
}
