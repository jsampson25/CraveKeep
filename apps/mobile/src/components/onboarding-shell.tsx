import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import type { PropsWithChildren, ReactNode } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { OnboardingProgress } from './onboarding-progress';
import { colors, radii, spacing, typography } from '@/theme';

export function OnboardingShell({ title, percent, children, footer }: PropsWithChildren<{ title: ReactNode; percent: number; footer?: ReactNode }>) {
  return <SafeAreaView edges={['top', 'bottom']} style={styles.screen}>
    <View pointerEvents="none" style={styles.accentOne} /><View pointerEvents="none" style={styles.accentTwo} />
    <View style={styles.brandRow}><Pressable accessibilityLabel="Go back" onPress={() => router.back()} style={styles.back}><Ionicons color={colors.charcoal} name="chevron-back" size={20} /></Pressable><Text style={styles.percent}>{percent}% complete</Text><View style={styles.headerSpacer} /></View>
    <OnboardingProgress label="Onboarding progress" percent={percent} />
    <Text style={styles.stepTitle}>{title}</Text>
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>{children}</ScrollView>
    {footer ? <View style={styles.footer}>{footer}</View> : null}
  </SafeAreaView>;
}
export function SettingRow({ icon, title, value, onPress, danger = false }: { icon?: keyof typeof Ionicons.glyphMap; title: string; value?: string; onPress?: () => void; danger?: boolean }) { return <Pressable disabled={!onPress} onPress={onPress} style={styles.row}>{icon ? <Ionicons color={danger ? colors.coralDark : colors.coral} name={icon} size={18} /> : null}<Text style={[styles.rowTitle, danger && styles.danger]}>{title}</Text>{value ? <Text numberOfLines={1} style={styles.value}>{value}</Text> : null}{onPress ? <Ionicons color={colors.muted} name="chevron-forward" size={16} /> : null}</Pressable>; }
export function Panel({ children }: PropsWithChildren) { return <View style={styles.panel}>{children}</View>; }

const styles = StyleSheet.create({
  screen: { flex: 1, paddingHorizontal: spacing.lg, backgroundColor: colors.background },
  accentOne: { position: 'absolute', width: 210, height: 210, borderRadius: 105, backgroundColor: colors.mintSoft, right: -105, top: 72 },
  accentTwo: { position: 'absolute', width: 150, height: 150, borderRadius: 75, backgroundColor: colors.lemonSoft, left: -85, bottom: 34 },
  brandRow: { height: 52, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  back: { width: 38, height: 38, borderRadius: 19, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.paperRaised, alignItems: 'center', justifyContent: 'center' },
  headerSpacer: { width: 38, height: 38 },
  percent: { flex: 1, color: colors.charcoal, fontSize: 12, fontWeight: '800', textAlign: 'center' },
  stepTitle: { color: colors.charcoal, ...typography.title, fontSize: 29, lineHeight: 32, marginTop: spacing.lg, marginBottom: spacing.sm, textAlign: 'left' },
  content: { gap: spacing.md, paddingVertical: spacing.lg, paddingBottom: spacing.xl },
  footer: { paddingVertical: spacing.sm },
  panel: { overflow: 'hidden', borderWidth: 1, borderColor: colors.line, borderRadius: radii.large, backgroundColor: colors.paperRaised, shadowColor: colors.charcoal, shadowOpacity: 0.07, shadowRadius: 16, shadowOffset: { width: 0, height: 6 }, elevation: 3 },
  row: { minHeight: 58, paddingHorizontal: spacing.md, flexDirection: 'row', alignItems: 'center', gap: 10, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.line },
  rowTitle: { flex: 1, color: colors.charcoal, ...typography.label }, value: { maxWidth: '42%', color: colors.muted, fontSize: 12 }, danger: { color: colors.coralDark }
});