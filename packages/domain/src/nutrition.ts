import type { Recipe } from './recipe';

export type NutritionMetrics = { calories: number; proteinGrams: number; carbohydrateGrams: number; fatGrams: number; sodiumMilligrams: number };
export type NutritionProvider = 'usda' | 'open_food_facts' | 'fatsecret';
export type IngredientNutritionMatch = {
  ingredientId: string;
  ingredientName: string;
  provider: NutritionProvider;
  providerId: string;
  servingId?: string;
  matchedName: string;
  grams: number;
  basisGrams: number;
  nutrients: NutritionMetrics;
  confidence: 'low' | 'medium' | 'high';
};
export type RecipeNutritionEstimate = {
  recipeId: string;
  servings: number;
  matches: IngredientNutritionMatch[];
  total: NutritionMetrics;
  perServing: NutritionMetrics;
  coverage: number;
  confidence: 'low' | 'medium' | 'high';
  calculatedAt: string;
  servingAssumption: string;
};

const zero = (): NutritionMetrics => ({ calories: 0, proteinGrams: 0, carbohydrateGrams: 0, fatGrams: 0, sodiumMilligrams: 0 });
const rounded = (value: number) => Math.round(value * 10) / 10;

export function calculateRecipeNutrition(recipe: Recipe, matches: IngredientNutritionMatch[], now = new Date()): RecipeNutritionEstimate {
  const valid = matches.filter((match) => match.grams > 0 && match.basisGrams > 0 && recipe.ingredients.some((ingredient) => ingredient.id === match.ingredientId));
  const total = valid.reduce((sum, match) => {
    const factor = match.grams / match.basisGrams;
    return { calories: sum.calories + match.nutrients.calories * factor, proteinGrams: sum.proteinGrams + match.nutrients.proteinGrams * factor, carbohydrateGrams: sum.carbohydrateGrams + match.nutrients.carbohydrateGrams * factor, fatGrams: sum.fatGrams + match.nutrients.fatGrams * factor, sodiumMilligrams: sum.sodiumMilligrams + match.nutrients.sodiumMilligrams * factor };
  }, zero());
  const coverage = recipe.ingredients.length ? valid.length / recipe.ingredients.length : 0;
  const confidence = coverage === 1 && valid.every((match) => match.confidence === 'high') ? 'high' : coverage >= 0.8 && valid.every((match) => match.confidence !== 'low') ? 'medium' : 'low';
  const normalizedTotal = Object.fromEntries(Object.entries(total).map(([key, value]) => [key, rounded(value)])) as NutritionMetrics;
  const perServing = Object.fromEntries(Object.entries(normalizedTotal).map(([key, value]) => [key, rounded(value / recipe.servings)])) as NutritionMetrics;
  return { recipeId: recipe.id, servings: recipe.servings, matches: valid, total: normalizedTotal, perServing, coverage, confidence, calculatedAt: now.toISOString(), servingAssumption: `Calculated for ${recipe.servings} servings using user-confirmed ingredient weights.` };
}
