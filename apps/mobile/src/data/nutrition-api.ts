import { supabase } from './supabase';

export type NutritionCandidate = { provider: 'usda' | 'open_food_facts' | 'fatsecret'; providerId: string | null; servingId?: string | null; name: string; brand: string | null; basis: 'per_100g' | 'per_serving'; servingQuantityGrams: number | null; servingLabel: string | null; nutrients: { calories: number | null; proteinGrams: number | null; carbohydrateGrams: number | null; fatGrams: number | null; sodiumMilligrams: number | null }; confidence: 'low' | 'medium'; attribution: string; sourceUrl: string };

async function searchNutrition(query: string, provider: NutritionCandidate['provider']): Promise<NutritionCandidate[]> {
  if (!supabase) throw new Error('Cloud nutrition lookup is not configured.');
  const { data, error } = await supabase.functions.invoke<{ results: NutritionCandidate[] }>('nutrition-lookup', { body: { query, provider } });
  if (error) throw new Error(`${provider} lookup is temporarily unavailable.`);
  return data?.results ?? [];
}

export const searchUsdaNutrition = (query: string) => searchNutrition(query, 'usda');

export async function searchPackagedNutrition(query: string): Promise<NutritionCandidate[]> {
  return searchNutrition(query, 'open_food_facts');
}

export async function searchFatSecretNutrition(query: string): Promise<NutritionCandidate[]> {
  return searchNutrition(query, 'fatsecret');
}
