import { StyleSheet, Text, View } from 'react-native';
import { colors, radii, spacing, typography } from '@/theme';

export function OnboardingProgress({ percent, label }: { percent: number; label: string }) {
  const safe = Math.max(1, Math.min(100, Math.round(percent)));
  return <View accessibilityLabel={`Onboarding ${safe}% complete. ${label}`} accessibilityRole="progressbar" accessibilityValue={{ min: 0, max: 100, now: safe }} style={styles.wrap}><View style={styles.row}><Text style={styles.label}>{label}</Text><Text style={styles.percent}>{safe}%</Text></View><View style={styles.track}><View style={[styles.fill, { width: `${safe}%` }]} /></View></View>;
}

const styles = StyleSheet.create({ wrap: { gap: spacing.sm }, row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }, label: { color: colors.charcoal, ...typography.label, fontSize: 13 }, percent: { color: colors.coralDark, ...typography.action, fontSize: 13 }, track: { height: 6, overflow: 'hidden', borderRadius: radii.round, backgroundColor: colors.line }, fill: { height: 6, borderRadius: radii.round, backgroundColor: colors.coral } });
