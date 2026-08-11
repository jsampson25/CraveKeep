import AsyncStorage from '@react-native-async-storage/async-storage';
import { SAMPLE_RECIPE, type Recipe } from '@cravekeep/domain';
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type PropsWithChildren } from 'react';
import { useAuthStore } from './auth-store';
import { fetchCloudRecipes, saveCloudRecipe, setCloudFavorite } from './cloud-recipes';

const STORAGE_KEY = 'cravekeep.recipes.v1';

type RecipeStoreValue = {
  recipes: Recipe[];
  ready: boolean;
  error: string | null;
  addRecipe: (recipe: Recipe) => Promise<Recipe>;
  toggleFavorite: (id: string) => Promise<void>;
  toggleCookbook: (id: string, cookbookId: string) => Promise<void>;
  findRecipe: (id: string) => Recipe | undefined;
};

const RecipeStore = createContext<RecipeStoreValue | null>(null);

export function RecipeStoreProvider({ children }: PropsWithChildren) {
  const { user } = useAuthStore();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((stored) => setRecipes(stored ? (JSON.parse(stored) as Recipe[]) : [SAMPLE_RECIPE]))
      .catch(() => { setRecipes([SAMPLE_RECIPE]); setError('Your local recipes could not be loaded. A sample is available while you retry.'); })
      .finally(() => setReady(true));
  }, []);

  useEffect(() => {
    if (!ready || !user) return;
    void fetchCloudRecipes().then((cloudRecipes) => {
      setRecipes((localRecipes) => {
        const cloudIds = new Set(cloudRecipes.map((recipe) => recipe.id));
        const next = [...cloudRecipes, ...localRecipes.filter((recipe) => !cloudIds.has(recipe.id))];
        void AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        return next;
      });
      setError(null);
    }).catch(() => setError('Cloud recipes could not be refreshed. Your recipes on this device are still available.'));
  }, [ready, user]);

  const persist = useCallback(async (next: Recipe[]) => {
    setRecipes(next);
    try { await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next)); setError(null); }
    catch { setError('Your change is visible but could not be saved on this device.'); }
  }, []);

  const value = useMemo<RecipeStoreValue>(() => ({
    recipes,
    ready,
    error,
    addRecipe: async (recipe) => {
      let saved = recipe;
      if (user) {
        try { saved = await saveCloudRecipe(recipe, user.id); }
        catch { setError('The recipe was saved on this device but cloud sync could not finish.'); }
      }
      await persist([saved, ...recipes.filter((item) => item.id !== recipe.id && item.id !== saved.id)]);
      return saved;
    },
    toggleFavorite: async (id) => {
      const recipe = recipes.find((item) => item.id === id);
      if (!recipe) return;
      const favorite = !recipe.favorite;
      await persist(recipes.map((item) => item.id === id ? { ...item, favorite, updatedAt: new Date().toISOString() } : item));
      if (user && /^[0-9a-f-]{36}$/i.test(id)) {
        try { await setCloudFavorite(id, favorite); }
        catch { setError('Favorite updated on this device but has not reached the cloud yet.'); }
      }
    },
    toggleCookbook: async (id, cookbookId) => persist(recipes.map((recipe) => recipe.id === id ? { ...recipe, cookbookIds: recipe.cookbookIds.includes(cookbookId) ? recipe.cookbookIds.filter((item) => item !== cookbookId) : [...recipe.cookbookIds, cookbookId], updatedAt: new Date().toISOString() } : recipe)),
    findRecipe: (id) => recipes.find((recipe) => recipe.id === id)
  }), [error, persist, ready, recipes, user]);

  return <RecipeStore.Provider value={value}>{children}</RecipeStore.Provider>;
}

export function useRecipeStore() {
  const value = useContext(RecipeStore);
  if (!value) throw new Error('useRecipeStore must be used inside RecipeStoreProvider');
  return value;
}
