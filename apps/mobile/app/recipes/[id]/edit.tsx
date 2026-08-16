import { validateRecipeDraft, type Ingredient, type RecipeDraft } from '@cravekeep/domain';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Button, Field, Screen, Title } from '@/components/ui';
import { useRecipeStore } from '@/data/recipe-store';
import { colors, spacing } from '@/theme';

const toIngredients = (value: string): Ingredient[] => value.split('\n').map((line, index) => {
  const [quantity = '', ...name] = line.split('|');
  return { id: `ingredient_${index}`, quantity: quantity.trim(), name: name.join('|').trim() || quantity.trim() };
}).filter((item) => item.name);

export default function EditRecipeScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { findRecipe, updateRecipe } = useRecipeStore();
  const recipe = findRecipe(id);
  const editable = recipe?.source.kind === 'manual' && recipe.version === 1 && !recipe.originalRecipeId;
  const [title, setTitle] = useState(recipe?.title ?? '');
  const [description, setDescription] = useState(recipe?.description ?? '');
  const [servings, setServings] = useState(String(recipe?.servings ?? 4));
  const [prepMinutes, setPrepMinutes] = useState(String(recipe?.prepMinutes ?? 0));
  const [cookMinutes, setCookMinutes] = useState(String(recipe?.cookMinutes ?? 0));
  const [ingredients, setIngredients] = useState(recipe?.ingredients.map((item) => `${item.quantity} | ${item.name}`).join('\n') ?? '');
  const [steps, setSteps] = useState(recipe?.steps.join('\n') ?? '');
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string>();
  const draft = useMemo<RecipeDraft>(() => ({ title, description, servings: Number(servings), prepMinutes: Number(prepMinutes), cookMinutes: Number(cookMinutes), ingredients: toIngredients(ingredients), steps: steps.split('\n').map((step) => step.trim()).filter(Boolean) }), [cookMinutes, description, ingredients, prepMinutes, servings, steps, title]);
  const errors = submitted ? validateRecipeDraft(draft) : [];
  const message = (field: (typeof errors)[number]['field']) => errors.find((error) => error.field === field)?.message;
  if (!recipe || !editable) return <Screen style={styles.missing}><Title>This recipe stays preserved.</Title><Text style={styles.intro}>Imported recipes and saved versions are changed by creating a new version, never by overwriting their history.</Text><Button label="Go back" onPress={() => router.back()} /></Screen>;
  const save = async () => {
    setSubmitted(true);
    if (validateRecipeDraft(draft).length) return;
    setSaving(true); setSaveError(undefined);
    try { await updateRecipe({ ...recipe, ...draft, title: draft.title.trim(), description: draft.description.trim(), updatedAt: new Date().toISOString() }); router.back(); }
    catch (reason) { setSaveError(reason instanceof Error ? reason.message : 'Recipe changes could not be saved. Please try again.'); }
    finally { setSaving(false); }
  };
  return <Screen><KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.flex}><ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.content}>
    <View style={styles.header}><Pressable accessibilityLabel="Close recipe editor" onPress={() => router.back()}><Ionicons color={colors.charcoal} name="close" size={28} /></Pressable><Text style={styles.private}><Ionicons name="lock-closed" /> Private original</Text></View>
    <Title>Edit your recipe</Title><Text style={styles.intro}>Changes update the original you created. Imported recipes and remixes remain preserved as versions.</Text>
    <Field label="Recipe name" value={title} onChangeText={setTitle} error={message('title')} />
    <Field label="Description (optional)" value={description} onChangeText={setDescription} multiline />
    <View style={styles.row}><View style={styles.flex}><Field label="Servings" value={servings} onChangeText={setServings} keyboardType="number-pad" error={message('servings')} /></View><View style={styles.flex}><Field label="Prep min" value={prepMinutes} onChangeText={setPrepMinutes} keyboardType="number-pad" error={message('time')} /></View><View style={styles.flex}><Field label="Cook min" value={cookMinutes} onChangeText={setCookMinutes} keyboardType="number-pad" /></View></View>
    <Field label="Ingredients" value={ingredients} onChangeText={setIngredients} multiline numberOfLines={7} textAlignVertical="top" error={message('ingredients')} />
    <Text style={styles.hint}>Use one line per ingredient with a | between quantity and name.</Text>
    <Field label="Directions" value={steps} onChangeText={setSteps} multiline numberOfLines={8} textAlignVertical="top" error={message('steps')} />
    {saveError ? <Text accessibilityRole="alert" style={styles.error}>{saveError}</Text> : null}
    <Button disabled={saving} label={saving ? 'Saving…' : 'Save changes'} onPress={() => void save()} />
  </ScrollView></KeyboardAvoidingView></Screen>;
}

const styles = StyleSheet.create({ flex: { flex: 1 }, missing: { padding: spacing.lg, justifyContent: 'center', gap: spacing.lg }, content: { padding: spacing.lg, gap: spacing.md, paddingBottom: 60 }, header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }, private: { color: colors.herb, fontWeight: '700' }, intro: { color: colors.muted, lineHeight: 21 }, row: { flexDirection: 'row', gap: spacing.sm }, hint: { color: colors.muted, marginTop: -spacing.sm, fontSize: 12 }, error: { color: colors.coralDark, fontWeight: '700' } });
