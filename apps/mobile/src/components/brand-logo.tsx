import { Animated, Image, StyleSheet, View, type ImageSourcePropType } from 'react-native';
import logoC from '../../assets/brand/welcome-logo-c.png';
import logoLockup from '../../assets/brand/welcome-logo-lockup.png';
import logoMark from '../../assets/brand/welcome-logo-mark.png';

export type BrandLogoStage = 'c' | 'mark' | 'lockup';
const sources: Record<BrandLogoStage, ImageSourcePropType> = { c: logoC, mark: logoMark, lockup: logoLockup };

export function BrandLogo({ stage = 'lockup', compact = false }: { stage?: BrandLogoStage; compact?: boolean }) {
  return <View accessibilityLabel="CraveKeep" style={[styles.wrap, compact ? styles.compact : styles.full]}><Image resizeMode="contain" source={sources[stage]} style={styles.image} /></View>;
}

export function AnimatedBrandLogo({ stage, opacity }: { stage: BrandLogoStage; opacity: Animated.Value | Animated.AnimatedInterpolation<number> }) {
  return <Animated.View style={[styles.layer, { opacity }]}><BrandLogo stage={stage} /></Animated.View>;
}

const styles = StyleSheet.create({ wrap: { alignItems: 'center', justifyContent: 'center' }, full: { width: 280, height: 240 }, compact: { width: 112, height: 72 }, image: { width: '100%', height: '100%' }, layer: { position: 'absolute', alignItems: 'center', justifyContent: 'center' } });
