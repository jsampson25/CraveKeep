import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from './supabase';

const STORAGE_KEY = 'cravekeep.cook-sessions.v1';
export type CookSession = { id: string; recipeId: string; taste: number; effort: 'easy' | 'expected' | 'hard'; repeatIntent: boolean; notes: string; cookedAt: string };

export async function saveCookSession(session: CookSession, ownerId?: string): Promise<void> {
  const stored = await AsyncStorage.getItem(STORAGE_KEY);
  const sessions = stored ? JSON.parse(stored) as CookSession[] : [];
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify([session, ...sessions]));
  if (!ownerId || !supabase || !/^[0-9a-f-]{36}$/i.test(session.recipeId)) return;
  const { error } = await supabase.from('cook_sessions').insert({ owner_id: ownerId, recipe_id: session.recipeId, taste: session.taste, effort: session.effort, repeat_intent: session.repeatIntent, notes: session.notes, cooked_at: session.cookedAt });
  if (error) throw error;
}
