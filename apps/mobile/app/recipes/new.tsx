import { createManualRecipe, validateRecipeDraft, type Ingredient, type RecipeDraft } from '@cravekeep/domain';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Button, Field, Screen, Title } from '@/components/ui';
import { useRecipeStore } from '@/data/recipe-store';
import { colors, spacing } from '@/theme';

const toIngredients = (value: string): Ingredient[] => value.split('\n').map((line, index) => {
  const [quantity = '', ...name] = line.split('|');
  return { id: `ingredient_${index}`, quantity: quantity.trim(), name: name.join('|').trim() || quantity.trim() };
}).filter((item) => item.name);

export default function NewRecipeScreen() {
  const { addRecipe } = useRecipeStore();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [servings, setServings] = useState('4');
  const [prepMinutes, setPrepMinutes] = useState('10');
  const [cookMinutes, setCookMinutes] = useState('20');
  const [ingredients, setIngredients] = useState('');
  const [steps, setSteps] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);

  const draft = useMemo<RecipeDraft>(() => ({ title, description, servings: Number(servings), prepMinutes: Number(prepMinutes), cookMinutes: Number(cookMinutes), ingredients: toIngredients(ingredients), steps: steps.split('\n').filter(Boolean) }), [cookMinutes, description, ingredients, prepMinutes, servings, steps, title]);
  const errors = submitted ? validateRecipeDraft(draft) : [];
  const message = (field: (typeof errors)[number]['field']) => errors.find((error) => error.field === field)?.message;

  const save = async () => {
    setSubmitted(true);
    if (validateRecipeDraft(draft).length) return;
    setSaving(true);
    const recipe = createManualRecipe(draft);
    await addRecipe(recipe);
    router.replace(`/recipes/${recipe.id}`);
  };

  return <Screen><KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.flex}><ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.content}>
    <View style={styles.header}><Pressable accessibilityLabel="Close recipe editor" onPress={() => router.back()}><Ionicons color={colors.charcoal} name="close" size={28} /></Pressable><Text style={styles.private}><Ionicons name="lock-closed" /> Private original</Text></View>
    <Title>Create a recipe</Title><Text style={styles.intro}>Drafts in capture workflows will be recoverable. For this first manual slice, save when the recipe is ready.</Text>
    <Field label="Recipe name" value={title} onChangeText={setTitle} placeholder="Grandma's blueberry muffins" error={message('title')} />
    <Field label="Description (optional)" value={description} onChangeText={setDescription} placeholder="What makes this worth keeping?" multiline />
    <View style={styles.row}><View style={styles.flex}><Field label="Servings" value={servings} onChangeText={setServings} keyboardType="number-pad" error={message('servings')} /></View><View style={styles.flex}><Field label="Prep min" value={prepMinutes} onChangeText={setPrepMinutes} keyboardType="number-pad" error={message('time')} /></View><View style={styles.flex}><Field label="Cook min" value={cookMinutes} onChangeText={setCookMinutes} keyboardType="number-pad" /></View></View>
    <Field label="Ingredients" value={ingredients} onChangeText={setIngredients} placeholder={'2 | chicken breasts\n1 tbsp | olive oil\n1 | lemon'} multiline numberOfLines={7} textAlignVertical="top" error={message('ingredients')} />
    <Text style={styles.hint}>Use one line per ingredient. Put a | between quantity and ingredient.</Text>
    <Field label="Directions" value={steps} onChangeText={setSteps} placeholder={'Season the chicken.\nSear until golden.\nRest for five minutes.'} multiline numberOfLines={8} textAlignVertical="top" error={message('steps')} />
    <Button label={saving ? 'Saving…' : 'Save original'} onPress={save} disabled={saving} />
  </ScrollView></KeyboardAvoidingView></Screen>;
}
const styles = StyleSheet.create({ flex: { flex: 1 }, content: { padding: spacing.lg, gap: spacing.md, paddingBottom: 60 }, header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }, private: { color: colors.herb, fontWeight: '700' }, intro: { color: colors.muted, lineHeight: 21 }, row: { flexDirection: 'row', gap: spacing.sm }, hint: { color: colors.muted, marginTop: -spacing.sm, fontSize: 12 } });
