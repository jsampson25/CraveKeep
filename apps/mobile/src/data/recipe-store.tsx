import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Recipe } from '@cravekeep/domain';
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type PropsWithChildren } from 'react';
import { useAuthStore } from './auth-store';
import { fetchCloudRecipes, saveCloudRecipe, setCloudFavorite, updateCloudRecipe } from './cloud-recipes';

const STORAGE_KEY = 'cravekeep.recipes.v1';

type RecipeStoreValue = {
  recipes: Recipe[];
  ready: boolean;
  error: string | null;
  addRecipe: (recipe: Recipe) => Promise<Recipe>;
  updateRecipe: (recipe: Recipe) => Promise<void>;
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
  const recipesRef = useRef(recipes);
  const writeQueue = useRef<Promise<void>>(Promise.resolve());

  const persist = useCallback(async (next: Recipe[]) => {
    recipesRef.current = next;
    setRecipes(next);
    writeQueue.current = writeQueue.current
      .catch(() => undefined)
      .then(() => AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next)))
      .then(() => setError(null))
      .catch(() => setError('Your recipe change is visible but could not be saved on this device.'));
    await writeQueue.current;
  }, []);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((stored) => {
        const next = stored ? JSON.parse(stored) as Recipe[] : [];
        if (!Array.isArray(next)) throw new Error('Invalid saved recipes');
        recipesRef.current = next;
        setRecipes(next);
      })
      .catch(() => { recipesRef.current = []; setRecipes([]); setError('Your local recipes could not be loaded.'); })
      .finally(() => setReady(true));
  }, []);

  useEffect(() => {
    if (!ready || !user) return;
    void fetchCloudRecipes().then((cloudRecipes) => {
      const localRecipes = recipesRef.current;
      const cloudIds = new Set(cloudRecipes.map((recipe) => recipe.id));
      const next = [...cloudRecipes, ...localRecipes.filter((recipe) => !cloudIds.has(recipe.id))];
      recipesRef.current = next;
      setRecipes(next);
      void AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next)).catch(() => setError('Recipes refreshed, but the local cache could not be updated.'));
      setError(null);
    }).catch(() => setError('Cloud recipes could not be refreshed. Your recipes on this device are still available.'));
  }, [ready, user]);

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
      const current = recipesRef.current;
      await persist([saved, ...current.filter((item) => item.id !== recipe.id && item.id !== saved.id)]);
      return saved;
    },
    updateRecipe: async (recipe) => {
      await persist(recipesRef.current.map((item) => item.id === recipe.id ? recipe : item));
      if (user && /^[0-9a-f-]{36}$/i.test(recipe.id)) {
        try { await updateCloudRecipe(recipe); }
        catch { setError('Recipe edits are saved on this device but cloud sync could not finish.'); }
      }
    },
    toggleFavorite: async (id) => {
      const recipe = recipesRef.current.find((item) => item.id === id);
      if (!recipe) return;
      const favorite = !recipe.favorite;
      await persist(recipesRef.current.map((item) => item.id === id ? { ...item, favorite, updatedAt: new Date().toISOString() } : item));
      if (user && /^[0-9a-f-]{36}$/i.test(id)) {
        try { await setCloudFavorite(id, favorite); }
        catch { setError('Favorite updated on this device but has not reached the cloud yet.'); }
      }
    },
    toggleCookbook: async (id, cookbookId) => {
      const recipe = recipesRef.current.find((item) => item.id === id);
      if (!recipe) return;
      const cookbookIds = recipe.cookbookIds.includes(cookbookId) ? recipe.cookbookIds.filter((item) => item !== cookbookId) : [...recipe.cookbookIds, cookbookId];
      await persist(recipesRef.current.map((item) => item.id === id ? { ...item, cookbookIds, updatedAt: new Date().toISOString() } : item));
    },
    findRecipe: (id) => recipes.find((item) => item.id === id)
  }), [error, persist, ready, recipes, user]);

  return <RecipeStore.Provider value={value}>{children}</RecipeStore.Provider>;
}

export function useRecipeStore() {
  const value = useContext(RecipeStore);
  if (!value) throw new Error('useRecipeStore must be used inside RecipeStoreProvider');
  return value;
}
