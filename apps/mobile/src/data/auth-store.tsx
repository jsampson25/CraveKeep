import type { Session, User } from '@supabase/supabase-js';
import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type PropsWithChildren } from 'react';
import { isSupabaseConfigured, supabase } from './supabase';

type AuthResult = { error?: string; confirmationRequired?: boolean; cancelled?: boolean };

type AuthStoreValue = {
  user: User | null;
  ready: boolean;
  configured: boolean;
  signIn: (email: string, password: string) => Promise<AuthResult>;
  signUp: (email: string, password: string, displayName: string) => Promise<AuthResult>;
  signInWithProvider: (provider: 'apple' | 'google') => Promise<AuthResult>;
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

  const signInWithProvider = useCallback(async (provider: 'apple' | 'google'): Promise<AuthResult> => {
    if (!supabase) return { error: 'Cloud sync is not configured on this build.' };
    const redirectTo = Linking.createURL('/onboarding/auth-callback');
    const { data, error } = await supabase.auth.signInWithOAuth({ provider, options: { redirectTo, skipBrowserRedirect: true } });
    if (error || !data.url) return { error: error?.message ?? 'The secure sign-in page could not be opened.' };
    const result = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);
    if (result.type !== 'success') return result.type === 'cancel' ? { cancelled: true } : { error: 'Sign-in did not finish. Please try again.' };
    const parsed = Linking.parse(result.url);
    const code = typeof parsed.queryParams?.code === 'string' ? parsed.queryParams.code : undefined;
    if (!code) return { error: 'The sign-in response was incomplete.' };
    const exchanged = await supabase.auth.exchangeCodeForSession(code);
    return exchanged.error ? { error: exchanged.error.message } : {};
  }, []);

  const value = useMemo<AuthStoreValue>(() => ({
    user: session?.user ?? null,
    ready,
    configured: isSupabaseConfigured,
    signIn,
    signUp,
    signInWithProvider,
    signOut
  }), [ready, session, signIn, signInWithProvider, signOut, signUp]);

  return <AuthStore.Provider value={value}>{children}</AuthStore.Provider>;
}

export function useAuthStore() {
  const value = useContext(AuthStore);
  if (!value) throw new Error('useAuthStore must be used inside AuthStoreProvider');
  return value;
}
