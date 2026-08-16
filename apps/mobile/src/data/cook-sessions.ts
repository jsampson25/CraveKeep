import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from './supabase';

const STORAGE_KEY = 'cravekeep.cook-sessions.v1';
export type CookSession = { id: string; recipeId: string; taste: number; effort: 'easy' | 'expected' | 'hard'; repeatIntent: boolean; notes: string; cookedAt: string };
const readLocalSessions = async (): Promise<CookSession[]> => { try { const stored = await AsyncStorage.getItem(STORAGE_KEY); const parsed = stored ? JSON.parse(stored) : []; return Array.isArray(parsed) ? parsed as CookSession[] : []; } catch { return []; } };
let localWriteQueue: Promise<void> = Promise.resolve();
const appendLocalSession = (session: CookSession) => {
  const write = localWriteQueue.catch(() => undefined).then(async () => {
    const sessions = await readLocalSessions();
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify([session, ...sessions]));
  });
  localWriteQueue = write.catch(() => undefined);
  return write;
};

export async function fetchCookSessions(recipeId: string, ownerId?: string): Promise<CookSession[]> {
  await localWriteQueue.catch(() => undefined);
  const local = (await readLocalSessions()).filter((session) => session.recipeId === recipeId);
  if (!ownerId || !supabase || !/^[0-9a-f-]{36}$/i.test(recipeId)) return local.sort((a, b) => b.cookedAt.localeCompare(a.cookedAt));
  const { data, error } = await supabase.from('cook_sessions').select('id, recipe_id, taste, effort, repeat_intent, notes, cooked_at').eq('owner_id', ownerId).eq('recipe_id', recipeId).order('cooked_at', { ascending: false });
  if (error) throw error;
  const cloud = data.map((row) => ({ id: row.id, recipeId: row.recipe_id, taste: row.taste, effort: row.effort, repeatIntent: row.repeat_intent, notes: row.notes, cookedAt: row.cooked_at }));
  const signatures = new Set(cloud.map((session) => `${session.cookedAt}|${session.taste}|${session.effort}|${session.repeatIntent}|${session.notes}`));
  return [...cloud, ...local.filter((session) => !signatures.has(`${session.cookedAt}|${session.taste}|${session.effort}|${session.repeatIntent}|${session.notes}`))].sort((a, b) => b.cookedAt.localeCompare(a.cookedAt));
}

export async function saveCookSession(session: CookSession, ownerId?: string): Promise<void> {
  await appendLocalSession(session);
  if (!ownerId || !supabase || !/^[0-9a-f-]{36}$/i.test(session.recipeId)) return;
  const { error } = await supabase.from('cook_sessions').insert({ owner_id: ownerId, recipe_id: session.recipeId, taste: session.taste, effort: session.effort, repeat_intent: session.repeatIntent, notes: session.notes, cooked_at: session.cookedAt });
  if (error) throw error;
}
