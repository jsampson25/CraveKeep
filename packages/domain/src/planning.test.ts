import { describe, expect, it } from 'vitest';
import type { RecipeNutritionEstimate } from './nutrition';
import { summarizePlannedDay, type DailyNutritionTargets, type PlannedMeal } from './planning';

const targets: DailyNutritionTargets = { calories: 2000, proteinGrams: 150, carbohydrateGrams: 220, fatGrams: 70, sodiumMilligrams: 2300 };
const estimate = { recipeId: 'r1', servings: 2, matches: [], total: { calories: 1000, proteinGrams: 60, carbohydrateGrams: 100, fatGrams: 40, sodiumMilligrams: 1200 }, perServing: { calories: 500, proteinGrams: 30, carbohydrateGrams: 50, fatGrams: 20, sodiumMilligrams: 600 }, coverage: 1, confidence: 'high', calculatedAt: '2026-08-11T00:00:00Z', servingAssumption: 'Two servings.' } satisfies RecipeNutritionEstimate;

describe('daily planning', () => {
  it('separates eaten and planned values before calculating remaining targets', () => {
    const meals: PlannedMeal[] = [{ id: 'm1', date: '2026-08-11', slot: 'lunch', recipeId: 'r1', servings: 1, status: 'eaten', createdAt: '2026-08-11T12:00:00Z' }, { id: 'm2', date: '2026-08-11', slot: 'dinner', recipeId: 'r1', servings: 0.5, status: 'planned', createdAt: '2026-08-11T13:00:00Z' }];
    const result = summarizePlannedDay(meals, [estimate], targets);
    expect(result.eaten.calories).toBe(500); expect(result.planned.calories).toBe(250); expect(result.remaining.calories).toBe(1250);
  });
});
