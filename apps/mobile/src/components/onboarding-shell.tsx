import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import type { PropsWithChildren, ReactNode } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { OnboardingProgress } from './onboarding-progress';
import { colors, radii, spacing, typography } from '@/theme';

export function OnboardingShell({ title, percent, children, footer }: PropsWithChildren<{ title: string; percent: number; footer?: ReactNode }>) {
  return <SafeAreaView edges={['top', 'bottom']} style={styles.screen}>
    <View pointerEvents="none" style={styles.accentOne} /><View pointerEvents="none" style={styles.accentTwo} />
    <View style={styles.brandRow}><Pressable accessibilityLabel="Go back" onPress={() => router.back()} style={styles.back}><Ionicons color={colors.charcoal} name="chevron-back" size={20} /></Pressable><View style={styles.brand}><Text style={styles.brandHeart}>♡</Text><Text style={styles.brandCrave}>Crave</Text><Text style={styles.brandKeep}>Keep</Text></View><Text style={styles.percent}>{percent}%</Text></View>
    <Text style={styles.stepTitle}>{title}</Text><OnboardingProgress label="Your setup" percent={percent} />
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
  brandRow: { height: 52, flexDirection: 'row', alignItems: 'center' },
  back: { width: 40, height: 40, borderRadius: 20, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.paperRaised, alignItems: 'center', justifyContent: 'center' },
  brand: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  brandHeart: { color: colors.coral, fontSize: 24, fontWeight: '900', marginRight: 3 },
  brandCrave: { color: colors.coral, fontSize: 19, fontWeight: '900' },
  brandKeep: { color: colors.charcoal, fontSize: 19, fontWeight: '900' },
  percent: { width: 40, color: colors.coralDark, fontWeight: '900', textAlign: 'right' },
  stepTitle: { color: colors.charcoal, ...typography.title, fontSize: 27, lineHeight: 32, marginTop: spacing.sm, marginBottom: spacing.md, textAlign: 'center' },
  content: { gap: spacing.md, paddingVertical: spacing.lg, paddingBottom: spacing.xl },
  footer: { paddingVertical: spacing.sm },
  panel: { overflow: 'hidden', borderWidth: 1, borderColor: colors.line, borderRadius: radii.large, backgroundColor: colors.paperRaised, shadowColor: colors.charcoal, shadowOpacity: 0.07, shadowRadius: 16, shadowOffset: { width: 0, height: 6 }, elevation: 3 },
  row: { minHeight: 58, paddingHorizontal: spacing.md, flexDirection: 'row', alignItems: 'center', gap: 10, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.line },
  rowTitle: { flex: 1, color: colors.charcoal, ...typography.label }, value: { maxWidth: '42%', color: colors.muted, fontSize: 12 }, danger: { color: colors.coralDark }
});