import type { Recipe } from '@cravekeep/domain';
import { supabase } from './supabase';

type RecipeRow = {
  id: string;
  title: string;
  description: string;
  servings: number;
  prep_minutes: number;
  cook_minutes: number;
  source_kind: Recipe['source']['kind'];
  source_label: string;
  source_url: string | null;
  source_creator: string | null;
  source_captured_at: string;
  privacy: string;
  favorite: boolean;
  created_at: string;
  updated_at: string;
  version_number: number;
  recipe_ingredients: { id: string; quantity: string; name: string; position: number }[];
  recipe_steps: { instruction: string; position: number }[];
};

const fromRow = (row: RecipeRow): Recipe => ({
  id: row.id,
  title: row.title,
  description: row.description,
  servings: row.servings,
  prepMinutes: row.prep_minutes,
  cookMinutes: row.cook_minutes,
  ingredients: [...row.recipe_ingredients].sort((a, b) => a.position - b.position).map(({ id, quantity, name }) => ({ id, quantity, name })),
  steps: [...row.recipe_steps].sort((a, b) => a.position - b.position).map((step) => step.instruction),
  source: {
    kind: row.source_kind,
    label: row.source_label,
    url: row.source_url ?? undefined,
    creator: row.source_creator ?? undefined,
    capturedAt: row.source_captured_at
  },
  privacy: 'private',
  favorite: row.favorite,
  cookbookIds: [],
  createdAt: row.created_at,
  updatedAt: row.updated_at,
  version: 1
});

export async function fetchCloudRecipes(): Promise<Recipe[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('recipes')
    .select('*, recipe_ingredients(id, quantity, name, position), recipe_steps(instruction, position)')
    .order('updated_at', { ascending: false });
  if (error) throw error;
  return (data as RecipeRow[]).map(fromRow);
}

export async function saveCloudRecipe(recipe: Recipe, ownerId: string): Promise<Recipe> {
  if (!supabase) return recipe;
  const { data: row, error } = await supabase.from('recipes').insert({
    owner_id: ownerId,
    title: recipe.title,
    description: recipe.description,
    servings: recipe.servings,
    prep_minutes: recipe.prepMinutes,
    cook_minutes: recipe.cookMinutes,
    source_kind: recipe.source.kind,
    source_label: recipe.source.label,
    source_url: recipe.source.url,
    source_creator: recipe.source.creator,
    source_captured_at: recipe.source.capturedAt,
    privacy: 'private',
    favorite: recipe.favorite,
    created_at: recipe.createdAt,
    updated_at: recipe.updatedAt,
    version_number: recipe.version
  }).select('id').single();
  if (error) throw error;

  const [ingredients, steps] = await Promise.all([
    supabase.from('recipe_ingredients').insert(recipe.ingredients.map((ingredient, position) => ({ recipe_id: row.id, position, quantity: ingredient.quantity, name: ingredient.name }))),
    supabase.from('recipe_steps').insert(recipe.steps.map((instruction, position) => ({ recipe_id: row.id, position, instruction })))
  ]);
  const childError = ingredients.error ?? steps.error;
  if (childError) {
    await supabase.from('recipes').delete().eq('id', row.id);
    throw childError;
  }
  return { ...recipe, id: row.id };
}

export async function setCloudFavorite(id: string, favorite: boolean): Promise<void> {
  if (!supabase) return;
  const { error } = await supabase.from('recipes').update({ favorite, updated_at: new Date().toISOString() }).eq('id', id);
  if (error) throw error;
}
