import AsyncStorage from '@react-native-async-storage/async-storage';
import { Redirect, router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { AccessibilityInfo, Animated, Image, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { MascotFrameSequence } from '@/components/animations/MascotFrameSequence';
import welcomeFrame01 from '../assets/mascots/role-specific-variants/morning-wave-01.png';
import welcomeFrame02 from '../assets/mascots/role-specific-variants/morning-wave-02.png';
import welcomeFrame03 from '../assets/mascots/role-specific-variants/morning-wave-03.png';
import welcomeFrame04 from '../assets/mascots/role-specific-variants/morning-wave-04.png';
import welcomeVideo from '../assets/welcome-mascot-silent.mp4';
import logoLockup from '../assets/brand/welcome-logo-lockup.png';

type WebVideoProps = { 'aria-label'?: string; autoPlay?: boolean; loop?: boolean; muted?: boolean; playsInline?: boolean; src: number | string; style?: object };
const WebVideo = 'video' as unknown as React.ComponentType<WebVideoProps>;
import { completeOAuthRedirect, useAuthStore } from '@/data/auth-store';
import { useOnboardingStore } from '@/data/onboarding-store';
import { colors, radii, spacing, typography } from '@/theme';

const WELCOME_KEY = 'cravekeep.welcome.v12';
const welcomeFrames = [
  welcomeFrame01, welcomeFrame02, welcomeFrame03, welcomeFrame04,
];

export default function Index() {
  const { ready: authReady, user } = useAuthStore();
  const callbackParams = useLocalSearchParams<{ code?: string; error?: string; error_description?: string }>();
  const { ready: onboardingReady, profile } = useOnboardingStore();
  const [ready, setReady] = useState(false);
  const [seen, setSeen] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [message, setMessage] = useState<string>();
  const [oauthHandled, setOauthHandled] = useState(false);
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
    const hasCallback = Platform.OS === 'web' && Boolean(callbackParams.code || callbackParams.error);
    if (!hasCallback || oauthHandled || typeof window === 'undefined') return;
    setOauthHandled(true);
    void completeOAuthRedirect(window.location.href).then((result) => {
      if (result.error) setMessage(result.error);
    }).catch((error) => setMessage(error instanceof Error ? error.message : 'Secure sign-in could not finish.'));
  }, [callbackParams.code, callbackParams.error, oauthHandled]);

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

  const begin = async () => {
    try { await AsyncStorage.setItem(WELCOME_KEY, 'seen'); router.replace('/onboarding/account'); }
    catch { setMessage('Could not start onboarding. Please try again.'); }
  };

  return (
    <View style={styles.outer}>
    <View style={styles.screen}>
      <Animated.View style={[styles.copy, { opacity: copy }]}>
        <Image accessibilityLabel="CraveKeep" resizeMode="contain" source={logoLockup} style={styles.logo} />
        <Text accessibilityRole="header" style={styles.title}>Your kitchen,{String.fromCharCode(10)}<Text style={styles.accent}>finally organized.</Text></Text>
        <Text style={styles.subtitle}>Save recipes, plan meals, and make grocery shopping easier.</Text>
      </Animated.View>
      <View style={styles.heroCard}>
        <Text style={styles.sparkleOne}>✦</Text><Text style={styles.sparkleTwo}>✦</Text>
        <Animated.View style={[styles.mascotFrame, { opacity: reveal, transform: [{ translateY: reveal.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }] }]}>
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
      </View>
        <Animated.View style={[styles.actions, { opacity: copy, transform: [{ translateY: copy.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }] }]}>
          <Pressable accessibilityRole="button" onPress={() => void begin()} style={({ pressed }) => [styles.button, pressed && styles.pressed]}>
            <Text style={styles.buttonText}>Get Started</Text>
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
  outer: { flex: 1, alignItems: 'center', backgroundColor: '#F7F5F2' },
  screen: { flex: 1, width: '100%', maxWidth: 430, paddingTop: 54, paddingHorizontal: 24, paddingBottom: 24, backgroundColor: '#FFFFFF' },
  copy: { alignItems: 'center' },
  logo: { width: 205, height: 64, marginBottom: 18 },
  title: { color: colors.charcoal, ...typography.display, fontSize: 34, lineHeight: 38, textAlign: 'center' },
  accent: { color: colors.coral, fontWeight: '800' },
  subtitle: { marginTop: 12, paddingHorizontal: 14, color: colors.muted, ...typography.body, fontSize: 15, lineHeight: 21, textAlign: 'center' },
  heroCard: { flex: 1, minHeight: 330, maxHeight: 430, marginTop: 22, borderRadius: 28, backgroundColor: '#FBF4EC', overflow: 'hidden', alignItems: 'center', justifyContent: 'flex-end' },
  mascotFrame: { width: '100%', height: '100%', alignItems: 'center', justifyContent: 'flex-end' },
  mascotSequence: { width: '100%', height: 360 },
  welcomeVideo: { width: '100%', height: 360, objectFit: 'contain' },
  sparkleOne: { position: 'absolute', left: 28, top: 34, color: colors.coral, fontSize: 28 },
  sparkleTwo: { position: 'absolute', right: 30, top: 78, color: colors.lemon, fontSize: 38 },
  actions: { gap: 14, paddingTop: 20 },
  button: { minHeight: 56, borderRadius: radii.round, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.coral, marginTop: spacing.sm },
  pressed: { opacity: 0.8 },
  buttonText: { color: colors.white, ...typography.action, fontSize: 17 },
  message: { color: colors.coralDark, textAlign: 'center', fontSize: 12 },
  signIn: { color: colors.muted, textAlign: 'center', ...typography.body },
});
