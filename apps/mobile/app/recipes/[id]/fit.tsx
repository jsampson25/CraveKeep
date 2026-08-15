import { fitRecipeToTargets, type MacroFitMode, type MacroTargets } from '@cravekeep/domain';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { MotionSlot } from '@/components/animations/MotionSlot';
import { Button, Card, Field, Screen, Title } from '@/components/ui';
import { useNutritionStore } from '@/data/nutrition-store';
import { useRecipeStore } from '@/data/recipe-store';
import { colors, radii, spacing } from '@/theme';

const modes: { value: MacroFitMode; label: string; detail: string }[] = [
  { value: 'preserve', label: 'Preserve Recipe', detail: 'Keep one original serving unchanged.' },
  { value: 'balanced', label: 'Balanced Fit', detail: 'Use a moderate portion adjustment.' },
  { value: 'exact', label: 'Exact Fit', detail: 'Search a wider portion range and show every gap.' }
];
const fields: { key: keyof MacroTargets; label: string; unit: string }[] = [
  { key: 'calories', label: 'Calories', unit: 'cal' }, { key: 'proteinGrams', label: 'Protein', unit: 'g' },
  { key: 'carbohydrateGrams', label: 'Carbohydrates', unit: 'g' }, { key: 'fatGrams', label: 'Fat', unit: 'g' }
];

export default function MacroFitScreen() {
  const { id } = useLocalSearchParams<{ id: string }>(); const { findRecipe } = useRecipeStore(); const { findEstimate } = useNutritionStore();
  const recipe = findRecipe(id); const estimate = findEstimate(id); const [mode, setMode] = useState<MacroFitMode>('preserve');
  const [values, setValues] = useState<Record<string, string>>({ calories: '', proteinGrams: '', carbohydrateGrams: '', fatGrams: '' });
  const targets = useMemo(() => Object.fromEntries(Object.entries(values).flatMap(([key, raw]) => { const amount = Number(raw); return raw.trim() && Number.isFinite(amount) && amount >= 0 ? [[key, amount]] : []; })) as MacroTargets, [values]);
  const result = useMemo(() => estimate && Object.keys(targets).length ? fitRecipeToTargets(estimate, targets, mode) : undefined, [estimate, mode, targets]);
  if (!recipe) return <Screen style={styles.center}><MotionSlot name="plan-my-week" size={88} accessibilityLabel="Animated meal fit" /><Title>Recipe unavailable</Title><Button label="Back to recipes" onPress={() => router.replace('/(tabs)/recipes')} /></Screen>;
  if (!estimate) return <Screen style={styles.center}><Title>Nutrition is needed first.</Title><Text style={styles.body}>Confirm ingredient matches before fitting this recipe to a target.</Text><Button label="Calculate nutrition" onPress={() => router.replace(`/recipes/${recipe.id}/nutrition`)} /></Screen>;
  return <Screen><ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.content}>
    <View style={styles.header}><Pressable accessibilityLabel="Go back" onPress={() => router.back()} style={styles.back}><Ionicons name="arrow-back" size={24} /></Pressable><Text style={styles.estimate}>Estimate · {estimate.confidence} confidence</Text></View>
    <Text style={styles.kicker}>FIT THIS RECIPE</Text><Title>Make {recipe.title} fit your day.</Title><Text style={styles.body}>Enter what remains for this meal or day. These are planning estimates, not medical guidance.</Text>
    <View style={styles.modes}>{modes.map((item) => <Pressable accessibilityRole="button" accessibilityState={{ selected: mode === item.value }} key={item.value} onPress={() => setMode(item.value)} style={[styles.mode, mode === item.value && styles.modeActive]}><Text style={[styles.modeTitle, mode === item.value && styles.modeTitleActive]}>{item.label}</Text><Text style={styles.body}>{item.detail}</Text></Pressable>)}</View>
    <Card style={styles.targets}><Text style={styles.cardTitle}>What do you have remaining?</Text>{fields.map((field) => <Field key={field.key} keyboardType="decimal-pad" label={`${field.label} (${field.unit})`} value={values[field.key] ?? ''} onChangeText={(value) => setValues((current) => ({ ...current, [field.key]: value }))} />)}</Card>
    {result ? <Card style={styles.result}><Text style={styles.cardTitle}>Plan preview</Text><Text style={styles.serving}>{result.servingFactor} recipe serving{result.servingFactor === 1 ? '' : 's'}</Text><Text style={styles.body}>{result.explanation}</Text><View style={styles.metrics}><Text style={styles.metric}>{result.fitted.calories} cal</Text><Text style={styles.metric}>{result.fitted.proteinGrams}g protein</Text><Text style={styles.metric}>{result.fitted.carbohydrateGrams}g carbs</Text><Text style={styles.metric}>{result.fitted.fatGrams}g fat</Text></View><Text style={styles.subheading}>Remaining after this recipe</Text>{fields.filter((field) => result.remaining[field.key] !== undefined).map((field) => <Text key={field.key} style={result.remaining[field.key]! < 0 ? styles.over : styles.remaining}>{field.label}: {result.remaining[field.key]} {field.unit}{result.remaining[field.key]! < 0 ? ' over target' : ' left'}</Text>)}{result.tradeoffs.map((tradeoff) => <Text key={tradeoff} style={styles.tradeoff}>• {tradeoff}</Text>)}</Card> : <Text style={styles.prompt}>Enter at least one target to preview a fit.</Text>}
    {mode !== 'preserve' ? <Button label="Open explicit recipe remix" variant="secondary" onPress={() => router.push(`/recipes/${recipe.id}/remix`)} /> : null}
  </ScrollView></Screen>;
}

const styles = StyleSheet.create({ content: { padding: spacing.lg, gap: spacing.md, paddingBottom: 60 }, center: { padding: spacing.lg, justifyContent: 'center', gap: spacing.md }, header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.sm }, back: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.paperRaised }, estimate: { color: colors.mint, fontWeight: '800', fontSize: 12 }, kicker: { color: colors.coralDark, fontWeight: '900', letterSpacing: 1.2 }, body: { color: colors.muted, lineHeight: 21 }, modes: { gap: spacing.sm }, mode: { padding: spacing.md, borderWidth: 1, borderColor: colors.line, borderRadius: radii.medium, backgroundColor: colors.paperRaised, gap: spacing.xs }, modeActive: { borderColor: colors.coral, backgroundColor: '#FFF0ED' }, modeTitle: { color: colors.charcoal, fontWeight: '900' }, modeTitleActive: { color: colors.coralDark }, targets: { gap: spacing.sm }, result: { gap: spacing.sm, backgroundColor: colors.mintSoft }, cardTitle: { color: colors.charcoal, fontSize: 17, fontWeight: '900' }, serving: { color: colors.mint, fontSize: 24, fontWeight: '900' }, metrics: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }, metric: { color: colors.charcoal, fontWeight: '800', backgroundColor: colors.paperRaised, padding: spacing.sm, borderRadius: radii.small }, subheading: { color: colors.charcoal, fontWeight: '900', marginTop: spacing.sm }, remaining: { color: colors.mint, fontWeight: '700' }, over: { color: colors.coralDark, fontWeight: '800' }, tradeoff: { color: colors.muted, lineHeight: 20 }, prompt: { color: colors.muted, textAlign: 'center', padding: spacing.md } });
