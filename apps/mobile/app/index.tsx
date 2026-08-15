import AsyncStorage from '@react-native-async-storage/async-storage';
import { Redirect, router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { AccessibilityInfo, Animated, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { MascotFrameSequence } from '@/components/animations/MascotFrameSequence';
import { MotionSlot } from '@/components/animations/MotionSlot';
import { useAuthStore } from '@/data/auth-store';
import { useOnboardingStore } from '@/data/onboarding-store';
import { colors, radii, spacing, typography } from '@/theme';

const WELCOME_KEY = 'cravekeep.welcome.v11';
const welcomeFrames = [
  require('../assets/mascots/role-specific-variants/morning-wave-01.png'),
  require('../assets/mascots/role-specific-variants/morning-wave-02.png'),
  require('../assets/mascots/role-specific-variants/morning-wave-03.png'),
  require('../assets/mascots/role-specific-variants/morning-wave-04.png'),
];

export default function Index() {
  const { ready: authReady, user } = useAuthStore();
  const { ready: onboardingReady, profile } = useOnboardingStore();
  const [ready, setReady] = useState(false);
  const [seen, setSeen] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const reveal = useRef(new Animated.Value(0)).current;
  const copy = useRef(new Animated.Value(0)).current;
  const bounce = useRef(new Animated.Value(0)).current;
  const sway = useRef(new Animated.Value(0)).current;
  const pulse = useRef(new Animated.Value(0)).current;

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
      bounce.setValue(0);
      sway.setValue(0);
      pulse.setValue(1);
      return;
    }
    Animated.parallel([
      Animated.timing(reveal, { toValue: 1, duration: 850, useNativeDriver: true }),
      Animated.timing(copy, { toValue: 1, duration: 600, delay: 250, useNativeDriver: true }),
      Animated.loop(Animated.sequence([
        Animated.parallel([
          Animated.timing(bounce, { toValue: -8, duration: 520, useNativeDriver: true }),
          Animated.timing(sway, { toValue: -1, duration: 520, useNativeDriver: true }),
          Animated.timing(pulse, { toValue: 1, duration: 520, useNativeDriver: true }),
        ]),
        Animated.parallel([
          Animated.timing(bounce, { toValue: 0, duration: 520, useNativeDriver: true }),
          Animated.timing(sway, { toValue: 1, duration: 520, useNativeDriver: true }),
          Animated.timing(pulse, { toValue: 0, duration: 520, useNativeDriver: true }),
        ]),
        Animated.parallel([
          Animated.timing(bounce, { toValue: -4, duration: 320, useNativeDriver: true }),
          Animated.timing(sway, { toValue: 0, duration: 320, useNativeDriver: true }),
          Animated.timing(pulse, { toValue: 1, duration: 320, useNativeDriver: true }),
        ]),
      ])),
    ]).start();
  }, [bounce, copy, pulse, ready, reduceMotion, reveal, seen, sway]);

  if (!ready || !authReady || !onboardingReady) return <View style={styles.loading} />;
  if (user) return <Redirect href={profile.completed ? '/(tabs)/home' : '/onboarding/profile'} />;
  if (seen) return <Redirect href="/onboarding/account" />;

  const begin = async () => {
    await AsyncStorage.setItem(WELCOME_KEY, 'seen');
    router.replace('/onboarding/account');
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
        <Animated.View style={[styles.mascotFrame, { opacity: reveal, transform: [{ translateY: reveal.interpolate({ inputRange: [0, 1], outputRange: [80, 0] }) }] }]}>
          <MotionSlot name="launch-reveal" size={210} accessibilityLabel="Recipe Keeper mascot animation" style={styles.lottie} />
          <Animated.View style={[styles.actionMark, { opacity: pulse, transform: [{ scale: pulse.interpolate({ inputRange: [0, 1], outputRange: [0.7, 1.15] }) }, { rotate: sway.interpolate({ inputRange: [-1, 0, 1], outputRange: ['-12deg', '0deg', '12deg'] }) }] }]}>
            <Text style={styles.actionMarkText}>✦</Text>
          </Animated.View>\n          <MascotFrameSequence frames={welcomeFrames} frameDurationMs={560} transitionDurationMs={110} size={250} accessibilityLabel="Recipe Keeper welcome wave" style={styles.mascotSequence} />
        </Animated.View>
        <Animated.View style={[styles.copy, { opacity: copy, transform: [{ translateY: copy.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }] }]}>
          <Text style={styles.title}>Save recipes. Plan meals. Cook more.</Text>
          <Text style={styles.subtitle}>Your Recipe Keeper is ready to collect every recipe you love.</Text>
          <Pressable accessibilityRole="button" onPress={() => void begin()} style={({ pressed }) => [styles.button, pressed && styles.pressed]}>
            <Text style={styles.buttonText}>Get started</Text>
          </Pressable>
          <Text style={styles.signIn}>Already have an account? <Text style={styles.accent}>Sign in</Text></Text>
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
  keep: { color: colors.navy, fontSize: 22, fontWeight: '900' },
  heroTitle: { color: colors.navy, ...typography.display, fontSize: 42, lineHeight: 48, marginTop: 48, zIndex: 2 },
  sparkle: { position: 'absolute', right: 38, top: 100, color: colors.yellow, fontSize: 60, fontWeight: '900' },
  mintBlob: { position: 'absolute', right: -72, bottom: -105, width: 245, height: 245, borderRadius: 123, backgroundColor: colors.mint, opacity: 0.85 },
  sheet: { flex: 1, marginTop: -28, borderTopLeftRadius: 30, borderTopRightRadius: 30, backgroundColor: colors.background, paddingHorizontal: spacing.lg, zIndex: 3 },
  mascotFrame: { height: 205, marginTop: -96, alignItems: 'center', justifyContent: 'center' },
  mascot: { width: '94%', height: 250 },
  mascotSequence: { width: '94%', height: 250 },
  lottie: { position: 'absolute', opacity: 0.1 },
  actionMark: { position: 'absolute', right: 20, top: 20, zIndex: 4 },
  actionMarkText: { color: colors.coral, fontSize: 34, fontWeight: '900' },
  copy: { gap: spacing.sm, paddingBottom: 18 },
  title: { color: colors.navy, ...typography.display, fontSize: 25, lineHeight: 30 },
  subtitle: { color: colors.muted, ...typography.body, fontSize: 15, lineHeight: 21 },
  button: { minHeight: 56, borderRadius: radii.round, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.coral, marginTop: spacing.sm },
  pressed: { opacity: 0.8 },
  buttonText: { color: colors.white, ...typography.action, fontSize: 17 },
  signIn: { color: colors.muted, textAlign: 'center', ...typography.caption },
  accent: { color: colors.coral, fontWeight: '800' },
});
