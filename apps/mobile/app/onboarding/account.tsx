import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GoogleG } from '@/components/google-g';
import { useAuthStore } from '@/data/auth-store';
import { colors, spacing, typography } from '@/theme';
import logoMark from '../../assets/brand/welcome-logo-mark.png';
import mascot from '../../assets/mascots/recipe-keeper.png';

export default function AccountOptionsScreen() {
  const insets = useSafeAreaInsets();
  const { configured, signInWithProvider } = useAuthStore();
  const [busy, setBusy] = useState<'apple' | 'google'>();
  const [message, setMessage] = useState<string>();

  const oauth = async (provider: 'apple' | 'google') => {
    if (!configured) {
      setMessage('Sign-in is not configured in this build. Reopen the latest build and try again.');
      return;
    }
    setBusy(provider);
    setMessage(undefined);
    try {
      const result = await signInWithProvider(provider);
      if (result.error) setMessage(result.error);
      else if (!result.cancelled && !result.redirecting) router.replace('/');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Sign-in could not start. Please try again.');
    } finally {
      setBusy(undefined);
    }
  };

  return (
    <View style={[styles.screen, { paddingTop: insets.top + 10, paddingBottom: Math.max(insets.bottom, 14) }]}>
      <Pressable accessibilityLabel="Go back" hitSlop={12} onPress={() => router.back()} style={styles.back}>
        <Ionicons color={colors.charcoal} name="chevron-back" size={24} />
      </Pressable>
      <View style={styles.content}>
        <Image accessibilityLabel="CraveKeep" resizeMode="contain" source={logoMark} style={styles.logo} />
        <Text accessibilityRole="header" style={styles.title}>Create your{"\n"}<Text style={styles.accent}>account</Text></Text>
        <View style={styles.actions}>
          <Pressable accessibilityRole="button" disabled={Boolean(busy)} onPress={() => void oauth('apple')} style={[styles.provider, styles.apple]}>
            {busy === 'apple' ? <ActivityIndicator color={colors.white} /> : <><Ionicons color={colors.white} name="logo-apple" size={21} /><Text style={styles.appleText}>Continue with Apple</Text></>}
          </Pressable>
          <Pressable accessibilityRole="button" disabled={Boolean(busy)} onPress={() => void oauth('google')} style={styles.provider}>
            {busy === 'google' ? <ActivityIndicator color={colors.coral} /> : <><GoogleG /><Text style={styles.providerText}>Continue with Google</Text></>}
          </Pressable>
          <View style={styles.divider}><View style={styles.line} /><Text style={styles.or}>or</Text><View style={styles.line} /></View>
          <Pressable accessibilityRole="button" onPress={() => router.push('/onboarding/email?mode=signup')} style={[styles.provider, styles.email]}>
            <Ionicons color={colors.coralDark} name="mail-outline" size={20} />
            <Text style={styles.emailText}>Continue with email</Text>
          </Pressable>
          <Pressable hitSlop={10} onPress={() => router.push('/onboarding/email?mode=signin')}>
            <Text style={styles.signIn}>Already have an account? <Text style={styles.signInLink}>Sign in</Text></Text>
          </Pressable>
          {message ? <Text accessibilityRole="alert" style={styles.message}>{message}</Text> : null}
        </View>
      </View>
      <Image accessibilityLabel="CraveKeep recipe keeper mascot" resizeMode="contain" source={mascot} style={styles.mascot} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, width: '100%', maxWidth: 430, alignSelf: 'center', paddingHorizontal: 24, backgroundColor: '#FFFFFF', overflow: 'hidden' },
  back: { width: 44, height: 44, marginLeft: -6, borderWidth: 1, borderColor: '#E8DED6', borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  content: { flex: 1, paddingTop: 2 },
  logo: { width: 74, height: 62, alignSelf: 'center', marginBottom: 8 },
  title: { color: colors.charcoal, ...typography.display, fontSize: 37, lineHeight: 40, marginBottom: 24 },
  accent: { color: colors.coral },
  actions: { gap: 12 },
  provider: { minHeight: 52, flexDirection: 'row', gap: spacing.sm, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#DDD7D1', borderRadius: 12, backgroundColor: '#FFFFFF' },
  apple: { backgroundColor: '#111111', borderColor: '#111111' },
  appleText: { color: colors.white, ...typography.action, fontSize: 15 },
  providerText: { color: colors.charcoal, ...typography.action, fontSize: 15 },
  email: { borderColor: colors.coral },
  emailText: { color: colors.coralDark, ...typography.action, fontSize: 15 },
  divider: { flexDirection: 'row', alignItems: 'center', gap: 14, marginVertical: 2 },
  line: { flex: 1, height: 1, backgroundColor: '#E3DDD7' },
  or: { color: colors.muted, fontSize: 13 },
  signIn: { color: colors.muted, textAlign: 'center', fontSize: 14, marginTop: 2 },
  signInLink: { color: colors.coralDark, ...typography.label },
  message: { color: colors.coralDark, textAlign: 'center', fontSize: 12 },
  mascot: { position: 'absolute', width: 250, height: 250, bottom: -48, alignSelf: 'center', left: '50%', marginLeft: -125 },
});

