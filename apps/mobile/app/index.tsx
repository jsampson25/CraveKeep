import AsyncStorage from '@react-native-async-storage/async-storage';
import { Redirect, router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { AccessibilityInfo, Animated, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { AnimatedBrandLogo, BrandLogo } from '@/components/brand-logo';
import { colors, radii, spacing } from '@/theme';
import foodColor from '../assets/brand/welcome-food-color.png';
import foodOutline from '../assets/brand/welcome-food-outline.png';

const WELCOME_KEY = 'cravekeep.welcome.v3';

export default function Index() {
  const [ready, setReady] = useState(false);
  const [seen, setSeen] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const logo = useRef(new Animated.Value(0)).current;
  const settle = useRef(new Animated.Value(0)).current;
  const food = useRef(new Animated.Value(0)).current;
  const content = useRef(new Animated.Value(0)).current;
  useEffect(() => { void Promise.all([AsyncStorage.getItem(WELCOME_KEY), AccessibilityInfo.isReduceMotionEnabled()]).then(([value, reduced]) => { setSeen(Boolean(value)); setReduceMotion(reduced); setReady(true); }); }, []);
  useEffect(() => {
    if (!ready || seen) return;
    if (reduceMotion) { logo.setValue(3); settle.setValue(1); food.setValue(1); content.setValue(1); return; }
    Animated.sequence([Animated.timing(logo, { toValue: 1, duration: 650, useNativeDriver: true }), Animated.timing(logo, { toValue: 2, duration: 700, useNativeDriver: true }), Animated.timing(logo, { toValue: 3, duration: 500, useNativeDriver: true }), Animated.parallel([Animated.timing(settle, { toValue: 1, duration: 550, useNativeDriver: true }), Animated.timing(food, { toValue: 1, duration: 900, useNativeDriver: true })]), Animated.timing(content, { toValue: 1, duration: 350, useNativeDriver: true })]).start();
  }, [content, food, logo, ready, reduceMotion, seen, settle]);
  if (!ready) return <View style={styles.screen} />;
  if (seen) return <Redirect href="/(tabs)/home" />;
  const begin = async () => { await AsyncStorage.setItem(WELCOME_KEY, 'seen'); router.replace('/(tabs)/home'); };
  const cOpacity = logo.interpolate({ inputRange: [0, 0.7, 1, 1.25], outputRange: [0, 1, 1, 0], extrapolate: 'clamp' });
  const markOpacity = logo.interpolate({ inputRange: [0.8, 1.15, 1.75, 2.05], outputRange: [0, 1, 1, 0], extrapolate: 'clamp' });
  const lockupOpacity = logo.interpolate({ inputRange: [1.8, 2.2, 3], outputRange: [0, 1, 1], extrapolate: 'clamp' });
  return <View style={styles.screen}><Animated.View style={[styles.logoStage, { transform: [{ translateY: settle.interpolate({ inputRange: [0, 1], outputRange: [0, -260] }) }, { scale: settle.interpolate({ inputRange: [0, 1], outputRange: [1, 0.43] }) }] }]}><AnimatedBrandLogo opacity={cOpacity} stage="c" /><AnimatedBrandLogo opacity={markOpacity} stage="mark" /><AnimatedBrandLogo opacity={lockupOpacity} stage="lockup" /></Animated.View><Animated.View style={[styles.finalLogo, { opacity: settle }]}><BrandLogo compact /></Animated.View><Animated.View style={[styles.final, { opacity: settle }]}><View style={styles.art}><Image resizeMode="contain" source={foodOutline} style={[styles.food, styles.outline]} /><Animated.Image resizeMode="contain" source={foodColor} style={[styles.food, { opacity: food, transform: [{ translateY: food.interpolate({ inputRange: [0, 1], outputRange: [18, 0] }) }] }]} /></View><Animated.View style={[styles.copy, { opacity: content }]}><Text accessibilityRole="header" style={styles.title}>Your recipes.{`\n`}Kept your way.</Text><Pressable accessibilityRole="button" onPress={() => void begin()} style={({ pressed }) => [styles.button, pressed && styles.pressed]}><Text style={styles.buttonText}>Let’s begin</Text></Pressable></Animated.View></Animated.View></View>;
}

const styles = StyleSheet.create({ screen: { flex: 1, backgroundColor: colors.paper, alignItems: 'center', justifyContent: 'center' }, logoStage: { position: 'absolute', width: 280, height: 240, alignItems: 'center', justifyContent: 'center', zIndex: 2 }, finalLogo: { position: 'absolute', top: 54, alignItems: 'center', zIndex: 3 }, final: { position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, paddingHorizontal: spacing.lg, paddingTop: 126, paddingBottom: 36 }, art: { flex: 1, minHeight: 320, position: 'relative' }, food: { position: 'absolute', width: '100%', height: '100%' }, outline: { opacity: 0.32 }, copy: { gap: spacing.lg }, title: { color: colors.charcoal, fontFamily: 'Georgia', fontSize: 38, lineHeight: 43, fontWeight: '700', letterSpacing: -1 }, button: { minHeight: 58, borderRadius: radii.medium, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.coral }, pressed: { opacity: 0.8 }, buttonText: { color: colors.white, fontSize: 18, fontWeight: '800' } });
