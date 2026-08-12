import type { PlannedMeal } from './planning';
import type { Recipe } from './recipe';

export type GroceryAisle = 'produce' | 'meat_seafood' | 'dairy_eggs' | 'bakery' | 'pantry' | 'frozen' | 'other';
export type GroceryItem = { key: string; name: string; quantity: string; aisle: GroceryAisle; note: string; sourceRecipeIds: string[]; checked: boolean; uncertain: boolean };
export type PantryConfidence = 'confirmed' | 'estimated' | 'unknown';
export type PantryItem = { key: string; name: string; quantity: string; confidence: PantryConfidence; expiresOn?: string; updatedAt: string };
const normalize = (name: string) => name.trim().toLowerCase().replace(/\s+/g, ' ');
const aisleFor = (name: string): GroceryAisle => /milk|cheese|yogurt|egg|butter/.test(name) ? 'dairy_eggs' : /chicken|beef|pork|fish|salmon|shrimp/.test(name) ? 'meat_seafood' : /bread|bun|tortilla/.test(name) ? 'bakery' : /frozen|ice cream/.test(name) ? 'frozen' : /apple|banana|onion|garlic|pepper|tomato|lettuce|spinach|lemon|lime|carrot|potato/.test(name) ? 'produce' : 'pantry';

export function generateGroceryItems(meals: PlannedMeal[], recipes: Recipe[]): GroceryItem[] {
  const byRecipe = new Map(recipes.map((recipe) => [recipe.id, recipe])); const grouped = new Map<string, GroceryItem>();
  for (const meal of meals.filter((item) => item.status === 'planned')) {
    const recipe = byRecipe.get(meal.recipeId); if (!recipe) continue;
    const factor = meal.servings / recipe.servings;
    for (const ingredient of recipe.ingredients) {
      const key = normalize(ingredient.name); if (!key) continue;
      const numeric = Number(ingredient.quantity); const scaled = Number.isFinite(numeric) && ingredient.quantity.trim() ? String(Math.round(numeric * factor * 100) / 100) : ingredient.quantity.trim();
      const existing = grouped.get(key);
      if (!existing) grouped.set(key, { key, name: ingredient.name.trim(), quantity: scaled, aisle: aisleFor(key), note: '', sourceRecipeIds: [recipe.id], checked: false, uncertain: !Number.isFinite(numeric) });
      else { const existingNumber = Number(existing.quantity); if (Number.isFinite(existingNumber) && Number.isFinite(numeric)) existing.quantity = String(Math.round((existingNumber + numeric * factor) * 100) / 100); else { existing.quantity = [...new Set([existing.quantity, scaled].filter(Boolean))].join(' + '); existing.uncertain = true; } if (!existing.sourceRecipeIds.includes(recipe.id)) existing.sourceRecipeIds.push(recipe.id); }
    }
  }
  return [...grouped.values()].sort((a, b) => a.name.localeCompare(b.name));
}

export function groceryNeedsPantryReview(item: GroceryItem, pantry?: PantryItem) { return Boolean(pantry && pantry.confidence !== 'confirmed'); }
