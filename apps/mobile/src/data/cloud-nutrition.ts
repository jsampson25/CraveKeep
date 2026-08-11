import type { RecipeNutritionEstimate } from '@cravekeep/domain';
import { supabase } from './supabase';

export async function saveCloudNutrition(estimate: RecipeNutritionEstimate, ownerId: string): Promise<void> {
  if (!supabase || !/^[0-9a-f-]{36}$/i.test(estimate.recipeId)) return;
  const { data, error } = await supabase.from('recipe_nutrition_estimates').upsert({ recipe_id: estimate.recipeId, owner_id: ownerId, servings: estimate.servings, calories: estimate.total.calories, protein_grams: estimate.total.proteinGrams, carbohydrate_grams: estimate.total.carbohydrateGrams, fat_grams: estimate.total.fatGrams, sodium_milligrams: estimate.total.sodiumMilligrams, coverage: estimate.coverage, confidence: estimate.confidence, serving_assumption: estimate.servingAssumption, calculated_at: estimate.calculatedAt }, { onConflict: 'recipe_id' }).select('id').single();
  if (error) throw error;
  const removed = await supabase.from('nutrition_ingredient_matches').delete().eq('estimate_id', data.id);
  if (removed.error) throw removed.error;
  const inserted = await supabase.from('nutrition_ingredient_matches').insert(estimate.matches.map((match, position) => ({ estimate_id: data.id, position, ingredient_id: match.ingredientId, ingredient_name: match.ingredientName, provider: match.provider, provider_id: match.providerId, serving_id: match.servingId, matched_name: match.matchedName, grams: match.grams, basis_grams: match.basisGrams, calories: match.nutrients.calories, protein_grams: match.nutrients.proteinGrams, carbohydrate_grams: match.nutrients.carbohydrateGrams, fat_grams: match.nutrients.fatGrams, sodium_milligrams: match.nutrients.sodiumMilligrams, confidence: match.confidence })));
  if (inserted.error) throw inserted.error;
}
