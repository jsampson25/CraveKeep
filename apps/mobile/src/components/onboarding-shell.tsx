import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import type { PropsWithChildren, ReactNode } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, radii, spacing, typography } from '@/theme';

export function OnboardingShell({ title, percent, children, footer }: PropsWithChildren<{ title: ReactNode; percent: number; footer?: ReactNode }>) {
  return <SafeAreaView edges={['top', 'bottom']} style={styles.screen}>
    <View style={styles.brandRow}><Pressable accessibilityLabel="Go back" onPress={() => router.back()} style={styles.back}><Ionicons color={colors.charcoal} name="chevron-back" size={20} /></Pressable><Text style={styles.percent}>{percent}% complete</Text><View style={styles.headerSpacer} /></View>
    <View accessibilityRole="progressbar" accessibilityValue={{ min: 0, max: 100, now: percent }} style={styles.progressTrack}><View style={[styles.progressFill, { width: `${percent}%` }]} /></View>
    <Text style={styles.stepTitle}>{title}</Text>
    <ScrollView
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
      nestedScrollEnabled
      showsVerticalScrollIndicator
      style={styles.scroll}
    >{children}</ScrollView>
    {footer ? <View style={styles.footer}>{footer}</View> : null}
  </SafeAreaView>;
}
export function SettingRow({ icon, title, value, onPress, danger = false }: { icon?: keyof typeof Ionicons.glyphMap; title: string; value?: string; onPress?: () => void; danger?: boolean }) { return <Pressable disabled={!onPress} onPress={onPress} style={styles.row}>{icon ? <Ionicons color={danger ? colors.coralDark : colors.coral} name={icon} size={18} /> : null}<Text style={[styles.rowTitle, danger && styles.danger]}>{title}</Text>{value ? <Text numberOfLines={1} style={styles.value}>{value}</Text> : null}{onPress ? <Ionicons color={colors.muted} name="chevron-forward" size={16} /> : null}</Pressable>; }
export function Panel({ children }: PropsWithChildren) { return <View style={styles.panel}>{children}</View>; }

const styles = StyleSheet.create({
  screen: { flex: 1, minHeight: 0, width: '100%', maxWidth: 430, alignSelf: 'center', paddingHorizontal: spacing.lg, backgroundColor: '#FFFFFF' },
  brandRow: { height: 52, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 },
  back: { width: 38, height: 38, borderRadius: 19, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.paperRaised, alignItems: 'center', justifyContent: 'center' },
  headerSpacer: { width: 38, height: 38 },
  percent: { flex: 1, color: colors.charcoal, fontSize: 12, fontWeight: '800', textAlign: 'center' },
  progressTrack: { height: 5, overflow: 'hidden', borderRadius: 999, backgroundColor: '#EEE9E4', flexShrink: 0 },
  progressFill: { height: 5, borderRadius: 999, backgroundColor: colors.coral },
  stepTitle: { color: colors.charcoal, ...typography.title, fontSize: 29, lineHeight: 32, marginTop: spacing.lg, marginBottom: spacing.sm, textAlign: 'left', flexShrink: 0 },
  scroll: { flex: 1, minHeight: 0, width: '100%' },
  content: { gap: spacing.md, paddingTop: spacing.lg, paddingBottom: 32, flexGrow: 1 },
  footer: { flexShrink: 0, paddingTop: spacing.sm, paddingBottom: spacing.sm, backgroundColor: '#FFFFFF' },
  panel: { overflow: 'hidden', borderWidth: 1, borderColor: colors.line, borderRadius: radii.large, backgroundColor: colors.paperRaised, shadowColor: colors.charcoal, shadowOpacity: 0.07, shadowRadius: 16, shadowOffset: { width: 0, height: 6 }, elevation: 3 },
  row: { minHeight: 58, paddingHorizontal: spacing.md, flexDirection: 'row', alignItems: 'center', gap: 10, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.line },
  rowTitle: { flex: 1, color: colors.charcoal, ...typography.label }, value: { maxWidth: '42%', color: colors.muted, fontSize: 12 }, danger: { color: colors.coralDark }
});
