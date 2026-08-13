import { Ionicons } from '@expo/vector-icons';
import * as Linking from 'expo-linking';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { Button } from '@/components/ui';
import { completeOAuthCode, completeOAuthRedirect } from '@/data/auth-store';
import { supabase } from '@/data/supabase';
import { colors, spacing, typography } from '@/theme';

export default function AuthCallbackScreen() {
  const params = useLocalSearchParams<{ code?: string; error?: string; error_code?: string; error_description?: string }>();
  const callbackUrl = Linking.useURL();
  const started = useRef(false);
  const [error, setError] = useState<string>();

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    const finish = async () => {
      if (callbackUrl) {
        const result = await completeOAuthRedirect(callbackUrl);
        if (result.error) { setError(result.error); return; }
      } else if (params.error || params.error_code) {
        setError(params.error_description || params.error || 'Google sign-in was not completed.');
        return;
      }
      if (!supabase) { setError('Cloud authentication is not configured in this build.'); return; }
      if (params.code) {
        const result = await completeOAuthCode(params.code);
        if (result.error) { setError(result.error); return; }
      } else {
        const { data } = await supabase.auth.getSession();
        if (!data.session) { setError('The sign-in response did not include an authorization code.'); return; }
      }
      router.replace('/');
    };
    void finish();
  }, [callbackUrl, params.code, params.error, params.error_code, params.error_description]);

  return <View style={styles.screen}>{error ? <><View style={styles.icon}><Ionicons color={colors.coralDark} name="alert-circle-outline" size={34} /></View><Text style={styles.title}>Sign-in couldn’t finish.</Text><Text style={styles.body}>{error}</Text><Button label="Back to sign-in options" onPress={() => router.replace('/onboarding/account')} /></> : <><ActivityIndicator color={colors.coral} size="large" /><Text style={styles.title}>Finishing secure sign-in…</Text><Text style={styles.body}>CraveKeep is connecting your account.</Text></>}</View>;
}

const styles = StyleSheet.create({ screen: { flex: 1, justifyContent: 'center', gap: spacing.md, padding: spacing.xl, backgroundColor: colors.paper }, icon: { alignSelf: 'center' }, title: { color: colors.charcoal, ...typography.title, fontSize: 28, textAlign: 'center' }, body: { color: colors.muted, lineHeight: 21, textAlign: 'center' } });
