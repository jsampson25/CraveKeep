import type { Session, User } from '@supabase/supabase-js';
import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type PropsWithChildren } from 'react';
import { Platform } from 'react-native';
import { isSupabaseConfigured, supabase } from './supabase';

type AuthResult = { error?: string; confirmationRequired?: boolean; cancelled?: boolean };

type AuthStoreValue = {
  user: User | null;
  ready: boolean;
  configured: boolean;
  signIn: (email: string, password: string) => Promise<AuthResult>;
  resetPassword: (email: string) => Promise<AuthResult>;
  updatePassword: (password: string) => Promise<AuthResult>;
  resendVerification: (email: string) => Promise<AuthResult>;
  signUp: (email: string, password: string, displayName: string) => Promise<AuthResult>;
  signInWithProvider: (provider: 'apple' | 'google') => Promise<AuthResult>;
  signOut: () => Promise<AuthResult>;
};

const AuthStore = createContext<AuthStoreValue | null>(null);
const oauthExchanges = new Map<string, Promise<AuthResult>>();

function getOAuthParams(url: string) {
  const params = new URLSearchParams();
  const queryStart = url.indexOf('?');
  const hashStart = url.indexOf('#');
  const queryEnd = hashStart >= 0 ? hashStart : url.length;

  if (queryStart >= 0) {
    new URLSearchParams(url.slice(queryStart + 1, queryEnd)).forEach((value, key) => params.set(key, value));
  }
  if (hashStart >= 0) {
    new URLSearchParams(url.slice(hashStart + 1)).forEach((value, key) => params.set(key, value));
  }
  return params;
}

export function completeOAuthCode(code: string): Promise<AuthResult> {
  const existing = oauthExchanges.get(code);
  if (existing) return existing;
  const exchange = (async () => {
    if (!supabase) return { error: 'Cloud sync is not configured on this build.' };
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    return error ? { error: error.message } : {};
  })();
  oauthExchanges.set(code, exchange);
  void exchange.then(
    () => { if (oauthExchanges.get(code) === exchange) oauthExchanges.delete(code); },
    () => { if (oauthExchanges.get(code) === exchange) oauthExchanges.delete(code); }
  );
  return exchange;
}

export async function completeOAuthRedirect(url: string): Promise<AuthResult> {
  if (!supabase) return { error: 'Cloud sync is not configured on this build.' };

  const params = getOAuthParams(url);
  const providerError = params.get('error_description') ?? params.get('error');
  if (providerError) return { error: providerError.replace(/\+/g, ' ') };

  const code = params.get('code');
  if (code) return completeOAuthCode(code);

  const accessToken = params.get('access_token');
  const refreshToken = params.get('refresh_token');
  if (accessToken && refreshToken) {
    const { error } = await supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken });
    return error ? { error: error.message } : {};
  }

  const { data } = await supabase.auth.getSession();
  return data.session ? {} : { error: 'The provider returned without a usable session. Please try again.' };
}

export function AuthStoreProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!supabase) { setReady(true); return; }
    void supabase.auth.getSession().then(({ data }) => setSession(data.session)).catch(() => setSession(null)).finally(() => setReady(true));
    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => setSession(nextSession));
    return () => data.subscription.unsubscribe();
  }, []);

  const signIn = useCallback(async (email: string, password: string): Promise<AuthResult> => {
    if (!supabase) return { error: 'Cloud sync is not configured on this build.' };
    const { data, error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    if (error) return { error: error.message };
    if (data.session) setSession(data.session);
    return {};
  }, []);

  const resetPassword = useCallback(async (email: string): Promise<AuthResult> => {
    if (!supabase) return { error: 'Cloud sync is not configured on this build.' };
    const redirectTo = Platform.OS === 'web' && typeof window !== 'undefined' ? `${window.location.origin}/onboarding/email?mode=reset` : Linking.createURL('onboarding/email?mode=reset');
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), { redirectTo });
    return error ? { error: error.message } : {};
  }, []);

  const resendVerification = useCallback(async (email: string): Promise<AuthResult> => {
    if (!supabase) return { error: 'Cloud sync is not configured on this build.' };
    const { error } = await supabase.auth.resend({ type: 'signup', email: email.trim() });
    return error ? { error: error.message } : {};
  }, []);

  const updatePassword = useCallback(async (password: string): Promise<AuthResult> => {
    if (!supabase) return { error: 'Cloud sync is not configured on this build.' };
    const { error } = await supabase.auth.updateUser({ password });
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
    if (data.session) setSession(data.session);
    return { confirmationRequired: !data.session };
  }, []);

  const signOut = useCallback(async (): Promise<AuthResult> => {
    if (!supabase) return {};
    const { error } = await supabase.auth.signOut();
    if (error) return { error: error.message };
    setSession(null);
    return {};
  }, []);

  const signInWithProvider = useCallback(async (provider: 'apple' | 'google'): Promise<AuthResult> => {
    if (!supabase) return { error: 'Cloud sync is not configured on this build.' };
    const redirectTo = Platform.OS === 'web' && typeof window !== 'undefined'
      ? `${window.location.origin}/`
      : Linking.createURL('onboarding/auth-callback');
    const { data, error } = await supabase.auth.signInWithOAuth({ provider, options: { redirectTo, skipBrowserRedirect: true } });
    if (error || !data.url) return { error: error?.message ?? 'The secure sign-in page could not be opened.' };
    const result = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);
    if (result.type !== 'success') return result.type === 'cancel' ? { cancelled: true } : { error: 'Sign-in did not finish. Please try again.' };
    return completeOAuthRedirect(result.url);
  }, []);

  const value = useMemo<AuthStoreValue>(() => ({
    user: session?.user ?? null,
    ready,
    configured: isSupabaseConfigured,
    signIn,
    resetPassword,
    updatePassword,
    resendVerification,
    signUp,
    signInWithProvider,
    signOut
  }), [ready, resetPassword, resendVerification, session, signIn, signInWithProvider, signOut, signUp, updatePassword]);

  return <AuthStore.Provider value={value}>{children}</AuthStore.Provider>;
}

export function useAuthStore() {
  const value = useContext(AuthStore);
  if (!value) throw new Error('useAuthStore must be used inside AuthStoreProvider');
  return value;
}
