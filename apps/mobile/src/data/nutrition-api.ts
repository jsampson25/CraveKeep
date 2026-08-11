import { supabase } from './supabase';

export type NutritionCandidate = { provider: 'open_food_facts'; providerId: string | null; name: string; brand: string | null; basis: 'per_100g'; servingQuantityGrams: number | null; servingLabel: string | null; nutrients: { calories: number | null; proteinGrams: number | null; carbohydrateGrams: number | null; fatGrams: number | null; sodiumMilligrams: number | null }; confidence: 'low' | 'medium'; attribution: string; sourceUrl: string };

export async function searchPackagedNutrition(query: string): Promise<NutritionCandidate[]> {
  if (!supabase) throw new Error('Cloud nutrition lookup is not configured.');
  const { data, error } = await supabase.functions.invoke<{ results: NutritionCandidate[] }>('nutrition-lookup', { body: { query } });
  if (error) throw new Error('Packaged-food lookup is temporarily unavailable.');
  return data?.results ?? [];
}
