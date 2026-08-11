import { describe, expect, it } from 'vitest';
import { createManualRecipe } from './recipe';
import { calculateRecipeNutrition } from './nutrition';

describe('recipe nutrition estimates', () => {
  it('scales confirmed ingredient nutrients and reports coverage', () => {
    const recipe = createManualRecipe({ title: 'Toast', description: '', servings: 2, prepMinutes: 1, cookMinutes: 2, ingredients: [{ id: 'bread', quantity: '100 g', name: 'bread' }, { id: 'butter', quantity: '10 g', name: 'butter' }], steps: ['Toast it.'] });
    const estimate = calculateRecipeNutrition(recipe, [{ ingredientId: 'bread', ingredientName: 'bread', provider: 'usda', providerId: '1', matchedName: 'Bread', grams: 100, basisGrams: 100, nutrients: { calories: 250, proteinGrams: 8, carbohydrateGrams: 45, fatGrams: 3, sodiumMilligrams: 400 }, confidence: 'high' }], new Date('2026-08-11T12:00:00Z'));
    expect(estimate.total.calories).toBe(250);
    expect(estimate.perServing.calories).toBe(125);
    expect(estimate.coverage).toBe(0.5);
    expect(estimate.confidence).toBe('low');
  });
});
