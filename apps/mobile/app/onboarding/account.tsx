import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { OnboardingProgress } from '@/components/onboarding-progress';
import { Screen, Title } from '@/components/ui';
import { useAuthStore } from '@/data/auth-store';
import { colors, radii, spacing, typography } from '@/theme';

export default function AccountOptionsScreen() {
  const { configured, signInWithProvider } = useAuthStore();
  const [busy, setBusy] = useState<'apple' | 'google'>();
  const [message, setMessage] = useState<string>();
  const oauth = async (provider: 'apple' | 'google') => {
    setBusy(provider); setMessage(undefined);
    const result = await signInWithProvider(provider);
    setBusy(undefined);
    if (result.error) setMessage(result.error); else if (!result.cancelled) router.replace('/(tabs)/home');
  };
  return <Screen><ScrollView contentContainerStyle={styles.content}>
    <OnboardingProgress label="Account setup" percent={20} />
    <View style={styles.hero}><View style={styles.recipeCard}><Text style={styles.cardKicker}>LEMON HERB CHICKEN</Text><View style={styles.line} /><View style={styles.lineShort} /><Ionicons color={colors.herb} name="leaf" size={32} /></View><View style={styles.book}><Text style={styles.bookTitle}>CraveKeep</Text><Text style={styles.bookTitle}>Cookbook</Text><Ionicons color={colors.paper} name="leaf-outline" size={28} /></View></View>
    <Title>Keep what you’ve created.</Title><View style={styles.value}><Text style={styles.valueText}><Ionicons color={colors.herb} name="checkmark-circle" /> Recipes stay private</Text><Text style={styles.valueText}><Ionicons color={colors.herb} name="checkmark-circle" /> Sync across devices</Text><Text style={styles.valueText}><Ionicons color={colors.herb} name="checkmark-circle" /> Continue where you left off</Text></View>
    <Pressable accessibilityRole="button" disabled={Boolean(busy) || !configured} onPress={() => void oauth('apple')} style={[styles.provider, styles.apple]}>{busy === 'apple' ? <ActivityIndicator color={colors.white} /> : <><Ionicons color={colors.white} name="logo-apple" size={21} /><Text style={styles.appleText}>Continue with Apple</Text></>}</Pressable>
    <Pressable accessibilityRole="button" disabled={Boolean(busy) || !configured} onPress={() => void oauth('google')} style={styles.provider}>{busy === 'google' ? <ActivityIndicator color={colors.coral} /> : <><Text style={styles.google}>G</Text><Text style={styles.providerText}>Continue with Google</Text></>}</Pressable>
    <Pressable accessibilityRole="button" onPress={() => router.push('/onboarding/email?mode=signup')} style={[styles.provider, styles.email]}><Ionicons color={colors.coralDark} name="mail-outline" size={21} /><Text style={styles.emailText}>Continue with email</Text></Pressable>
    <Pressable accessibilityRole="button" onPress={() => router.push('/onboarding/email?mode=signin')}><Text style={styles.signIn}>Already have an account? <Text style={styles.signInLink}>Sign in</Text></Text></Pressable>
    {message ? <Text accessibilityRole="alert" style={styles.message}>{message}</Text> : null}{!configured ? <Text accessibilityRole="alert" style={styles.message}>Cloud authentication is not configured in this build.</Text> : null}
    <Text style={styles.private}><Ionicons name="lock-closed-outline" /> Your recipes and onboarding progress remain safe and private.</Text>
  </ScrollView></Screen>;
}

const styles = StyleSheet.create({ content: { padding: spacing.lg, gap: spacing.md, paddingBottom: 48 }, hero: { height: 184, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.md }, recipeCard: { width: 126, height: 144, padding: spacing.md, gap: spacing.sm, borderRadius: radii.small, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.paperRaised, transform: [{ rotate: '-4deg' }] }, cardKicker: { color: colors.coralDark, ...typography.action, fontSize: 9 }, line: { height: 4, borderRadius: 2, backgroundColor: colors.line }, lineShort: { width: '70%', height: 4, borderRadius: 2, backgroundColor: colors.line }, book: { width: 132, height: 166, padding: spacing.md, borderRadius: 6, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.herb, transform: [{ rotate: '4deg' }] }, bookTitle: { color: colors.paper, ...typography.title, fontSize: 18 }, value: { padding: spacing.md, gap: spacing.sm, borderWidth: 1, borderColor: colors.line, borderRadius: radii.medium, backgroundColor: colors.paperRaised }, valueText: { color: colors.charcoal, ...typography.label }, provider: { minHeight: 54, flexDirection: 'row', gap: spacing.sm, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.line, borderRadius: radii.small, backgroundColor: colors.paperRaised }, apple: { backgroundColor: '#111111', borderColor: '#111111' }, email: { borderColor: colors.coral }, providerText: { color: colors.charcoal, ...typography.action, fontSize: 16 }, appleText: { color: colors.white, ...typography.action, fontSize: 16 }, emailText: { color: colors.coralDark, ...typography.action, fontSize: 16 }, google: { color: '#4285F4', fontSize: 20, fontWeight: '900' }, signIn: { color: colors.muted, textAlign: 'center' }, signInLink: { color: colors.coralDark, ...typography.label }, message: { color: colors.coralDark, padding: spacing.sm, textAlign: 'center' }, private: { color: colors.muted, textAlign: 'center', fontSize: 12, lineHeight: 18 } });
