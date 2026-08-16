import AsyncStorage from '@react-native-async-storage/async-storage';
import { Redirect, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import { AccessibilityInfo, ActivityIndicator, Animated, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { MascotFrameSequence } from '@/components/animations/MascotFrameSequence';
import welcomeFrame01 from '../assets/mascots/role-specific-variants/morning-wave-01.png';
import welcomeFrame02 from '../assets/mascots/role-specific-variants/morning-wave-02.png';
import welcomeFrame03 from '../assets/mascots/role-specific-variants/morning-wave-03.png';
import welcomeFrame04 from '../assets/mascots/role-specific-variants/morning-wave-04.png';
import welcomeVideo from '../assets/welcome-mascot-silent.mp4';

type WebVideoProps = { 'aria-label'?: string; autoPlay?: boolean; loop?: boolean; muted?: boolean; playsInline?: boolean; src: number | string; style?: object };
const WebVideo = 'video' as unknown as React.ComponentType<WebVideoProps>;
import { GoogleG } from '@/components/google-g';
import { useAuthStore } from '@/data/auth-store';
import { useOnboardingStore } from '@/data/onboarding-store';
import { colors, radii, spacing, typography } from '@/theme';

const WELCOME_KEY = 'cravekeep.welcome.v11';
const welcomeFrames = [
  welcomeFrame01, welcomeFrame02, welcomeFrame03, welcomeFrame04,
];

export default function Index() {
  const { configured, ready: authReady, signInWithProvider, user } = useAuthStore();
  const { ready: onboardingReady, profile } = useOnboardingStore();
  const [ready, setReady] = useState(false);
  const [seen, setSeen] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [busy, setBusy] = useState<'apple' | 'google'>();
  const [message, setMessage] = useState<string>();
  const reveal = useRef(new Animated.Value(0)).current;
  const copy = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    void Promise.all([AsyncStorage.getItem(WELCOME_KEY), AccessibilityInfo.isReduceMotionEnabled()]).then(([value, reduced]) => {
      setSeen(Boolean(value));
      setReduceMotion(reduced);
      setReady(true);
    });
  }, []);

  useEffect(() => {
    if (!ready || seen) return;
    if (reduceMotion) {
      reveal.setValue(1);
      copy.setValue(1);
      return;
    }
    Animated.parallel([
      Animated.timing(reveal, { toValue: 1, duration: 450, useNativeDriver: true }),
      Animated.timing(copy, { toValue: 1, duration: 600, delay: 250, useNativeDriver: true }),
    ]).start();
  }, [copy, ready, reduceMotion, reveal, seen]);

  if (!ready || !authReady || !onboardingReady) return <View style={styles.loading} />;
  if (user) return <Redirect href={profile.completed ? '/(tabs)/home' : '/onboarding/profile'} />;
  if (seen) return <Redirect href="/onboarding/account" />;

  const begin = async () => {
    try { await AsyncStorage.setItem(WELCOME_KEY, 'seen'); router.replace('/onboarding/account'); }
    catch { setMessage('Could not start onboarding. Please try again.'); }
  };

  const oauth = async (provider: 'apple' | 'google') => {
    if (!configured) { setMessage('Sign-in is not configured in this build.'); return; }
    setBusy(provider); setMessage(undefined);
    try {
      const result = await signInWithProvider(provider);
      if (result.error) setMessage(result.error); else if (!result.cancelled) router.replace('/');
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Sign-in could not start.'); }
    finally { setBusy(undefined); }
  };

  return (
    <View style={styles.screen}>
      <View style={styles.coralHero}>
        <View style={styles.brand}><Text style={styles.heart}>♡</Text><Text style={styles.crave}>Crave</Text><Text style={styles.keep}>Keep</Text></View>
        <Text style={styles.heroTitle}>Keep every recipe you crave.</Text>
        <Text style={styles.sparkle}>✦</Text>
        <View style={styles.mintBlob} />
      </View>
      <View style={styles.sheet}>
        <Animated.View style={[styles.mascotFrame, { opacity: reveal, transform: [{ translateY: reveal.interpolate({ inputRange: [0, 1], outputRange: [24, 0] }) }] }]}>
          {Platform.OS === 'web' ? (
            <WebVideo
              aria-label="Recipe Keeper welcome wave"
              autoPlay
              loop
              muted
              playsInline
              src={welcomeVideo}
              style={styles.welcomeVideo}
            />
          ) : (
            <MascotFrameSequence frames={welcomeFrames} frameDurationMs={1200} transitionDurationMs={160} size={250} accessibilityLabel="Recipe Keeper welcome wave" style={styles.mascotSequence} />
          )}
        </Animated.View>
        <Animated.View style={[styles.copy, { opacity: copy, transform: [{ translateY: copy.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }] }]}>
          <Text style={styles.title}>Save recipes. Plan meals. Cook more.</Text>
          <Text style={styles.subtitle}>Your Recipe Keeper is ready to collect every recipe you love.</Text>
          <Pressable accessibilityRole="button" disabled={Boolean(busy)} onPress={() => void begin()} style={({ pressed }) => [styles.button, pressed && styles.pressed]}>
            <Text style={styles.buttonText}>Get started</Text>
          </Pressable>
          <Pressable accessibilityRole="button" disabled={Boolean(busy)} onPress={() => void oauth('apple')} style={[styles.provider, styles.apple]}>
            {busy === 'apple' ? <ActivityIndicator color={colors.white} /> : <><Ionicons color={colors.white} name="logo-apple" size={20} /><Text style={styles.appleText}>Continue with Apple</Text></>}
          </Pressable>
          <Pressable accessibilityRole="button" disabled={Boolean(busy)} onPress={() => void oauth('google')} style={styles.provider}>
            {busy === 'google' ? <ActivityIndicator color={colors.coral} /> : <><GoogleG /><Text style={styles.providerText}>Continue with Google</Text></>}
          </Pressable>
          <Pressable hitSlop={10} onPress={() => router.push('/onboarding/email?mode=signin')}><Text style={styles.signIn}>Already have an account? <Text style={styles.accent}>Sign in</Text></Text></Pressable>
          {message ? <Text accessibilityRole="alert" style={styles.message}>{message}</Text> : null}
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  loading: { flex: 1, backgroundColor: colors.coral },
  screen: { flex: 1, backgroundColor: colors.background },
  coralHero: { height: '44%', minHeight: 330, backgroundColor: colors.coral, paddingTop: 58, paddingHorizontal: spacing.lg, position: 'relative', overflow: 'hidden' },
  brand: { flexDirection: 'row', alignItems: 'center', zIndex: 2 },
  heart: { color: colors.white, fontSize: 25, fontWeight: '900', marginRight: 4 },
  crave: { color: colors.white, fontSize: 22, fontWeight: '900' },
  keep: { color: colors.charcoal, fontSize: 22, fontWeight: '900' },
  heroTitle: { color: colors.charcoal, ...typography.display, fontSize: 42, lineHeight: 48, marginTop: 48, zIndex: 2 },
  sparkle: { position: 'absolute', right: 38, top: 100, color: colors.lemon, fontSize: 60, fontWeight: '900' },
  mintBlob: { position: 'absolute', right: -72, bottom: -105, width: 245, height: 245, borderRadius: 123, backgroundColor: colors.mint, opacity: 0.85 },
  sheet: { flex: 1, marginTop: -28, borderTopLeftRadius: 30, borderTopRightRadius: 30, backgroundColor: colors.background, paddingHorizontal: spacing.lg, zIndex: 3 },
  mascotFrame: { height: 205, marginTop: -96, alignItems: 'center', justifyContent: 'center' },
  mascot: { width: '94%', height: 250 },
  mascotSequence: { width: '94%', height: 250 },
  welcomeVideo: { width: '94%', height: 250, objectFit: 'contain' },
  copy: { gap: 8, paddingBottom: 18 },
  title: { color: colors.charcoal, ...typography.display, fontSize: 25, lineHeight: 30 },
  subtitle: { color: colors.muted, ...typography.body, fontSize: 15, lineHeight: 21 },
  button: { minHeight: 56, borderRadius: radii.round, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.coral, marginTop: spacing.sm },
  pressed: { opacity: 0.8 },
  buttonText: { color: colors.white, ...typography.action, fontSize: 17 },
  provider: { minHeight: 48, flexDirection: 'row', gap: spacing.sm, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.line, borderRadius: radii.round, backgroundColor: colors.paperRaised },
  apple: { backgroundColor: '#171717', borderColor: '#171717' },
  providerText: { color: colors.charcoal, ...typography.action, fontSize: 14 },
  appleText: { color: colors.white, ...typography.action, fontSize: 14 },
  message: { color: colors.coralDark, textAlign: 'center', fontSize: 12 },
  signIn: { color: colors.muted, textAlign: 'center', ...typography.body },
  accent: { color: colors.coral, fontWeight: '800' },
});
