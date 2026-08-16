import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type PropsWithChildren } from 'react';
import { useAuthStore } from './auth-store';
import { supabase } from './supabase';

export type OnboardingProfile = {
  completed: boolean; displayName: string; handle: string;
  loves: string[]; avoids: string[]; neverSuggest: string[]; allergies: string[];
  dietaryPreference: string; cookingTime: string; skill: string; appliances: string;
  goal: string; calculationMode: 'manual' | 'calculated'; calories: number;
  protein: string; carbs: string; fat: string; fiber: string;
  age?: number; sexForCalculation?: 'female' | 'male'; heightCm?: number;
  currentWeightKg?: number; targetWeightKg?: number; activityLevel?: string;
  weeklyAverage: boolean; flexibleDay: boolean; householdName: string;
  householdMembers: { id: string; name: string; type: 'adult' | 'child'; allergies: string[]; preferences: string[] }[];
};

const initial: OnboardingProfile = {
  completed: false, displayName: '', handle: '', loves: [], avoids: [], neverSuggest: [],
  allergies: [], dietaryPreference: '', cookingTime: '', skill: '',
  appliances: '', goal: '', calculationMode: 'manual', calories: 2000,
  protein: '100 g', carbs: '225 g', fat: '67 g', fiber: '25 g', weeklyAverage: true,
  flexibleDay: true, householdName: 'My Kitchen', householdMembers: []
};
const KEY = 'cravekeep.onboarding.profile.v3';
type Value = { profile: OnboardingProfile; ready: boolean; saving: boolean; error?: string; update: (patch: Partial<OnboardingProfile>) => Promise<void>; usernameAvailable: (handle: string) => Promise<boolean>; saveProfile: () => Promise<string | undefined>; saveFoodProfile: () => Promise<string | undefined>; saveNutritionGoals: () => Promise<string | undefined>; saveHousehold: () => Promise<string | undefined>; finish: () => Promise<string | undefined> };
const Context = createContext<Value | null>(null);
const grams = (value: string) => Number.parseInt(value, 10) || 0;

export function OnboardingStoreProvider({ children }: PropsWithChildren) {
  const { user, ready: authReady } = useAuthStore();
  const [profile, setProfile] = useState(initial); const [ready, setReady] = useState(false);
  const [saving, setSaving] = useState(false); const [error, setError] = useState<string>();
  const profileRef = useRef(profile);
  const writeQueue = useRef<Promise<void>>(Promise.resolve());

  useEffect(() => {
    if (!authReady) return;
    let active = true;
    const load = async () => {
      const local = await AsyncStorage.getItem(KEY);
      let next = local ? { ...initial, ...JSON.parse(local) as OnboardingProfile } : initial;
      if (user && supabase) {
        const [identity, food, nutrition, household] = await Promise.all([
          supabase.from('profiles').select('*').eq('id', user.id).maybeSingle(),
          supabase.from('food_profiles').select('*').eq('owner_id', user.id).maybeSingle(),
          supabase.from('nutrition_goals').select('*').eq('owner_id', user.id).maybeSingle(),
          supabase.from('households').select('*').eq('owner_id', user.id).limit(1).maybeSingle()
        ]);
        if (identity.data) next = { ...next, displayName: identity.data.display_name ?? next.displayName, handle: identity.data.username ?? next.handle, completed: identity.data.onboarding_completed };
        if (food.data) next = { ...next, loves: food.data.loved_foods, avoids: food.data.avoided_foods, neverSuggest: food.data.never_suggest_foods, allergies: food.data.allergies, dietaryPreference: food.data.dietary_preferences[0] ?? 'None', cookingTime: food.data.cooking_time, skill: food.data.cooking_skill, appliances: food.data.appliances.join(', ') };
        if (nutrition.data) next = { ...next, goal: nutrition.data.goal, calculationMode: nutrition.data.calculation_mode as OnboardingProfile['calculationMode'], calories: nutrition.data.calories, protein: `${nutrition.data.protein_grams} g`, carbs: `${nutrition.data.carbohydrate_grams} g`, fat: `${nutrition.data.fat_grams} g`, fiber: `${nutrition.data.fiber_grams} g`, age: nutrition.data.age ?? undefined, sexForCalculation: nutrition.data.sex_for_calculation as OnboardingProfile['sexForCalculation'], heightCm: nutrition.data.height_cm ?? undefined, currentWeightKg: nutrition.data.current_weight_kg ?? undefined, targetWeightKg: nutrition.data.target_weight_kg ?? undefined, activityLevel: nutrition.data.activity_level ?? undefined, weeklyAverage: nutrition.data.weekly_average, flexibleDay: nutrition.data.flexible_day };
        if (household.data) {
          const dependents = await supabase.from('household_dependents').select('*').eq('household_id', household.data.id).order('created_at');
          next = { ...next, householdName: household.data.name, householdMembers: (dependents.data ?? []).map(member => ({ id: member.id, name: member.display_name, type: member.member_type as 'adult' | 'child', allergies: member.allergies, preferences: member.preferences })) };
        }
      }
      if (active) { profileRef.current = next; setProfile(next); setReady(true); }
    };
    void load().catch((reason: unknown) => { if (active) { setError(reason instanceof Error ? reason.message : 'Could not load onboarding.'); setReady(true); } });
    return () => { active = false; };
  }, [authReady, user]);

  const update = useCallback(async (patch: Partial<OnboardingProfile>) => {
    const next = { ...profileRef.current, ...patch };
    profileRef.current = next;
    setProfile(next);
    writeQueue.current = writeQueue.current.catch(() => undefined).then(() => AsyncStorage.setItem(KEY, JSON.stringify(next))).catch(() => setError('Your setup is visible, but the latest change could not be saved on this device.'));
    await writeQueue.current;
  }, []);
  const cloud = useCallback(async (work: () => Promise<{ error: { message: string } | null }>) => {
    if (!user || !supabase) return 'Sign in before saving your setup.';
    setSaving(true); setError(undefined);
    try {
      const result = await work(); const message = result.error?.message;
      if (message) setError(message); return message;
    } catch (reason) {
      const message = reason instanceof Error ? reason.message : 'Could not save your setup. Please try again.';
      setError(message); return message;
    } finally { setSaving(false); }
  }, [user]);
  const usernameAvailable = useCallback(async (handle: string) => { if (!supabase || !user) return false; const result = await supabase.rpc('is_username_available', { candidate: handle }); return !result.error && result.data; }, [user]);
  const saveProfile = useCallback(() => cloud(async () => supabase!.from('profiles').upsert({ id: user!.id, display_name: profile.displayName.trim(), username: profile.handle.trim().toLowerCase().replace(/^@/, ''), updated_at: new Date().toISOString() })), [cloud, profile.displayName, profile.handle, user]);
  const saveFoodProfile = useCallback(() => cloud(async () => supabase!.from('food_profiles').upsert({ owner_id: user!.id, loved_foods: profile.loves, avoided_foods: profile.avoids, never_suggest_foods: profile.neverSuggest, allergies: profile.allergies, dietary_preferences: profile.dietaryPreference === 'None' ? [] : [profile.dietaryPreference], cooking_time: profile.cookingTime, cooking_skill: profile.skill, appliances: profile.appliances.split(',').map(x => x.trim()).filter(Boolean), updated_at: new Date().toISOString() })), [cloud, profile, user]);
  const saveNutritionGoals = useCallback(() => cloud(async () => supabase!.from('nutrition_goals').upsert({ owner_id: user!.id, goal: profile.goal, calculation_mode: profile.calculationMode, calories: profile.calories, protein_grams: grams(profile.protein), carbohydrate_grams: grams(profile.carbs), fat_grams: grams(profile.fat), fiber_grams: grams(profile.fiber), age: profile.age, sex_for_calculation: profile.sexForCalculation, height_cm: profile.heightCm, current_weight_kg: profile.currentWeightKg, target_weight_kg: profile.targetWeightKg, activity_level: profile.activityLevel, weekly_average: profile.weeklyAverage, flexible_day: profile.flexibleDay, updated_at: new Date().toISOString() })), [cloud, profile, user]);
  const saveHousehold = useCallback(async () => {
    if (!user || !supabase) return 'Sign in before saving your setup.';
    const existing = await supabase.from('households').select('id').eq('owner_id', user.id).limit(1).maybeSingle();
    let householdId = existing.data?.id;
    if (householdId) {
      const renameError = await cloud(async () => supabase!.from('households').update({ name: profile.householdName.trim(), updated_at: new Date().toISOString() }).eq('id', householdId!));
      if (renameError) return renameError;
    } else {
      const created = await supabase.rpc('create_my_household', { household_name: profile.householdName.trim() });
      if (created.error) return created.error.message; householdId = created.data;
    }
    const removed = await supabase.from('household_dependents').delete().eq('household_id', householdId!);
    if (removed.error) return removed.error.message;
    if (profile.householdMembers.length) {
      const inserted = await supabase.from('household_dependents').insert(profile.householdMembers.map(member => ({ household_id: householdId!, display_name: member.name, member_type: member.type, allergies: member.allergies, preferences: member.preferences })));
      if (inserted.error) return inserted.error.message;
    }
    return undefined;
  }, [cloud, profile.householdMembers, profile.householdName, user]);
  const finish = useCallback(async () => { const message = await cloud(async () => supabase!.from('profiles').update({ onboarding_completed: true, updated_at: new Date().toISOString() }).eq('id', user!.id)); if (!message) await update({ completed: true }); return message; }, [cloud, update, user]);
  const value = useMemo(() => ({ profile, ready, saving, error, update, usernameAvailable, saveProfile, saveFoodProfile, saveNutritionGoals, saveHousehold, finish }), [error, finish, profile, ready, saveFoodProfile, saveHousehold, saveNutritionGoals, saveProfile, saving, update, usernameAvailable]);
  return <Context.Provider value={value}>{children}</Context.Provider>;
}
export function useOnboardingStore() { const value = useContext(Context); if (!value) throw new Error('useOnboardingStore must be used inside OnboardingStoreProvider'); return value; }
