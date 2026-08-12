import { StyleSheet, Text, View } from 'react-native';
import { colors } from '@/theme';

export function BrandLogo({ compact = false }: { compact?: boolean }) {
  const scale = compact ? 0.55 : 1;
  return <View accessibilityLabel="CraveKeep" style={styles.wrap}><View style={[styles.mark, { transform: [{ scale }] }]}><View style={styles.cTop} /><View style={styles.cSide} /><View style={styles.cBottom} /><View style={styles.recipe}>{[0, 1, 2].map((line) => <View key={line} style={styles.recipeLine} />)}</View><View style={[styles.kArm, styles.kTop]} /><View style={[styles.kArm, styles.kBottom]} /></View><Text style={[styles.wordmark, compact && styles.wordmarkCompact]}>CraveKeep</Text></View>;
}

const styles = StyleSheet.create({ wrap: { alignItems: 'center' }, mark: { width: 150, height: 112, marginHorizontal: -34, marginVertical: -22 }, cTop: { position: 'absolute', left: 10, top: 12, width: 82, height: 24, borderRadius: 14, backgroundColor: colors.charcoal }, cSide: { position: 'absolute', left: 10, top: 24, width: 24, height: 66, borderRadius: 14, backgroundColor: colors.charcoal }, cBottom: { position: 'absolute', left: 10, bottom: 10, width: 82, height: 24, borderRadius: 14, backgroundColor: colors.charcoal }, recipe: { position: 'absolute', left: 50, top: 39, gap: 7 }, recipeLine: { width: 30, height: 7, borderRadius: 4, backgroundColor: colors.coral }, kArm: { position: 'absolute', left: 83, top: 49, width: 58, height: 22, borderRadius: 11, backgroundColor: colors.charcoal }, kTop: { transform: [{ rotate: '-45deg' }] }, kBottom: { transform: [{ rotate: '45deg' }] }, wordmark: { color: colors.charcoal, fontSize: 32, fontWeight: '800', letterSpacing: -1.2 }, wordmarkCompact: { fontSize: 20, marginTop: -10 } });
