import AsyncStorage from '@react-native-async-storage/async-storage';
import type { DailyNutritionTargets, MealSlot, PlannedMeal } from '@cravekeep/domain';
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type PropsWithChildren } from 'react';
import { useAuthStore } from './auth-store';
import { deleteCloudMeal, fetchCloudPlan, saveCloudMeal, saveCloudTargets, setCloudMealServings, setCloudMealStatus } from './cloud-planning';

const STORAGE_KEY = 'cravekeep.planning.v1';
type StoredPlan = { targets: DailyNutritionTargets | null; meals: PlannedMeal[] };
type PlanningStoreValue = StoredPlan & { ready: boolean; error: string | null; updateTargets: (targets: DailyNutritionTargets) => Promise<void>; addMeal: (date: string, slot: MealSlot, recipeId: string, servings: number) => Promise<void>; toggleMealStatus: (id: string) => Promise<void>; updateMealServings: (id: string, servings: number) => Promise<void>; removeMeal: (id: string) => Promise<void> };
const PlanningStore = createContext<PlanningStoreValue | null>(null);

export function PlanningStoreProvider({ children }: PropsWithChildren) {
  const { user } = useAuthStore(); const [plan, setPlan] = useState<StoredPlan>({ targets: null, meals: [] }); const [ready, setReady] = useState(false); const [error, setError] = useState<string | null>(null);
  useEffect(() => { AsyncStorage.getItem(STORAGE_KEY).then((value) => { if (value) setPlan(JSON.parse(value) as StoredPlan); }).catch(() => setError('Your meal plan could not be loaded from this device.')).finally(() => setReady(true)); }, []);
  useEffect(() => { if (!ready || !user) return; void fetchCloudPlan(user.id).then((cloud) => { setPlan((local) => { const next = { targets: cloud.targets ?? local.targets, meals: [...cloud.meals, ...local.meals.filter((meal) => !cloud.meals.some((remote) => remote.id === meal.id))] }; void AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next)); return next; }); }).catch(() => setError('Cloud planning data could not be refreshed.')); }, [ready, user]);
  const persist = useCallback(async (next: StoredPlan) => { setPlan(next); await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next)); }, []);
  const value = useMemo<PlanningStoreValue>(() => ({ ...plan, ready, error,
    updateTargets: async (targets) => { await persist({ ...plan, targets }); if (user) try { await saveCloudTargets(user.id, targets); } catch { setError('Targets are saved on this device but cloud sync could not finish.'); } },
    addMeal: async (date, slot, recipeId, servings) => { let meal: PlannedMeal = { id: `meal_${Date.now()}`, date, slot, recipeId, servings, status: 'planned', createdAt: new Date().toISOString() }; if (user && /^[0-9a-f-]{36}$/i.test(recipeId)) try { meal = await saveCloudMeal(user.id, meal); } catch { setError('Meal is saved on this device but cloud sync could not finish.'); } await persist({ ...plan, meals: [meal, ...plan.meals] }); },
    toggleMealStatus: async (id) => { const meal = plan.meals.find((item) => item.id === id); if (!meal) return; const status = meal.status === 'planned' ? 'eaten' : 'planned'; await persist({ ...plan, meals: plan.meals.map((item) => item.id === id ? { ...item, status } : item) }); if (user && /^[0-9a-f-]{36}$/i.test(id)) try { await setCloudMealStatus(id, status); } catch { setError('Meal status changed locally but cloud sync could not finish.'); } },
    updateMealServings: async (id, servings) => { if (!Number.isFinite(servings) || servings < 0.25 || servings > 20) return; await persist({ ...plan, meals: plan.meals.map((item) => item.id === id ? { ...item, servings } : item) }); if (user && /^[0-9a-f-]{36}$/i.test(id)) try { await setCloudMealServings(id, servings); } catch { setError('Portion changed locally but cloud sync could not finish.'); } },
    removeMeal: async (id) => { await persist({ ...plan, meals: plan.meals.filter((item) => item.id !== id) }); if (user && /^[0-9a-f-]{36}$/i.test(id)) try { await deleteCloudMeal(id); } catch { setError('Meal was removed locally but cloud sync could not finish.'); } }
  }), [error, persist, plan, ready, user]);
  return <PlanningStore.Provider value={value}>{children}</PlanningStore.Provider>;
}
export function usePlanningStore() { const value = useContext(PlanningStore); if (!value) throw new Error('usePlanningStore must be used inside PlanningStoreProvider'); return value; }
