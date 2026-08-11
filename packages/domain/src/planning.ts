import type { NutritionMetrics, RecipeNutritionEstimate } from './nutrition';

export type MealSlot = 'breakfast' | 'lunch' | 'dinner' | 'snack';
export type PlannedMealStatus = 'planned' | 'eaten';
export type DailyNutritionTargets = NutritionMetrics;
export type PlannedMeal = { id: string; date: string; slot: MealSlot; recipeId: string; servings: number; status: PlannedMealStatus; createdAt: string };
export type DailyNutritionSummary = { planned: NutritionMetrics; eaten: NutritionMetrics; remaining: NutritionMetrics; missingEstimateCount: number };

const zero = (): NutritionMetrics => ({ calories: 0, proteinGrams: 0, carbohydrateGrams: 0, fatGrams: 0, sodiumMilligrams: 0 });
const keys = Object.keys(zero()) as (keyof NutritionMetrics)[];
const round = (value: number) => Math.round(value * 10) / 10;

export function summarizePlannedDay(meals: PlannedMeal[], estimates: RecipeNutritionEstimate[], targets: DailyNutritionTargets): DailyNutritionSummary {
  const byRecipe = new Map(estimates.map((estimate) => [estimate.recipeId, estimate]));
  const planned = zero(); const eaten = zero(); let missingEstimateCount = 0;
  for (const meal of meals) {
    const estimate = byRecipe.get(meal.recipeId); if (!estimate) { missingEstimateCount += 1; continue; }
    const bucket = meal.status === 'eaten' ? eaten : planned;
    for (const key of keys) bucket[key] += estimate.perServing[key] * meal.servings;
  }
  for (const key of keys) { planned[key] = round(planned[key]); eaten[key] = round(eaten[key]); }
  const remaining = Object.fromEntries(keys.map((key) => [key, round(targets[key] - planned[key] - eaten[key])])) as NutritionMetrics;
  return { planned, eaten, remaining, missingEstimateCount };
}
