import type { Session, User } from '@supabase/supabase-js';
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type PropsWithChildren } from 'react';
import { isSupabaseConfigured, supabase } from './supabase';

type AuthResult = { error?: string; confirmationRequired?: boolean };

type AuthStoreValue = {
  user: User | null;
  ready: boolean;
  configured: boolean;
  signIn: (email: string, password: string) => Promise<AuthResult>;
  signUp: (email: string, password: string, displayName: string) => Promise<AuthResult>;
  signOut: () => Promise<AuthResult>;
};

const AuthStore = createContext<AuthStoreValue | null>(null);

export function AuthStoreProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!supabase) { setReady(true); return; }
    void supabase.auth.getSession().then(({ data }) => setSession(data.session)).finally(() => setReady(true));
    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => setSession(nextSession));
    return () => data.subscription.unsubscribe();
  }, []);

  const signIn = useCallback(async (email: string, password: string): Promise<AuthResult> => {
    if (!supabase) return { error: 'Cloud sync is not configured on this build.' };
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    return error ? { error: error.message } : {};
  }, []);

  const signUp = useCallback(async (email: string, password: string, displayName: string): Promise<AuthResult> => {
    if (!supabase) return { error: 'Cloud sync is not configured on this build.' };
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: { data: { display_name: displayName.trim() } }
    });
    if (error) return { error: error.message };
    return { confirmationRequired: !data.session };
  }, []);

  const signOut = useCallback(async (): Promise<AuthResult> => {
    if (!supabase) return {};
    const { error } = await supabase.auth.signOut();
    return error ? { error: error.message } : {};
  }, []);

  const value = useMemo<AuthStoreValue>(() => ({
    user: session?.user ?? null,
    ready,
    configured: isSupabaseConfigured,
    signIn,
    signUp,
    signOut
  }), [ready, session, signIn, signOut, signUp]);

  return <AuthStore.Provider value={value}>{children}</AuthStore.Provider>;
}

export function useAuthStore() {
  const value = useContext(AuthStore);
  if (!value) throw new Error('useAuthStore must be used inside AuthStoreProvider');
  return value;
}
