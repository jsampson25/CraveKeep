import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { OnboardingProgress } from '@/components/onboarding-progress';
import { Button, Field, Screen, Title } from '@/components/ui';
import { useAuthStore } from '@/data/auth-store';
import { colors, spacing, typography } from '@/theme';

export default function EmailAccountScreen() {
  const { mode } = useLocalSearchParams<{ mode?: string }>();
  const signingIn = mode === 'signin';
  const resetting = mode === 'reset';
  const { resetPassword, resendVerification, signIn, signUp, updatePassword } = useAuthStore();
  const [verificationSent, setVerificationSent] = useState(false);
  const [name, setName] = useState(''); const [email, setEmail] = useState(''); const [password, setPassword] = useState(''); const [busy, setBusy] = useState(false); const [message, setMessage] = useState<string>(); const [resetSent, setResetSent] = useState(false);
  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const rules = [{ met: password.length >= 8, label: 'At least 8 characters' }, { met: /[a-z]/.test(password), label: 'One lowercase letter' }, { met: /[A-Z]/.test(password), label: 'One uppercase letter' }, { met: /[^A-Za-z]/.test(password), label: 'One number or symbol' }];
  const resend = async () => {
    if (!validEmail) { setMessage('Enter a valid email address first.'); return; }
    setBusy(true); setMessage(undefined);
    try { const result = await resendVerification(email); if (result.error) setMessage(result.error); else setVerificationSent(true); } catch (error) { setMessage(error instanceof Error ? error.message : 'We could not resend the verification email.'); } finally { setBusy(false); }
  };
  const saveNewPassword = async () => {
    if (!rules.every((rule) => rule.met)) { setMessage('Choose a password that meets all requirements.'); return; }
    setBusy(true); setMessage(undefined);
    try { const result = await updatePassword(password); if (result.error) setMessage(result.error); else setResetSent(true); } catch (error) { setMessage(error instanceof Error ? error.message : 'We could not update your password. Please try again.'); } finally { setBusy(false); }
  };
  const sendReset = async () => {
    if (!validEmail) { setMessage('Enter a valid email address so we know where to send the reset link.'); return; }
    setBusy(true); setMessage(undefined);
    try { const result = await resetPassword(email); if (result.error) setMessage(result.error); else setResetSent(true); } catch (error) { setMessage(error instanceof Error ? error.message : 'We could not send the reset email. Please try again.'); } finally { setBusy(false); }
  };
  const submit = async () => {
    if (!validEmail || (signingIn ? !password : !rules.every((rule) => rule.met) || !name.trim())) { setMessage(signingIn ? 'Enter a valid email and password.' : 'Complete the required fields and password rules.'); return; }
    setBusy(true); setMessage(undefined);
    try { const result = signingIn ? await signIn(email, password) : await signUp(email, password, name); if (result.error) setMessage(result.error); else if (result.confirmationRequired) { setMessage('Check your email to verify your account, then return to sign in.'); } else router.replace('/'); } catch (error) { setMessage(error instanceof Error ? error.message : 'We could not complete that request. Please try again.'); } finally { setBusy(false); }
  };
  return <Screen><KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.flex}><ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.content}>
    <OnboardingProgress label={resetting ? 'Set a new password' : signingIn ? 'Welcome back' : 'Create account'} percent={resetting ? 80 : signingIn ? 20 : 35} />
    <Pressable accessibilityLabel="Back to sign-in options" onPress={() => router.back()} style={styles.back}><Ionicons name="arrow-back" size={22} /></Pressable>
    <Title>{resetting ? 'Choose a new password' : signingIn ? 'Sign in to CraveKeep' : 'Create your account'}</Title><Text style={styles.body}>{resetting ? 'Create a new password for your CraveKeep account.' : signingIn ? 'Your private recipes are ready when you are.' : 'We’ll email a verification link to protect your account.'}</Text>
    {!signingIn && !resetting ? <Field autoComplete="name" label="First name" onChangeText={setName} value={name} /> : null}{!resetting ? <Field autoCapitalize="none" autoComplete="email" keyboardType="email-address" label="Email" onChangeText={setEmail} value={email} /> : null}<Field autoCapitalize="none" autoComplete={signingIn ? 'current-password' : 'new-password'} label="Password" onChangeText={setPassword} secureTextEntry value={password} />
    {!signingIn || resetting ? <View style={styles.rules}>{rules.map((rule) => <Text key={rule.label} style={rule.met ? styles.ruleMet : styles.rule}><Ionicons name={rule.met ? 'checkmark-circle' : 'ellipse-outline'} /> {rule.label}</Text>)}</View> : null}
    {resetSent ? <Text accessibilityRole="status" style={styles.success}>{resetting ? 'Your password has been updated. You can now sign in.' : 'Check your email for a secure password-reset link.'}</Text> : null}{verificationSent ? <Text accessibilityRole="status" style={styles.success}>A new verification email has been sent.</Text> : null}{message ? <Text accessibilityRole="alert" style={styles.message}>{message}</Text> : null}{signingIn ? <Pressable disabled={busy} onPress={() => void sendReset()}><Text style={styles.forgot}>Forgot your password?</Text></Pressable> : null}{!signingIn && !resetting ? <Pressable disabled={busy} onPress={() => void resend()}><Text style={styles.forgot}>Resend verification email</Text></Pressable> : null}<Button disabled={busy} label={resetSent && resetting ? 'Continue to sign in' : busy ? 'Connecting…' : resetting ? 'Save new password' : signingIn ? 'Sign in' : 'Create account'} onPress={() => void (resetSent && resetting ? router.replace('/onboarding/email?mode=signin') : resetting ? saveNewPassword() : submit())} /><Button disabled={busy} label="Back to sign-in options" onPress={() => router.back()} variant="secondary" />
  </ScrollView></KeyboardAvoidingView></Screen>;
}

const styles = StyleSheet.create({ flex: { flex: 1 }, content: { padding: spacing.lg, gap: spacing.md, paddingBottom: 48 }, back: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center', alignSelf: 'flex-start' }, body: { color: colors.muted, ...typography.body, lineHeight: 22 }, rules: { gap: spacing.sm }, rule: { color: colors.muted }, ruleMet: { color: colors.herb, ...typography.label }, message: { color: colors.coralDark, lineHeight: 20 }, success: { color: colors.herb, lineHeight: 20, fontWeight: '700' }, forgot: { color: colors.coral, textAlign: 'center', fontWeight: '800' } });
