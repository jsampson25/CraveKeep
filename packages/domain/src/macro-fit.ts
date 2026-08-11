import type { NutritionMetrics, RecipeNutritionEstimate } from './nutrition';

export type MacroFitMode = 'preserve' | 'balanced' | 'exact';
export type MacroTargets = Partial<NutritionMetrics>;
export type MacroFitResult = {
  mode: MacroFitMode;
  servingFactor: number;
  fitted: NutritionMetrics;
  remaining: Partial<NutritionMetrics>;
  target: MacroTargets;
  explanation: string;
  tradeoffs: string[];
};

const keys: (keyof NutritionMetrics)[] = ['calories', 'proteinGrams', 'carbohydrateGrams', 'fatGrams', 'sodiumMilligrams'];
const rounded = (value: number) => Math.round(value * 10) / 10;

function scoreFit(perServing: NutritionMetrics, targets: MacroTargets, factor: number) {
  return keys.reduce((score, key) => {
    const target = targets[key];
    return target && target > 0 ? score + Math.abs(perServing[key] * factor - target) / target : score;
  }, 0);
}

export function fitRecipeToTargets(estimate: RecipeNutritionEstimate, targets: MacroTargets, mode: MacroFitMode): MacroFitResult {
  const activeTargets = keys.filter((key) => targets[key] !== undefined && targets[key]! >= 0);
  if (!activeTargets.length) throw new Error('Enter at least one nutrition target.');
  const [minimum, maximum] = mode === 'preserve' ? [1, 1] : mode === 'balanced' ? [0.75, 1.25] : [0.5, 1.5];
  let servingFactor = minimum;
  let bestScore = scoreFit(estimate.perServing, targets, minimum);
  for (let factor = minimum + 0.05; factor <= maximum + 0.001; factor += 0.05) {
    const candidate = scoreFit(estimate.perServing, targets, factor);
    if (candidate < bestScore) { servingFactor = factor; bestScore = candidate; }
  }
  servingFactor = rounded(servingFactor);
  const fitted = Object.fromEntries(keys.map((key) => [key, rounded(estimate.perServing[key] * servingFactor)])) as NutritionMetrics;
  const remaining = Object.fromEntries(activeTargets.map((key) => [key, rounded(targets[key]! - fitted[key])])) as Partial<NutritionMetrics>;
  const explanation = mode === 'preserve'
    ? 'Keeps one original serving unchanged and shows what remains for the rest of the meal or day.'
    : mode === 'balanced'
      ? 'Adjusts the portion moderately between 0.75 and 1.25 servings. Ingredient edits remain an explicit remix.'
      : 'Optimizes the portion between 0.5 and 1.5 servings. Any remaining gap must be handled with transparent sides or recipe edits.';
  const tradeoffs = servingFactor < 1 ? ['Smaller portion than the recipe serving assumption.'] : servingFactor > 1 ? ['Larger portion than the recipe serving assumption.'] : ['Original serving size is preserved.'];
  if (Object.values(remaining).some((value) => value !== undefined && value < 0)) tradeoffs.push('At least one target is exceeded; CraveKeep will not call this an exact match.');
  return { mode, servingFactor, fitted, remaining, target: targets, explanation, tradeoffs };
}

export function compareNutritionEstimates(original: RecipeNutritionEstimate, remix: RecipeNutritionEstimate) {
  return Object.fromEntries(keys.map((key) => [key, rounded(remix.perServing[key] - original.perServing[key])])) as NutritionMetrics;
}
