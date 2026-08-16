import AsyncStorage from '@react-native-async-storage/async-storage';
import type { RecipeNutritionEstimate } from '@cravekeep/domain';
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type PropsWithChildren } from 'react';
import { useAuthStore } from './auth-store';
import { saveCloudNutrition } from './cloud-nutrition';

const STORAGE_KEY = 'cravekeep.nutrition.v1';
type NutritionStoreValue = { estimates: RecipeNutritionEstimate[]; ready: boolean; error: string | null; saveEstimate: (estimate: RecipeNutritionEstimate) => Promise<void>; findEstimate: (recipeId: string) => RecipeNutritionEstimate | undefined };
const NutritionStore = createContext<NutritionStoreValue | null>(null);

export function NutritionStoreProvider({ children }: PropsWithChildren) {
  const { user } = useAuthStore();
  const [estimates, setEstimates] = useState<RecipeNutritionEstimate[]>([]);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const estimateRef = useRef(estimates);
  const writeQueue = useRef<Promise<void>>(Promise.resolve());

  const persist = useCallback(async (next: RecipeNutritionEstimate[]) => {
    estimateRef.current = next;
    setEstimates(next);
    writeQueue.current = writeQueue.current
      .catch(() => undefined)
      .then(() => AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next)))
      .then(() => setError(null))
      .catch(() => setError('Your nutrition estimate is visible but could not be saved on this device.'));
    await writeQueue.current;
  }, []);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((value) => {
        if (!value) return;
        const parsed: unknown = JSON.parse(value);
        if (!Array.isArray(parsed)) throw new Error('Invalid saved nutrition');
        const next = parsed as RecipeNutritionEstimate[];
        estimateRef.current = next;
        setEstimates(next);
      })
      .catch(() => setError('Saved nutrition estimates could not be loaded.'))
      .finally(() => setReady(true));
  }, []);

  const saveEstimate = useCallback(async (estimate: RecipeNutritionEstimate) => {
    const next = [estimate, ...estimateRef.current.filter((item) => item.recipeId !== estimate.recipeId)];
    await persist(next);
    if (user) {
      try { await saveCloudNutrition(estimate, user.id); setError(null); }
      catch { setError('Nutrition was saved on this device but cloud sync could not finish.'); }
    }
  }, [persist, user]);

  const value = useMemo(() => ({ estimates, ready, error, saveEstimate, findEstimate: (recipeId: string) => estimates.find((item) => item.recipeId === recipeId) }), [error, estimates, ready, saveEstimate]);
  return <NutritionStore.Provider value={value}>{children}</NutritionStore.Provider>;
}

export function useNutritionStore() {
  const value = useContext(NutritionStore);
  if (!value) throw new Error('useNutritionStore must be used inside NutritionStoreProvider');
  return value;
}
