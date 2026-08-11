import { describe, expect, it } from 'vitest';
import type { RecipeNutritionEstimate } from './nutrition';
import { compareNutritionEstimates, fitRecipeToTargets } from './macro-fit';

const estimate = { recipeId: 'r1', servings: 4, matches: [], total: { calories: 2000, proteinGrams: 160, carbohydrateGrams: 200, fatGrams: 80, sodiumMilligrams: 2400 }, perServing: { calories: 500, proteinGrams: 40, carbohydrateGrams: 50, fatGrams: 20, sodiumMilligrams: 600 }, coverage: 1, confidence: 'high', calculatedAt: '2026-08-11T00:00:00.000Z', servingAssumption: 'Four servings.' } satisfies RecipeNutritionEstimate;

describe('macro fit', () => {
  it('preserves the original serving in preserve mode', () => {
    const result = fitRecipeToTargets(estimate, { calories: 400 }, 'preserve');
    expect(result.servingFactor).toBe(1);
    expect(result.remaining.calories).toBe(-100);
  });

  it('uses a bounded portion adjustment in balanced mode', () => {
    const result = fitRecipeToTargets(estimate, { calories: 400, proteinGrams: 32 }, 'balanced');
    expect(result.servingFactor).toBe(0.8);
    expect(result.fitted.calories).toBe(400);
  });

  it('compares remix nutrition without changing either estimate', () => {
    const remix = { ...estimate, recipeId: 'r2', perServing: { ...estimate.perServing, calories: 425, proteinGrams: 48 } };
    expect(compareNutritionEstimates(estimate, remix)).toMatchObject({ calories: -75, proteinGrams: 8 });
  });
});
