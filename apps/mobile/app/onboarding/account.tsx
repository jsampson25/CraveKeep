import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Animated, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { OnboardingProgress } from '@/components/onboarding-progress';
import { MotionSlot } from '@/components/animations/MotionSlot';
import { GoogleG } from '@/components/google-g';
import { useAuthStore } from '@/data/auth-store';
import { colors, spacing, typography } from '@/theme';
import logoC from '../../assets/brand/welcome-logo-piece-c.png';
import logoRight from '../../assets/brand/welcome-logo-piece-right.png';
import paperBookArt from '../../assets/onboarding/account-paper-book-v2.png';
import pencilArt from '../../assets/onboarding/account-pencil-v1.png';

export default function AccountOptionsScreen() {
  const insets = useSafeAreaInsets();
  const { configured, signInWithProvider } = useAuthStore();
  const [busy, setBusy] = useState<'apple' | 'google'>();
  const [message, setMessage] = useState<string>();
  const arrive = useRef(new Animated.Value(0)).current;
  const writing = useRef(new Animated.Value(0)).current;
  const settle = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.spring(arrive, { toValue: 1, damping: 14, stiffness: 85, useNativeDriver: true }),
      Animated.timing(writing, { toValue: 1, duration: 1700, useNativeDriver: false }),
      Animated.delay(350),
      Animated.timing(settle, { toValue: 1, duration: 650, useNativeDriver: true })
    ]).start();
  }, [arrive, settle, writing]);
  const oauth = async (provider: 'apple' | 'google') => {
    if (!configured) { setMessage('Sign-in is not configured in this build. Reopen the latest development build and try again.'); return; }
    setBusy(provider); setMessage(undefined);
    try {
      const result = await signInWithProvider(provider);
      if (result.error) setMessage(result.error); else if (!result.cancelled && !result.redirecting) router.replace('/');
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Sign-in could not start. Please try again.'); }
    finally { setBusy(undefined); }
  };

  const pencilX = writing.interpolate({ inputRange: [0, .22, .24, .46, .48, .7, .72, .94, 1], outputRange: [-82, 72, -82, 72, -82, 72, -82, 72, 100] });
  const pencilY = writing.interpolate({ inputRange: [0, .22, .24, .46, .48, .7, .72, .94, 1], outputRange: [76, 76, 108, 108, 140, 140, 172, 172, 188] });

  return <View style={[styles.screen, { paddingTop: insets.top + 8, paddingBottom: Math.max(insets.bottom, 12) }]}>
    <View style={styles.topBar}><View accessibilityLabel="CraveKeep" style={styles.brandMark}><Image resizeMode="contain" source={logoC} style={styles.brandPiece} /><Image resizeMode="contain" source={logoRight} style={styles.brandPiece} /></View><View style={styles.progress}><OnboardingProgress label="Account setup" percent={20} /></View></View>
    <Animated.View style={[styles.intro, { transform: [{ translateY: settle.interpolate({ inputRange: [0, 1], outputRange: [30, 0] }) }, { scale: settle.interpolate({ inputRange: [0, 1], outputRange: [1.03, .94] }) }] }]}>
      <View style={styles.hero}><MotionSlot name='onboarding-recipe-card' size={110} accessibilityLabel='Animated CraveKeep recipe card' style={styles.motion} />
        <Animated.View style={[styles.composition, { opacity: arrive, transform: [{ translateY: arrive.interpolate({ inputRange: [0, 1], outputRange: [24, 0] }) }, { scale: arrive.interpolate({ inputRange: [0, 1], outputRange: [.92, 1] }) }, { rotate: '-4deg' }] }]}>
          <Image resizeMode="contain" source={paperBookArt} style={styles.heroArt} />
          <View style={styles.writingLayer}><Animated.Text style={[styles.recipeTitle, styles.writtenTitle, { opacity: writing.interpolate({ inputRange: [0, .1, .28], outputRange: [0, 0, 1] }) }]}>Lemon Herb Chicken</Animated.Text><Animated.Text style={[styles.ingredient, styles.lineOne, { opacity: writing.interpolate({ inputRange: [.28, .48], outputRange: [0, 1] }) }]}>• 2 boneless chicken breasts</Animated.Text><Animated.Text style={[styles.ingredient, styles.lineTwo, { opacity: writing.interpolate({ inputRange: [.5, .7], outputRange: [0, 1] }) }]}>• 2 tbsp olive oil</Animated.Text><Animated.Text style={[styles.ingredient, styles.lineThree, { opacity: writing.interpolate({ inputRange: [.72, .94], outputRange: [0, 1] }) }]}>• 1 lemon · rosemary</Animated.Text></View>
          <Animated.Image resizeMode="contain" source={pencilArt} style={[styles.pencil, { opacity: writing.interpolate({ inputRange: [0, .03, .215, .225, .235, .245, .455, .465, .475, .485, .695, .705, .715, .725, .935, .95, 1], outputRange: [0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0] }), transform: [{ translateX: pencilX }, { translateY: pencilY }, { rotate: '-24deg' }] }]} />
        </Animated.View>
      </View>
      <Animated.Text accessibilityRole="header" style={[styles.title, { opacity: settle }]}>Keep what you’ve created.</Animated.Text><Animated.Text style={[styles.subtitle, { opacity: settle }]}>Your recipes, organized and ready whenever inspiration returns.</Animated.Text>
    </Animated.View>
    <Animated.View style={[styles.actions, { opacity: settle, transform: [{ translateY: settle.interpolate({ inputRange: [0, 1], outputRange: [28, 0] }) }] }]}>
      <View style={styles.valueRow}>{['Private by default', 'Synced across devices', 'Always yours'].map((label) => <View key={label} style={styles.valueItem}><Ionicons color={colors.herb} name="checkmark-circle" size={16} /><Text style={styles.valueText}>{label}</Text></View>)}</View>
      <Pressable disabled={Boolean(busy)} onPress={() => void oauth('apple')} style={[styles.provider, styles.apple]}>{busy === 'apple' ? <ActivityIndicator color={colors.white} /> : <><Ionicons color={colors.white} name="logo-apple" size={20} /><Text style={styles.appleText}>Continue with Apple</Text></>}</Pressable>
      <Pressable disabled={Boolean(busy)} onPress={() => void oauth('google')} style={styles.provider}>{busy === 'google' ? <ActivityIndicator color={colors.coral} /> : <><GoogleG /><Text style={styles.providerText}>Continue with Google</Text></>}</Pressable>
      <Pressable onPress={() => router.push('/onboarding/email?mode=signup')} style={[styles.provider, styles.email]}><Ionicons color={colors.coralDark} name="mail-outline" size={20} /><Text style={styles.emailText}>Continue with email</Text></Pressable>
      <Pressable hitSlop={10} onPress={() => router.push('/onboarding/email?mode=signin')}><Text style={styles.signIn}>Already have an account? <Text style={styles.signInLink}>Sign in</Text></Text></Pressable>
      {message ? <Text accessibilityRole="alert" style={styles.message}>{message}</Text> : null}<Text style={styles.private}><Ionicons name="lock-closed-outline" size={12} /> Your recipes remain private and secure.</Text>
    </Animated.View>
  </View>;
}

const styles = StyleSheet.create({
  screen: { flex: 1, paddingHorizontal: 22, backgroundColor: colors.paper }, topBar: { flexDirection: 'row', alignItems: 'center', gap: 14 }, brandMark: { width: 48, height: 38 }, brandPiece: { position: 'absolute', width: 48, height: 38 }, progress: { flex: 1 },
  intro: { height: 423, justifyContent: 'flex-end' }, hero: { height: 315, alignItems: 'center' }, motion: { position: 'absolute', right: 14, top: 4, opacity: 0.42, zIndex: 5 }, composition: { width: 345, height: 315 }, heroArt: { position: 'absolute', width: 345, height: 345, top: -16 },
  writingLayer: { position: 'absolute', left: 63, top: 70, width: 190, height: 150 }, recipeTitle: { position: 'absolute', color: colors.charcoal, fontFamily: 'Georgia', fontStyle: 'italic', fontSize: 17, lineHeight: 22 }, writtenTitle: { top: 0 }, ingredient: { position: 'absolute', left: 3, color: colors.charcoal, fontFamily: 'Georgia', fontStyle: 'italic', fontSize: 10, lineHeight: 18 }, lineOne: { top: 34 }, lineTwo: { top: 66 }, lineThree: { top: 98 },
  pencil: { position: 'absolute', left: 0, top: 0, width: 154, height: 38, zIndex: 8 },
  title: { marginTop: 24, color: colors.charcoal, ...typography.display, fontSize: 30, lineHeight: 34, textAlign: 'center' }, subtitle: { marginTop: 5, paddingHorizontal: 18, color: colors.muted, fontSize: 13, lineHeight: 18, textAlign: 'center' },
  actions: { gap: 10, marginTop: 12 }, valueRow: { flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap', columnGap: 12, rowGap: 4 }, valueItem: { flexDirection: 'row', alignItems: 'center', gap: 4 }, valueText: { color: colors.charcoal, ...typography.label, fontSize: 11 }, provider: { minHeight: 50, flexDirection: 'row', gap: spacing.sm, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.line, borderRadius: 14, backgroundColor: colors.paperRaised }, apple: { backgroundColor: '#171717', borderColor: '#171717' }, email: { borderColor: colors.coral }, providerText: { color: colors.charcoal, ...typography.action, fontSize: 15 }, appleText: { color: colors.white, ...typography.action, fontSize: 15 }, emailText: { color: colors.coralDark, ...typography.action, fontSize: 15 }, signIn: { color: colors.muted, textAlign: 'center', fontSize: 13 }, signInLink: { color: colors.coralDark, ...typography.label }, message: { color: colors.coralDark, fontSize: 12, textAlign: 'center' }, private: { color: colors.muted, textAlign: 'center', fontSize: 11 }
});
