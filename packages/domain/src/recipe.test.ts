import { describe, expect, it } from 'vitest';
import { compareRecipeVersions, createImportedRecipe, createManualRecipe, createRecipeVersion, extractStepTimers, scaleIngredientQuantity, validateRecipeDraft } from './recipe';

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

  it('extracts suggested timers from directions', () => {
    expect(extractStepTimers(['Bake for 25 minutes.', 'Rest for 30 seconds.'])).toEqual([{ stepIndex: 0, seconds: 1500, label: 'Step 1' }, { stepIndex: 1, seconds: 30, label: 'Step 2' }]);
  });

  it('scales simple numeric quantities without inventing complex conversions', () => {
    expect(scaleIngredientQuantity('2', 4, 6)).toBe('3');
    expect(scaleIngredientQuantity('1/2 cup', 4, 6)).toBe('1/2 cup');
  });

  it('keeps attribution on an imported original', () => {
    const recipe = createImportedRecipe(validDraft, { url: 'https://example.com/recipe', label: 'example.com', creator: 'Example Cook', mediaType: 'webpage' });
    expect(recipe.source.kind).toBe('imported');
    expect(recipe.source.mediaType).toBe('webpage');
    expect(recipe.source.url).toBe('https://example.com/recipe');
    expect(recipe.privacy).toBe('private');
  });
});

describe('recipe version rules', () => {
  it('creates a new version without mutating the original', () => {
    const original = createManualRecipe(validDraft, new Date('2026-08-10T12:00:00.000Z'));
    const version = createRecipeVersion(original, { ...validDraft, title: 'Higher Protein Tomato Toast' }, { goal: 'higher_protein', tasteProtection: 'balanced' }, new Date('2026-08-11T12:00:00.000Z'));
    expect(version.id).not.toBe(original.id);
    expect(version.originalRecipeId).toBe(original.id);
    expect(version.version).toBe(2);
    expect(original.title).toBe('Tomato Toast');
  });

  it('reports exact ingredient and step changes', () => {
    const original = createManualRecipe(validDraft);
    const comparison = compareRecipeVersions(original, { ...validDraft, ingredients: [{ id: 'i1', quantity: '1', name: 'slices of bread' }, { id: 'i2', quantity: '2 tbsp', name: 'cottage cheese' }], steps: ['Toast and top the bread.'] });
    expect(comparison.addedIngredients).toEqual(['cottage cheese']);
    expect(comparison.changedQuantities[0]).toEqual({ name: 'slices of bread', before: '2', after: '1' });
    expect(comparison.stepsChanged).toBe(true);
  });
});
