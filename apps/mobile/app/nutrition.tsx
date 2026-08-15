import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Card, Screen, SectionTitle, Title } from '@/components/ui';
import { usePlanningStore } from '@/data/planning-store';
import { colors, radii, spacing, typography } from '@/theme';

const nutrients = [
  { key: 'calories', label: 'Calories', value: 1650, target: 2000, unit: 'kcal', color: colors.coral, soft: '#FFF0ED' },
  { key: 'protein', label: 'Protein', value: 96, target: 140, unit: 'g', color: colors.mint, soft: colors.mintSoft },
  { key: 'carbs', label: 'Carbs', value: 142, target: 220, unit: 'g', color: colors.lemon, soft: colors.lemonSoft },
  { key: 'fat', label: 'Fat', value: 48, target: 70, unit: 'g', color: colors.lavender, soft: colors.lavenderSoft },
] as const;

export default function NutritionDashboardScreen() {
  const { targets } = usePlanningStore();
  const calorieTarget = targets?.calories ?? 2000;
  const proteinTarget = targets?.proteinGrams ?? 140;
  const cards = nutrients.map((item) => item.key === 'calories' ? { ...item, target: calorieTarget } : item.key === 'protein' ? { ...item, target: proteinTarget } : item);
  return <Screen><ScrollView contentContainerStyle={styles.content}>
    <View style={styles.header}><View><Text style={styles.eyebrow}>YOUR NUTRITION</Text><Title>See how your day is shaping up.</Title></View><View style={styles.icon}><Ionicons color={colors.white} name="nutrition-outline" size={25} /></View></View>
    <Card style={styles.snapshot}><Text style={styles.kicker}>TODAY'S SNAPSHOT</Text><Text style={styles.snapshotTitle}>{Math.round((cards[0]!.value / cards[0]!.target) * 100)}% of your calorie target</Text><Text style={styles.body}>Use this view to balance meals without losing sight of what you enjoy.</Text><View style={styles.snapshotBar}><View style={[styles.snapshotFill, { width: `${Math.min(100, Math.round((cards[0]!.value / cards[0]!.target) * 100))}%` }]} /></View></Card>
    <SectionTitle>Macro progress</SectionTitle><View style={styles.grid}>{cards.map((item) => { const percent = Math.min(100, Math.round((item.value / item.target) * 100)); return <View key={item.key} style={[styles.macro, { backgroundColor: item.soft }]}><Text style={styles.macroLabel}>{item.label}</Text><Text style={styles.macroValue}>{item.value}<Text style={styles.macroUnit}> {item.unit}</Text></Text><Text style={styles.target}>of {item.target} {item.unit}</Text><View style={styles.track}><View style={[styles.fill, { width: `${percent}%`, backgroundColor: item.color }]} /></View><Text style={styles.percent}>{percent}%</Text></View>; })}</View>
    <SectionTitle>Next actions</SectionTitle><Pressable accessibilityRole="button" onPress={() => router.push('/(tabs)/plan')} style={styles.action}><View style={[styles.actionIcon, { backgroundColor: colors.coral }]}><Ionicons color={colors.white} name="calendar-outline" size={22} /></View><View style={styles.flex}><Text style={styles.actionTitle}>Adjust your meal plan</Text><Text style={styles.body}>Balance tomorrow’s meals around your targets.</Text></View><Ionicons color={colors.muted} name="chevron-forward" size={20} /></Pressable><Pressable accessibilityRole="button" onPress={() => router.push('/(tabs)/recipes')} style={styles.action}><View style={[styles.actionIcon, { backgroundColor: colors.herb }]}><Ionicons color={colors.white} name="book-outline" size={22} /></View><View style={styles.flex}><Text style={styles.actionTitle}>Review recipe nutrition</Text><Text style={styles.body}>Check ingredient matches and confidence.</Text></View><Ionicons color={colors.muted} name="chevron-forward" size={20} /></Pressable><Text style={styles.note}><Ionicons color={colors.herb} name="information-circle-outline" size={15} /> Nutrition is an estimate until ingredients are reviewed.</Text>
  </ScrollView></Screen>;
}

const styles = StyleSheet.create({
  content: { padding: spacing.lg, gap: spacing.lg, paddingBottom: 110 }, header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.md }, eyebrow: { color: colors.coralDark, ...typography.label, letterSpacing: 1.1 }, icon: { width: 50, height: 50, borderRadius: 25, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.coral }, snapshot: { gap: spacing.sm, backgroundColor: colors.herbSoft }, kicker: { color: colors.herb, fontSize: 11, fontWeight: '900', letterSpacing: 1 }, snapshotTitle: { color: colors.charcoal, fontSize: 23, fontWeight: '900' }, body: { color: colors.muted, lineHeight: 20 }, snapshotBar: { height: 10, borderRadius: radii.round, backgroundColor: colors.white, overflow: 'hidden', marginTop: spacing.sm }, snapshotFill: { height: 10, borderRadius: radii.round, backgroundColor: colors.herb }, grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }, macro: { width: '48%', minHeight: 142, borderRadius: radii.medium, padding: spacing.md, gap: 5 }, macroLabel: { color: colors.charcoal, fontSize: 12, fontWeight: '900' }, macroValue: { color: colors.charcoal, fontSize: 24, fontWeight: '900', marginTop: 8 }, macroUnit: { color: colors.muted, fontSize: 11, fontWeight: '700' }, target: { color: colors.muted, fontSize: 11 }, track: { height: 6, borderRadius: radii.round, backgroundColor: colors.white, overflow: 'hidden', marginTop: 'auto' }, fill: { height: 6, borderRadius: radii.round }, percent: { color: colors.charcoal, fontSize: 11, fontWeight: '800' }, action: { minHeight: 74, flexDirection: 'row', alignItems: 'center', gap: spacing.md, padding: spacing.md, borderWidth: 1, borderColor: colors.line, borderRadius: radii.medium, backgroundColor: colors.paperRaised }, actionIcon: { width: 42, height: 42, borderRadius: 14, alignItems: 'center', justifyContent: 'center' }, flex: { flex: 1, gap: 3 }, actionTitle: { color: colors.charcoal, fontSize: 16, fontWeight: '900' }, note: { color: colors.muted, textAlign: 'center', fontSize: 12 }
});
