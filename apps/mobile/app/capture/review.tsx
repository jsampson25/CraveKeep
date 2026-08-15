import { createImportedRecipe, validateRecipeDraft, type Ingredient, type RecipeDraft } from '@cravekeep/domain';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { Image, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { MotionSlot } from '@/components/animations/MotionSlot';
import { Button, Card, Field, Screen, Title } from '@/components/ui';
import { useImportStore } from '@/data/import-store';
import { useRecipeStore } from '@/data/recipe-store';
import { colors, radii, spacing } from '@/theme';

const serializeIngredients = (ingredients: Ingredient[]) => ingredients.map((item) => `${item.quantity} | ${item.name}`).join('\n');
const parseIngredients = (value: string): Ingredient[] => value.split('\n').map((line, index) => { const [quantity = '', ...name] = line.split('|'); return { id: `review_i${index}`, quantity: quantity.trim(), name: name.join('|').trim() || quantity.trim() }; }).filter((item) => item.name);

export default function RecipeReviewScreen() {
  const { jobId } = useLocalSearchParams<{ jobId: string }>();
  const { findJob, updateJob } = useImportStore();
  const { addRecipe } = useRecipeStore();
  const job = findJob(jobId);
  const initial = job?.draft;
  const [title, setTitle] = useState(initial?.title ?? '');
  const [servings, setServings] = useState(String(initial?.servings ?? 1));
  const [ingredients, setIngredients] = useState(serializeIngredients(initial?.ingredients ?? []));
  const [steps, setSteps] = useState(initial?.steps.join('\n') ?? '');
  const [submitted, setSubmitted] = useState(false);
  const draft = useMemo<RecipeDraft>(() => ({ title, description: initial?.description ?? '', servings: Number(servings), prepMinutes: initial?.prepMinutes ?? 0, cookMinutes: initial?.cookMinutes ?? 0, ingredients: parseIngredients(ingredients), steps: steps.split('\n').map((item) => item.trim()).filter(Boolean) }), [ingredients, initial, servings, steps, title]);
  const errors = submitted ? validateRecipeDraft(draft) : [];
  const errorFor = (field: (typeof errors)[number]['field']) => errors.find((error) => error.field === field)?.message;
  if (!job) return <Screen style={styles.center}><MotionSlot name="recipe-import-success" size={84} accessibilityLabel="Animated recipe capture state" /><Title>Import unavailable</Title><Button label="View imports" onPress={() => router.replace('/imports')} /></Screen>;
  const save = async () => { setSubmitted(true); if (validateRecipeDraft(draft).length) return; const recipe = createImportedRecipe(draft, { url: job.source.url, label: job.source.host, creator: job.source.creator }); const saved = await addRecipe(recipe); await updateJob(job.id, { status: 'completed', recipeId: saved.id, recoveryCode: undefined }); router.replace(`/recipes/${saved.id}`); };
  return <Screen><KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.flex}><ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.content}>
    <View style={styles.header}><Pressable accessibilityLabel="Close review" onPress={() => router.replace('/imports')}><Ionicons name="close" size={27} /></Pressable><Text style={styles.private}><Ionicons name="lock-closed" /> Private import</Text></View><Text style={styles.kicker}>RECIPE REVIEW</Text><Title>Check the details.</Title>
    <Card><Text style={styles.sourceLabel}>ORIGINAL SOURCE</Text><Text style={styles.source}>{job.source.host}</Text>{job.source.url ? <Text numberOfLines={2} style={styles.url}>{job.source.url}</Text> : <Text style={styles.url}>{job.source.storagePath ? 'Private cloud image attached' : 'Image kept on this device'}</Text>}</Card>
    {job.source.localUri ? <Image accessibilityLabel="Captured recipe reference" resizeMode="contain" source={{ uri: job.source.localUri }} style={styles.referenceImage} /> : null}
    {job.warnings.map((warning) => <View accessibilityRole="alert" key={warning} style={styles.warning}><Ionicons color={colors.citrus} name="alert-circle" size={22} /><Text style={styles.warningText}>{warning}</Text></View>)}
    <Field label="Recipe name" value={title} onChangeText={setTitle} error={errorFor('title')} />
    <Field label="Servings" keyboardType="number-pad" value={servings} onChangeText={setServings} error={errorFor('servings')} />
    <Field label="Ingredients" multiline numberOfLines={7} textAlignVertical="top" placeholder={'2 | chicken breasts\n1 tbsp | olive oil'} value={ingredients} onChangeText={setIngredients} error={errorFor('ingredients')} />
    <Field label="Directions" multiline numberOfLines={8} textAlignVertical="top" placeholder={'Season the chicken.\nCook until safely done.'} value={steps} onChangeText={setSteps} error={errorFor('steps')} />
    <Button label="Save original" onPress={save} /><Button label="Keep for later" variant="secondary" onPress={() => router.replace('/imports')} />
  </ScrollView></KeyboardAvoidingView></Screen>;
}
const styles = StyleSheet.create({ flex: { flex: 1 }, content: { padding: spacing.lg, gap: spacing.md, paddingBottom: 60 }, center: { padding: spacing.lg, justifyContent: 'center', gap: spacing.lg }, header: { flexDirection: 'row', justifyContent: 'space-between' }, private: { color: colors.herb, fontWeight: '800' }, kicker: { color: colors.coralDark, fontWeight: '900', letterSpacing: 1.2 }, sourceLabel: { color: colors.coralDark, fontSize: 11, fontWeight: '900', letterSpacing: 1 }, source: { color: colors.charcoal, fontSize: 18, fontWeight: '800' }, url: { color: colors.muted }, referenceImage: { width: '100%', height: 260, borderRadius: radii.medium, backgroundColor: colors.paperRaised }, warning: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm, padding: spacing.md, borderRadius: radii.medium, borderWidth: 1, borderColor: colors.citrus, backgroundColor: '#FFF8E5' }, warningText: { flex: 1, color: colors.charcoal, lineHeight: 20 } });
