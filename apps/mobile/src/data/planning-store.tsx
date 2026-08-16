import AsyncStorage from '@react-native-async-storage/async-storage';
import type { DailyNutritionTargets, MealSlot, PlannedMeal } from '@cravekeep/domain';
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type PropsWithChildren } from 'react';
import { useAuthStore } from './auth-store';
import { deleteCloudMeal, fetchCloudPlan, saveCloudMeal, saveCloudTargets, setCloudMealServings, setCloudMealStatus } from './cloud-planning';

const STORAGE_KEY = 'cravekeep.planning.v1';
type StoredPlan = { targets: DailyNutritionTargets | null; meals: PlannedMeal[] };
type PlanningStoreValue = StoredPlan & { ready: boolean; error: string | null; updateTargets: (targets: DailyNutritionTargets) => Promise<void>; addMeal: (date: string, slot: MealSlot, recipeId: string, servings: number) => Promise<void>; toggleMealStatus: (id: string) => Promise<void>; updateMealServings: (id: string, servings: number) => Promise<void>; removeMeal: (id: string) => Promise<void> };
const PlanningStore = createContext<PlanningStoreValue | null>(null);

export function PlanningStoreProvider({ children }: PropsWithChildren) {
  const { user } = useAuthStore();
  const [plan, setPlan] = useState<StoredPlan>({ targets: null, meals: [] });
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const planRef = useRef(plan);
  const writeQueue = useRef<Promise<void>>(Promise.resolve());

  const persist = useCallback(async (next: StoredPlan) => {
    planRef.current = next;
    setPlan(next);
    writeQueue.current = writeQueue.current
      .catch(() => undefined)
      .then(() => AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next)))
      .then(() => setError(null))
      .catch(() => setError('Your planning change is visible but could not be saved on this device.'));
    await writeQueue.current;
  }, []);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((value) => {
        if (!value) return;
        const parsed: unknown = JSON.parse(value);
        if (!parsed || typeof parsed !== 'object' || !Array.isArray((parsed as StoredPlan).meals)) throw new Error('Invalid saved plan');
        const next = parsed as StoredPlan;
        planRef.current = next;
        setPlan(next);
      })
      .catch(() => setError('Your meal plan could not be loaded from this device.'))
      .finally(() => setReady(true));
  }, []);

  useEffect(() => {
    if (!ready || !user) return;
    void fetchCloudPlan(user.id).then((cloud) => {
      const local = planRef.current;
      const next = { targets: cloud.targets ?? local.targets, meals: [...cloud.meals, ...local.meals.filter((meal) => !cloud.meals.some((remote) => remote.id === meal.id))] };
      planRef.current = next;
      setPlan(next);
      void AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next)).catch(() => setError('Planning refreshed, but the local cache could not be updated.'));
    }).catch(() => setError('Cloud planning data could not be refreshed.'));
  }, [ready, user]);

  const value = useMemo<PlanningStoreValue>(() => ({
    ...plan,
    ready,
    error,
    updateTargets: async (targets) => {
      const next = { ...planRef.current, targets };
      await persist(next);
      if (user) {
        try { await saveCloudTargets(user.id, targets); }
        catch { setError('Targets are saved on this device but cloud sync could not finish.'); }
      }
    },
    addMeal: async (date, slot, recipeId, servings) => {
      const current = planRef.current;
      let meal: PlannedMeal = { id: `meal_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`, date, slot, recipeId, servings, status: 'planned', createdAt: new Date().toISOString() };
      if (user && /^[0-9a-f-]{36}$/i.test(recipeId)) {
        try { meal = await saveCloudMeal(user.id, meal); }
        catch { setError('Meal is saved on this device but cloud sync could not finish.'); }
      }
      await persist({ ...current, meals: [meal, ...current.meals] });
    },
    toggleMealStatus: async (id) => {
      const current = planRef.current;
      const meal = current.meals.find((item) => item.id === id);
      if (!meal) return;
      const status = meal.status === 'planned' ? 'eaten' : 'planned';
      await persist({ ...current, meals: current.meals.map((item) => item.id === id ? { ...item, status } : item) });
      if (user && /^[0-9a-f-]{36}$/i.test(id)) {
        try { await setCloudMealStatus(id, status); }
        catch { setError('Meal status changed locally but cloud sync could not finish.'); }
      }
    },
    updateMealServings: async (id, servings) => {
      if (!Number.isFinite(servings) || servings < 0.25 || servings > 20) return;
      const current = planRef.current;
      await persist({ ...current, meals: current.meals.map((item) => item.id === id ? { ...item, servings } : item) });
      if (user && /^[0-9a-f-]{36}$/i.test(id)) {
        try { await setCloudMealServings(id, servings); }
        catch { setError('Portion changed locally but cloud sync could not finish.'); }
      }
    },
    removeMeal: async (id) => {
      const current = planRef.current;
      await persist({ ...current, meals: current.meals.filter((item) => item.id !== id) });
      if (user && /^[0-9a-f-]{36}$/i.test(id)) {
        try { await deleteCloudMeal(id); }
        catch { setError('Meal was removed locally but cloud sync could not finish.'); }
      }
    }
  }), [error, persist, plan, ready, user]);

  return <PlanningStore.Provider value={value}>{children}</PlanningStore.Provider>;
}

export function usePlanningStore() {
  const value = useContext(PlanningStore);
  if (!value) throw new Error('usePlanningStore must be used inside PlanningStoreProvider');
  return value;
}
