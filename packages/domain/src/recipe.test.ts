import { describe, expect, it } from 'vitest';
import { createImportedRecipe, createManualRecipe, scaleIngredientQuantity, validateRecipeDraft } from './recipe';

const validDraft = {
  title: ' Tomato Toast ',
  description: 'Simple lunch',
  servings: 2,
  prepMinutes: 5,
  cookMinutes: 3,
  ingredients: [{ id: 'i1', quantity: '2', name: ' slices of bread ' }],
  steps: [' Toast the bread. ']
};

describe('manual recipe rules', () => {
  it('requires a title, ingredient, and step', () => {
    const errors = validateRecipeDraft({ ...validDraft, title: '', ingredients: [], steps: [] });
    expect(errors.map((error) => error.field)).toEqual(['title', 'ingredients', 'steps']);
  });

  it('creates a private, attributed original', () => {
    const recipe = createManualRecipe(validDraft, new Date('2026-08-10T12:00:00.000Z'));
    expect(recipe.title).toBe('Tomato Toast');
    expect(recipe.privacy).toBe('private');
    expect(recipe.source.kind).toBe('manual');
    expect(recipe.ingredients[0]?.name).toBe('slices of bread');
  });

  it('scales simple numeric quantities without inventing complex conversions', () => {
    expect(scaleIngredientQuantity('2', 4, 6)).toBe('3');
    expect(scaleIngredientQuantity('1/2 cup', 4, 6)).toBe('1/2 cup');
  });

  it('keeps attribution on an imported original', () => {
    const recipe = createImportedRecipe(validDraft, { url: 'https://example.com/recipe', label: 'example.com', creator: 'Example Cook' });
    expect(recipe.source.kind).toBe('imported');
    expect(recipe.source.url).toBe('https://example.com/recipe');
    expect(recipe.privacy).toBe('private');
  });
});
