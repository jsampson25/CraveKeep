export type RecipeId = string;

export type RecipeSource = {
  kind: 'manual' | 'sample' | 'imported';
  platform?: 'website' | 'pinterest' | 'youtube' | 'tiktok' | 'instagram' | 'facebook' | 'vimeo';
  externalId?: string;
  imageUrl?: string;
  label: string;
  url?: string;
  creator?: string;
  capturedAt: string;
};

export type Ingredient = {
  id: string;
  quantity: string;
  name: string;
};

export type Recipe = {
  id: RecipeId;
  title: string;
  description: string;
  servings: number;
  prepMinutes: number;
  cookMinutes: number;
  ingredients: Ingredient[];
  steps: string[];
  source: RecipeSource;
  privacy: 'private';
  favorite: boolean;
  cookbookIds: string[];
  createdAt: string;
  updatedAt: string;
  version: number;
  originalRecipeId?: RecipeId;
  adaptation?: {
    goal: AdaptationGoal;
    tasteProtection: TasteProtection;
  };
};

export type AdaptationGoal = 'healthier_overall' | 'higher_protein' | 'lower_calorie' | 'lower_sodium';
export type TasteProtection = 'nearly_identical' | 'balanced' | 'maximum_change';

export type RecipeComparison = {
  addedIngredients: string[];
  removedIngredients: string[];
  changedQuantities: { name: string; before: string; after: string }[];
  stepsChanged: boolean;
};

export type RecipeDraft = Pick<
  Recipe,
  'title' | 'description' | 'servings' | 'prepMinutes' | 'cookMinutes' | 'ingredients' | 'steps'
>;

export type RecipeValidationError = {
  field: 'title' | 'servings' | 'ingredients' | 'steps' | 'time';
  message: string;
};

export function validateRecipeDraft(draft: RecipeDraft): RecipeValidationError[] {
  const errors: RecipeValidationError[] = [];

  if (!draft.title.trim()) errors.push({ field: 'title', message: 'Give your recipe a name.' });
  if (!Number.isInteger(draft.servings) || draft.servings < 1 || draft.servings > 100) {
    errors.push({ field: 'servings', message: 'Servings must be between 1 and 100.' });
  }
  if (draft.prepMinutes < 0 || draft.cookMinutes < 0) {
    errors.push({ field: 'time', message: 'Cooking times cannot be negative.' });
  }
  if (!draft.ingredients.some((ingredient) => ingredient.name.trim())) {
    errors.push({ field: 'ingredients', message: 'Add at least one ingredient.' });
  }
  if (!draft.steps.some((step) => step.trim())) {
    errors.push({ field: 'steps', message: 'Add at least one cooking step.' });
  }

  return errors;
}

export function createManualRecipe(draft: RecipeDraft, now = new Date()): Recipe {
  const errors = validateRecipeDraft(draft);
  if (errors.length) throw new Error(errors.map((error) => error.message).join(' '));

  const timestamp = now.toISOString();
  return {
    ...draft,
    id: `recipe_${timestamp}_${Math.random().toString(36).slice(2, 9)}`,
    title: draft.title.trim(),
    description: draft.description.trim(),
    ingredients: draft.ingredients
      .filter((ingredient) => ingredient.name.trim())
      .map((ingredient) => ({ ...ingredient, name: ingredient.name.trim(), quantity: ingredient.quantity.trim() })),
    steps: draft.steps.map((step) => step.trim()).filter(Boolean),
    source: { kind: 'manual', label: 'Created by you', capturedAt: timestamp },
    privacy: 'private',
    favorite: false,
    cookbookIds: [],
    createdAt: timestamp,
    updatedAt: timestamp,
    version: 1
  };
}

export function createImportedRecipe(draft: RecipeDraft, source: { url?: string; label: string; creator?: string; platform?: RecipeSource['platform']; externalId?: string; imageUrl?: string }, now = new Date()): Recipe {
  const recipe = createManualRecipe(draft, now);
  return {
    ...recipe,
    source: { kind: 'imported', label: source.label, url: source.url, creator: source.creator, platform: source.platform, externalId: source.externalId, imageUrl: source.imageUrl, capturedAt: recipe.createdAt }
  };
}

export function compareRecipeVersions(original: Recipe, draft: RecipeDraft): RecipeComparison {
  const before = new Map(original.ingredients.map((item) => [item.name.trim().toLowerCase(), item]));
  const after = new Map(draft.ingredients.map((item) => [item.name.trim().toLowerCase(), item]));
  const addedIngredients = [...after.keys()].filter((name) => name && !before.has(name)).map((name) => after.get(name)!.name);
  const removedIngredients = [...before.keys()].filter((name) => !after.has(name)).map((name) => before.get(name)!.name);
  const changedQuantities = [...after.keys()].flatMap((name) => {
    const previous = before.get(name);
    const next = after.get(name);
    return previous && next && previous.quantity.trim() !== next.quantity.trim() ? [{ name: next.name, before: previous.quantity, after: next.quantity }] : [];
  });
  const stepsChanged = original.steps.map((step) => step.trim()).join('\n') !== draft.steps.map((step) => step.trim()).join('\n');
  return { addedIngredients, removedIngredients, changedQuantities, stepsChanged };
}

export function createRecipeVersion(original: Recipe, draft: RecipeDraft, adaptation: NonNullable<Recipe['adaptation']>, now = new Date()): Recipe {
  const base = createManualRecipe(draft, now);
  return {
    ...base,
    source: original.source,
    originalRecipeId: original.originalRecipeId ?? original.id,
    version: original.version + 1,
    adaptation
  };
}

export function scaleIngredientQuantity(quantity: string, fromServings: number, toServings: number): string {
  const numeric = Number(quantity);
  if (!Number.isFinite(numeric) || fromServings <= 0 || toServings <= 0) return quantity;
  const scaled = (numeric * toServings) / fromServings;
  return Number.isInteger(scaled) ? String(scaled) : scaled.toFixed(2).replace(/0+$/, '').replace(/\.$/, '');
}
