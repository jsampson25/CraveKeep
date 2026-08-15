import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Button, Card, Field, Screen, Title } from '@/components/ui';
import { useAuthStore } from '@/data/auth-store';
import { colors, radii, spacing } from '@/theme';

export default function ProfileScreen() {
  const { user, ready, configured, signIn, signUp, signOut } = useAuthStore();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string>();

  const submit = async () => {
    setMessage(undefined);
    if (!email.trim() || password.length < 8 || (mode === 'signup' && !displayName.trim())) {
      setMessage('Enter a name, valid email, and a password with at least 8 characters.');
      return;
    }
    setBusy(true);
    const result = mode === 'signin' ? await signIn(email, password) : await signUp(email, password, displayName);
    setBusy(false);
    setMessage(result.error ?? (result.confirmationRequired ? 'Check your email to confirm your account, then sign in.' : undefined));
  };

  return <Screen><KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.flex}><ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.content}>
    <Pressable accessibilityLabel="Go back" onPress={() => router.back()} style={styles.back}><Ionicons name="arrow-back" size={24} /></Pressable>
    <Text style={styles.kicker}>YOUR CRAVEKEEP</Text><Title>{user ? 'Cloud sync is connected.' : 'Keep your recipes with you.'}</Title>
    {!ready ? <ActivityIndicator color={colors.coral} /> : !configured ? <Card style={styles.notice}><Text style={styles.cardTitle}>Cloud sync needs configuration</Text><Text style={styles.body}>This build is missing its public Supabase URL or publishable key. Recipes remain safely stored on this device.</Text></Card> : user ? <>
      <Card style={styles.account}><View style={styles.avatar}><Text style={styles.avatarText}>{(user.user_metadata.display_name || user.email || 'CK').slice(0, 2).toUpperCase()}</Text></View><View style={styles.flex}><Text style={styles.cardTitle}>{user.user_metadata.display_name || 'CraveKeep cook'}</Text><Text style={styles.body}>{user.email}</Text><Text style={styles.connected}><Ionicons name="checkmark-circle" /> Signed in</Text></View></Card>
      <Text style={styles.body}>Your account is authenticated against the live Supabase project. Private recipe sync is the next connection step.</Text>
      <Button label="Open settings" variant="secondary" onPress={() => router.push('/settings')} />
      <Button label="Sign out" variant="secondary" onPress={() => void signOut()} />
    </> : <>
      <Text style={styles.body}>Sign in to sync private recipes across devices. Your local recipes stay available even while signed out.</Text>
      <View style={styles.switcher}><Pressable onPress={() => { setMode('signin'); setMessage(undefined); }} style={[styles.switch, mode === 'signin' && styles.switchActive]}><Text style={[styles.switchText, mode === 'signin' && styles.switchTextActive]}>Sign in</Text></Pressable><Pressable onPress={() => { setMode('signup'); setMessage(undefined); }} style={[styles.switch, mode === 'signup' && styles.switchActive]}><Text style={[styles.switchText, mode === 'signup' && styles.switchTextActive]}>Create account</Text></Pressable></View>
      {mode === 'signup' ? <Field label="Name" autoComplete="name" value={displayName} onChangeText={setDisplayName} /> : null}
      <Field label="Email" autoCapitalize="none" autoComplete="email" keyboardType="email-address" value={email} onChangeText={setEmail} />
      <Field label="Password" autoCapitalize="none" autoComplete={mode === 'signin' ? 'current-password' : 'new-password'} secureTextEntry value={password} onChangeText={setPassword} />
      {message ? <Text accessibilityRole="alert" style={styles.message}>{message}</Text> : null}
      <Button disabled={busy} label={busy ? 'Connectingâ€¦' : mode === 'signin' ? 'Sign in' : 'Create my account'} onPress={() => void submit()} />
    </>}
    <View style={styles.privacy}><Ionicons color={colors.herb} name="lock-closed-outline" size={20} /><Text style={styles.privacyText}>Recipes are private by default and protected by owner-only database policies.</Text></View>
  </ScrollView></KeyboardAvoidingView></Screen>;
}

const styles = StyleSheet.create({ flex: { flex: 1 }, content: { padding: spacing.lg, gap: spacing.md, paddingBottom: 60 }, back: { width: 44, height: 44, borderRadius: 22, borderWidth: 1, borderColor: colors.line, alignItems: 'center', justifyContent: 'center' }, kicker: { color: colors.coralDark, fontWeight: '900', letterSpacing: 1.2 }, body: { color: colors.muted, lineHeight: 21 }, notice: { gap: spacing.sm }, cardTitle: { color: colors.charcoal, fontSize: 18, fontWeight: '800' }, account: { flexDirection: 'row', alignItems: 'center', gap: spacing.md }, avatar: { width: 54, height: 54, borderRadius: 27, backgroundColor: colors.charcoal, alignItems: 'center', justifyContent: 'center' }, avatarText: { color: colors.white, fontWeight: '900' }, connected: { color: colors.herb, fontWeight: '800' }, switcher: { flexDirection: 'row', padding: 4, borderRadius: radii.medium, backgroundColor: colors.line }, switch: { flex: 1, minHeight: 44, alignItems: 'center', justifyContent: 'center', borderRadius: radii.small }, switchActive: { backgroundColor: colors.paperRaised }, switchText: { color: colors.muted, fontWeight: '700' }, switchTextActive: { color: colors.charcoal }, message: { color: colors.coralDark, backgroundColor: colors.lavenderSoft, padding: spacing.md, borderRadius: radii.small }, privacy: { flexDirection: 'row', gap: spacing.sm, padding: spacing.md, backgroundColor: colors.mintSoft, borderRadius: radii.medium }, privacyText: { flex: 1, color: colors.herb, fontWeight: '700', lineHeight: 20 } });
