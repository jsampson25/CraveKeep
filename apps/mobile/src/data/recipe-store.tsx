import AsyncStorage from '@react-native-async-storage/async-storage';
import { SAMPLE_RECIPE, type Recipe } from '@cravekeep/domain';
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type PropsWithChildren } from 'react';

const STORAGE_KEY = 'cravekeep.recipes.v1';

type RecipeStoreValue = {
  recipes: Recipe[];
  ready: boolean;
  error: string | null;
  addRecipe: (recipe: Recipe) => Promise<void>;
  toggleFavorite: (id: string) => Promise<void>;
  toggleCookbook: (id: string, cookbookId: string) => Promise<void>;
  findRecipe: (id: string) => Recipe | undefined;
};

const RecipeStore = createContext<RecipeStoreValue | null>(null);

export function RecipeStoreProvider({ children }: PropsWithChildren) {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((stored) => setRecipes(stored ? (JSON.parse(stored) as Recipe[]) : [SAMPLE_RECIPE]))
      .catch(() => { setRecipes([SAMPLE_RECIPE]); setError('Your local recipes could not be loaded. A sample is available while you retry.'); })
      .finally(() => setReady(true));
  }, []);

  const persist = useCallback(async (next: Recipe[]) => {
    setRecipes(next);
    try { await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next)); setError(null); }
    catch { setError('Your change is visible but could not be saved on this device.'); }
  }, []);

  const value = useMemo<RecipeStoreValue>(() => ({
    recipes,
    ready,
    error,
    addRecipe: async (recipe) => persist([recipe, ...recipes.filter((item) => item.id !== recipe.id)]),
    toggleFavorite: async (id) => persist(recipes.map((recipe) => recipe.id === id ? { ...recipe, favorite: !recipe.favorite, updatedAt: new Date().toISOString() } : recipe)),
    toggleCookbook: async (id, cookbookId) => persist(recipes.map((recipe) => recipe.id === id ? { ...recipe, cookbookIds: recipe.cookbookIds.includes(cookbookId) ? recipe.cookbookIds.filter((item) => item !== cookbookId) : [...recipe.cookbookIds, cookbookId], updatedAt: new Date().toISOString() } : recipe)),
    findRecipe: (id) => recipes.find((recipe) => recipe.id === id)
  }), [error, persist, ready, recipes]);

  return <RecipeStore.Provider value={value}>{children}</RecipeStore.Provider>;
}

export function useRecipeStore() {
  const value = useContext(RecipeStore);
  if (!value) throw new Error('useRecipeStore must be used inside RecipeStoreProvider');
  return value;
}
