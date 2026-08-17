import { Ionicons } from '@expo/vector-icons';
import { useEffect, useRef, useState } from 'react';
import { AccessibilityInfo, Animated, Easing, Image, StyleSheet, View, type ViewStyle } from 'react-native';
import { colors, radii } from '@/theme';
import { supabase } from '@/data/supabase';

type RecipeArtProps = { compact?: boolean; favorite?: boolean; imageUrl?: string; storagePath?: string; style?: ViewStyle };

export function RecipeArt({ compact = false, favorite = false, imageUrl, storagePath, style }: RecipeArtProps) {
  const reveal = useRef(new Animated.Value(0)).current;
  const [reduceMotion, setReduceMotion] = useState(false);
  const [resolvedImageUrl, setResolvedImageUrl] = useState(imageUrl);
  useEffect(() => {
    let active = true;
    void AccessibilityInfo.isReduceMotionEnabled().then((enabled) => { if (active) setReduceMotion(enabled); });
    const subscription = AccessibilityInfo.addEventListener('reduceMotionChanged', setReduceMotion);
    return () => { active = false; subscription.remove(); };
  }, []);
  useEffect(() => {
    setResolvedImageUrl(imageUrl);
    if (imageUrl || !storagePath || !supabase) return;
    let active = true;
    void supabase.storage.from('recipe-imports').createSignedUrl(storagePath, 3600).then(({ data }) => { if (active && data?.signedUrl) setResolvedImageUrl(data.signedUrl); });
    return () => { active = false; };
  }, [imageUrl, storagePath]);
  useEffect(() => {
    reveal.stopAnimation();
    reveal.setValue(reduceMotion ? 1 : 0);
    if (!reduceMotion) Animated.timing(reveal, { toValue: 1, duration: compact ? 550 : 900, easing: Easing.out(Easing.cubic), useNativeDriver: true }).start();
  }, [compact, reduceMotion, reveal]);
  const size = compact ? 38 : 76;
  return <View accessibilityElementsHidden importantForAccessibility="no-hide-descendants" style={[styles.frame, compact ? styles.compact : styles.hero, style]}>
    {resolvedImageUrl ? <Image accessibilityLabel="Imported recipe image" source={{ uri: resolvedImageUrl }} style={styles.image} /> : <><View style={styles.paperShape} /><Ionicons color={colors.charcoal} name="restaurant-outline" size={size} /><Animated.View style={[styles.colorLayer, { opacity: reveal, transform: [{ translateY: reveal.interpolate({ inputRange: [0, 1], outputRange: [compact ? 10 : 18, 0] }) }, { scale: reveal.interpolate({ inputRange: [0, 1], outputRange: [0.92, 1] }) }] }]}><Ionicons color={colors.coral} name="restaurant" size={size} /></Animated.View>
    <Animated.View style={[styles.leaf, { opacity: reveal }]}><Ionicons color={colors.herb} name="leaf" size={compact ? 16 : 26} /></Animated.View></>}
    {favorite ? <View style={styles.favorite}><Ionicons color={colors.coral} name="heart" size={compact ? 18 : 22} /></View> : null}
  </View>;
}

const styles = StyleSheet.create({ image: { width: '100%', height: '100%', resizeMode: 'cover' }, frame: { overflow: 'hidden', alignItems: 'center', justifyContent: 'center', backgroundColor: colors.paperRaised, borderWidth: 1, borderColor: colors.line }, compact: { height: 128, borderRadius: radii.medium }, hero: { height: 220, borderRadius: radii.large }, paperShape: { position: 'absolute', width: '72%', height: '72%', borderRadius: radii.large, backgroundColor: colors.herbSoft, transform: [{ rotate: '-5deg' }] }, colorLayer: { position: 'absolute' }, leaf: { position: 'absolute', left: '18%', bottom: '16%' }, favorite: { position: 'absolute', right: 10, top: 10, width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.paperRaised } });
