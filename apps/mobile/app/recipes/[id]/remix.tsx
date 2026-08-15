import { compareRecipeVersions, createRecipeVersion, validateRecipeDraft, type AdaptationGoal, type Ingredient, type RecipeDraft, type TasteProtection } from '@cravekeep/domain';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { MotionSlot } from '@/components/animations/MotionSlot';
import { Button, Card, Field, Screen, Title } from '@/components/ui';
import { useRecipeStore } from '@/data/recipe-store';
import { colors, radii, spacing } from '@/theme';

const goals: { value: AdaptationGoal; label: string }[] = [
  { value: 'healthier_overall', label: 'Healthier overall' },
  { value: 'higher_protein', label: 'Higher protein' },
  { value: 'lower_calorie', label: 'Lower calorie' },
  { value: 'lower_sodium', label: 'Lower sodium' }
];
const tasteOptions: { value: TasteProtection; label: string }[] = [
  { value: 'nearly_identical', label: 'Nearly identical' },
  { value: 'balanced', label: 'Balanced' },
  { value: 'maximum_change', label: 'Maximum change' }
];
const serializeIngredients = (items: Ingredient[]) => items.map((item) => `${item.quantity} | ${item.name}`).join('\n');
const parseIngredients = (value: string): Ingredient[] => value.split('\n').map((line, index) => { const [quantity = '', ...name] = line.split('|'); return { id: `remix_i${index}`, quantity: quantity.trim(), name: name.join('|').trim() || quantity.trim() }; }).filter((item) => item.name);

export default function RemixRecipeScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { findRecipe, addRecipe } = useRecipeStore();
  const original = findRecipe(id);
  const [goal, setGoal] = useState<AdaptationGoal>('healthier_overall');
  const [tasteProtection, setTasteProtection] = useState<TasteProtection>('balanced');
  const [title, setTitle] = useState(original ? `${original.title} remix` : '');
  const [ingredients, setIngredients] = useState(original ? serializeIngredients(original.ingredients) : '');
  const [steps, setSteps] = useState(original?.steps.join('\n') ?? '');
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);
  const draft = useMemo<RecipeDraft>(() => ({ title, description: original?.description ?? '', servings: original?.servings ?? 1, prepMinutes: original?.prepMinutes ?? 0, cookMinutes: original?.cookMinutes ?? 0, ingredients: parseIngredients(ingredients), steps: steps.split('\n').map((step) => step.trim()).filter(Boolean) }), [ingredients, original, steps, title]);
  const comparison = useMemo(() => original ? compareRecipeVersions(original, draft) : null, [draft, original]);
  const errors = submitted ? validateRecipeDraft(draft) : [];
  if (!original) return <Screen style={styles.missing}><MotionSlot name="saved-success" size={82} accessibilityLabel="Animated healthier recipe transformation" /><Title>Recipe unavailable</Title><Button label="Back to recipes" onPress={() => router.replace('/(tabs)/recipes')} /></Screen>;

  const save = async () => {
    setSubmitted(true);
    if (validateRecipeDraft(draft).length) return;
    setSaving(true);
    const version = createRecipeVersion(original, draft, { goal, tasteProtection });
    const saved = await addRecipe(version);
    router.replace(`/recipes/${saved.id}`);
  };
  const hasChanges = Boolean(comparison && (comparison.addedIngredients.length || comparison.removedIngredients.length || comparison.changedQuantities.length || comparison.stepsChanged || title.trim() !== original.title));

  return <Screen><KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.flex}><ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.content}>
    <View style={styles.header}><Pressable accessibilityLabel="Close remix" onPress={() => router.back()}><Ionicons name="close" size={28} /></Pressable><Text style={styles.private}><Ionicons name="lock-closed" /> Private version</Text></View>
    <Text style={styles.kicker}>CREATE VERSION {original.version + 1}</Text><Title>Change it without losing the original.</Title><Text style={styles.body}>CraveKeep records exactly what you edit. Nutrition and taste effects are not estimated until trusted providers are connected.</Text>
    <Text style={styles.label}>Goal</Text><View style={styles.options}>{goals.map((option) => <Pressable accessibilityRole="button" accessibilityState={{ selected: goal === option.value }} key={option.value} onPress={() => setGoal(option.value)} style={[styles.option, goal === option.value && styles.optionActive]}><Text style={[styles.optionText, goal === option.value && styles.optionTextActive]}>{option.label}</Text></Pressable>)}</View>
    <Text style={styles.label}>Taste Protection</Text><View style={styles.options}>{tasteOptions.map((option) => <Pressable accessibilityRole="button" accessibilityState={{ selected: tasteProtection === option.value }} key={option.value} onPress={() => setTasteProtection(option.value)} style={[styles.option, tasteProtection === option.value && styles.optionActive]}><Text style={[styles.optionText, tasteProtection === option.value && styles.optionTextActive]}>{option.label}</Text></Pressable>)}</View>
    <Field label="Version name" value={title} onChangeText={setTitle} error={errors.find((error) => error.field === 'title')?.message} />
    <View style={styles.fieldHeader}><Text style={styles.label}>Ingredients</Text><Pressable onPress={() => setIngredients(serializeIngredients(original.ingredients))}><Text style={styles.reset}>Undo ingredient changes</Text></Pressable></View><Field label="One ingredient per line" multiline numberOfLines={8} textAlignVertical="top" value={ingredients} onChangeText={setIngredients} error={errors.find((error) => error.field === 'ingredients')?.message} />
    <View style={styles.fieldHeader}><Text style={styles.label}>Directions</Text><Pressable onPress={() => setSteps(original.steps.join('\n'))}><Text style={styles.reset}>Undo direction changes</Text></Pressable></View><Field label="One step per line" multiline numberOfLines={8} textAlignVertical="top" value={steps} onChangeText={setSteps} error={errors.find((error) => error.field === 'steps')?.message} />
    <Card style={styles.comparison}><Text style={styles.cardTitle}>Compared with {original.title}</Text>{!hasChanges ? <Text style={styles.body}>No recipe changes yet.</Text> : <>{comparison?.addedIngredients.map((name) => <Text key={`add-${name}`} style={styles.change}>+ Added {name}</Text>)}{comparison?.removedIngredients.map((name) => <Text key={`remove-${name}`} style={styles.change}>âˆ’ Removed {name}</Text>)}{comparison?.changedQuantities.map((item) => <Text key={`quantity-${item.name}`} style={styles.change}>â†’ {item.name}: {item.before || 'none'} to {item.after || 'none'}</Text>)}{comparison?.stepsChanged ? <Text style={styles.change}>â†’ Directions changed</Text> : null}</>}</Card>
    <Button disabled={saving || !hasChanges} label={saving ? 'Saving versionâ€¦' : 'Save as new version'} onPress={() => void save()} />
  </ScrollView></KeyboardAvoidingView></Screen>;
}

const styles = StyleSheet.create({ flex: { flex: 1 }, content: { padding: spacing.lg, gap: spacing.md, paddingBottom: 60 }, missing: { padding: spacing.lg, justifyContent: 'center', gap: spacing.md }, header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }, private: { color: colors.mint, fontWeight: '800' }, kicker: { color: colors.coralDark, fontWeight: '900', letterSpacing: 1.2 }, body: { color: colors.muted, lineHeight: 21 }, label: { color: colors.charcoal, fontWeight: '800' }, options: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }, option: { paddingHorizontal: spacing.md, paddingVertical: 10, borderWidth: 1, borderColor: colors.line, borderRadius: radii.round, backgroundColor: colors.paperRaised }, optionActive: { backgroundColor: colors.coral, borderColor: colors.coral }, optionText: { color: colors.charcoal, fontWeight: '700' }, optionTextActive: { color: colors.white }, fieldHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.sm }, reset: { color: colors.coralDark, fontSize: 12, fontWeight: '800' }, comparison: { gap: spacing.sm, backgroundColor: colors.mintSoft }, cardTitle: { color: colors.charcoal, fontSize: 17, fontWeight: '900' }, change: { color: colors.charcoal, lineHeight: 20 } });
