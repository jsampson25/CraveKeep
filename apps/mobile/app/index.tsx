import AsyncStorage from '@react-native-async-storage/async-storage';
import { Redirect, router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { AccessibilityInfo, Animated, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { AnimatedBrandLogo } from '@/components/brand-logo';
import { colors, radii, spacing, typography } from '@/theme';
import foodColor from '../assets/brand/welcome-food-color.png';
import foodOutline from '../assets/brand/welcome-food-outline.png';

const WELCOME_KEY = 'cravekeep.welcome.v6';

export default function Index() {
  const [ready, setReady] = useState(false);
  const [seen, setSeen] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const assemble = useRef(new Animated.Value(0)).current;
  const word = useRef(new Animated.Value(0)).current;
  const settle = useRef(new Animated.Value(0)).current;
  const food = useRef(new Animated.Value(0)).current;
  const content = useRef(new Animated.Value(0)).current;
  useEffect(() => { void Promise.all([AsyncStorage.getItem(WELCOME_KEY), AccessibilityInfo.isReduceMotionEnabled()]).then(([value, reduced]) => { setSeen(Boolean(value)); setReduceMotion(reduced); setReady(true); }); }, []);
  useEffect(() => {
    if (!ready || seen) return;
    if (reduceMotion) { assemble.setValue(1); word.setValue(1); settle.setValue(1); food.setValue(1); content.setValue(1); return; }
    Animated.sequence([Animated.timing(assemble, { toValue: 1, duration: 850, useNativeDriver: true }), Animated.timing(word, { toValue: 1, duration: 420, useNativeDriver: true }), Animated.delay(300), Animated.timing(settle, { toValue: 1, duration: 650, useNativeDriver: true }), Animated.delay(550), Animated.timing(food, { toValue: 1, duration: 1800, useNativeDriver: true }), Animated.timing(content, { toValue: 1, duration: 450, useNativeDriver: true })]).start();
  }, [assemble, content, food, ready, reduceMotion, seen, settle, word]);
  if (!ready) return <View style={styles.screen} />;
  if (seen) return <Redirect href="/(tabs)/home" />;
  const begin = async () => { await AsyncStorage.setItem(WELCOME_KEY, 'seen'); router.replace('/onboarding/account'); };
  return <View style={styles.screen}><Animated.View style={[styles.logoStage, { transform: [{ translateY: settle.interpolate({ inputRange: [0, 1], outputRange: [0, -320] }) }, { scale: settle.interpolate({ inputRange: [0, 1], outputRange: [1, 0.38] }) }] }]}><AnimatedBrandLogo assemble={assemble} word={word} /></Animated.View><Animated.View style={[styles.final, { opacity: settle }]}><View style={styles.art}><Image resizeMode="contain" source={foodOutline} style={[styles.food, styles.outline]} /><Animated.Image resizeMode="contain" source={foodColor} style={[styles.food, { opacity: food }]} /></View><Animated.View style={[styles.copy, { opacity: content }]}><Text accessibilityRole="header" style={styles.title}>Every recipe you crave.{`\n`}Kept your way.</Text><Pressable accessibilityRole="button" onPress={() => void begin()} style={({ pressed }) => [styles.button, pressed && styles.pressed]}><Text style={styles.buttonText}>Let’s begin</Text></Pressable></Animated.View></Animated.View></View>;
}

const styles = StyleSheet.create({ screen: { flex: 1, backgroundColor: colors.paper, alignItems: 'center', justifyContent: 'center' }, logoStage: { position: 'absolute', width: 300, height: 286, alignItems: 'center', justifyContent: 'center', zIndex: 3 }, final: { position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, paddingHorizontal: spacing.lg, paddingTop: 170, paddingBottom: 36 }, art: { flex: 1, minHeight: 300, position: 'relative' }, food: { position: 'absolute', width: '100%', height: '100%' }, outline: { opacity: 0.42 }, copy: { gap: spacing.lg }, title: { color: colors.charcoal, ...typography.display, fontSize: 36, lineHeight: 42 }, button: { minHeight: 58, borderRadius: radii.medium, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.coral }, pressed: { opacity: 0.8 }, buttonText: { color: colors.white, ...typography.action, fontSize: 18 } });
