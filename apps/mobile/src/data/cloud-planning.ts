import type { DailyNutritionTargets, PlannedMeal } from '@cravekeep/domain';
import { supabase } from './supabase';

export async function fetchCloudPlan(ownerId: string): Promise<{ targets: DailyNutritionTargets | null; meals: PlannedMeal[] }> {
  if (!supabase) return { targets: null, meals: [] };
  const [targetResult, mealResult] = await Promise.all([
    supabase.from('daily_nutrition_targets').select('*').eq('owner_id', ownerId).maybeSingle(),
    supabase.from('planned_meals').select('*').eq('owner_id', ownerId).order('meal_date').order('created_at')
  ]);
  if (targetResult.error) throw targetResult.error; if (mealResult.error) throw mealResult.error;
  const row = targetResult.data;
  return { targets: row ? { calories: Number(row.calories), proteinGrams: Number(row.protein_grams), carbohydrateGrams: Number(row.carbohydrate_grams), fatGrams: Number(row.fat_grams), sodiumMilligrams: Number(row.sodium_milligrams) } : null, meals: mealResult.data.map((meal) => ({ id: meal.id, date: meal.meal_date, slot: meal.slot, recipeId: meal.recipe_id, servings: Number(meal.servings), status: meal.status, createdAt: meal.created_at })) };
}

export async function saveCloudTargets(ownerId: string, targets: DailyNutritionTargets) {
  if (!supabase) return;
  const { error } = await supabase.from('daily_nutrition_targets').upsert({ owner_id: ownerId, calories: targets.calories, protein_grams: targets.proteinGrams, carbohydrate_grams: targets.carbohydrateGrams, fat_grams: targets.fatGrams, sodium_milligrams: targets.sodiumMilligrams, updated_at: new Date().toISOString() });
  if (error) throw error;
}

export async function saveCloudMeal(ownerId: string, meal: PlannedMeal): Promise<PlannedMeal> {
  if (!supabase) return meal;
  const { data, error } = await supabase.from('planned_meals').insert({ owner_id: ownerId, meal_date: meal.date, slot: meal.slot, recipe_id: meal.recipeId, servings: meal.servings, status: meal.status, created_at: meal.createdAt }).select('id').single();
  if (error) throw error; return { ...meal, id: data.id };
}

export async function setCloudMealStatus(id: string, status: PlannedMeal['status']) { if (!supabase) return; const { error } = await supabase.from('planned_meals').update({ status }).eq('id', id); if (error) throw error; }
export async function setCloudMealServings(id: string, servings: number) { if (!supabase) return; const { error } = await supabase.from('planned_meals').update({ servings }).eq('id', id); if (error) throw error; }
export async function deleteCloudMeal(id: string) { if (!supabase) return; const { error } = await supabase.from('planned_meals').delete().eq('id', id); if (error) throw error; }
