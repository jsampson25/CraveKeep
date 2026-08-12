import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Button, Card, Field, Screen, Title } from '@/components/ui';
import { useAuthStore } from '@/data/auth-store';
import { saveCookSession, type CookSession } from '@/data/cook-sessions';
import { useRecipeStore } from '@/data/recipe-store';
import { colors, radii, spacing } from '@/theme';

const efforts: { value: CookSession['effort']; label: string }[] = [{ value: 'easy', label: 'Easier' }, { value: 'expected', label: 'As expected' }, { value: 'hard', label: 'Harder' }];

export default function FinishedCookingScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const recipe = useRecipeStore().findRecipe(id);
  const { user } = useAuthStore();
  const [taste, setTaste] = useState(0);
  const [effort, setEffort] = useState<CookSession['effort']>();
  const [repeatIntent, setRepeatIntent] = useState<boolean>();
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string>();
  if (!recipe) return <Screen style={styles.center}><Title>Recipe not found</Title><Button label="Back to recipes" onPress={() => router.replace('/(tabs)/recipes')} /></Screen>;
  const save = async () => {
    if (!taste || !effort || repeatIntent === undefined) { setMessage('Answer the three quick questions before saving.'); return; }
    setSaving(true); setMessage(undefined);
    const cookedAt = new Date().toISOString();
    try {
      await saveCookSession({ id: `cook_${cookedAt}_${Math.random().toString(36).slice(2, 8)}`, recipeId: recipe.id, taste, effort, repeatIntent, notes: notes.trim(), cookedAt }, user?.id);
      router.replace(`/recipes/${recipe.id}`);
    } catch {
      setMessage('Your result is saved on this device, but cloud sync could not finish.');
      setSaving(false);
    }
  };
  return <Screen><ScrollView contentContainerStyle={styles.content}>
    <View style={styles.hero}><View style={styles.done}><Ionicons color={colors.white} name="checkmark" size={40} /></View><Title>You made {recipe.title}.</Title><Text style={styles.body}>Three quick answers help CraveKeep learn what works in your kitchen. This stays private.</Text></View>
    <Card style={styles.card}><Text style={styles.question}>How did it taste?</Text><View accessibilityRole="radiogroup" style={styles.row}>{[1, 2, 3, 4, 5].map((value) => <Pressable accessibilityLabel={`${value} out of 5`} accessibilityRole="radio" accessibilityState={{ checked: taste === value }} key={value} onPress={() => setTaste(value)} style={[styles.score, taste === value && styles.selected]}><Text style={[styles.scoreText, taste === value && styles.selectedText]}>{value}</Text></Pressable>)}</View></Card>
    <Card style={styles.card}><Text style={styles.question}>How was the effort?</Text><View accessibilityRole="radiogroup" style={styles.row}>{efforts.map((item) => <Pressable accessibilityRole="radio" accessibilityState={{ checked: effort === item.value }} key={item.value} onPress={() => setEffort(item.value)} style={[styles.choice, effort === item.value && styles.selected]}><Text style={[styles.choiceText, effort === item.value && styles.selectedText]}>{item.label}</Text></Pressable>)}</View></Card>
    <Card style={styles.card}><Text style={styles.question}>Would you make it again?</Text><View accessibilityRole="radiogroup" style={styles.row}>{[{ value: true, label: 'Yes' }, { value: false, label: 'Not yet' }].map((item) => <Pressable accessibilityRole="radio" accessibilityState={{ checked: repeatIntent === item.value }} key={item.label} onPress={() => setRepeatIntent(item.value)} style={[styles.choice, repeatIntent === item.value && styles.selected]}><Text style={[styles.choiceText, repeatIntent === item.value && styles.selectedText]}>{item.label}</Text></Pressable>)}</View></Card>
    <Field label="Private notes (optional)" multiline numberOfLines={4} onChangeText={setNotes} placeholder="What would you change next time?" textAlignVertical="top" value={notes} />
    {message ? <Text accessibilityRole="alert" style={styles.error}>{message}</Text> : null}
    <Button disabled={saving} label={saving ? 'Saving…' : 'Save cooking result'} onPress={() => void save()} />
    <Button label="Skip for now" onPress={() => router.replace(`/recipes/${recipe.id}`)} variant="quiet" />
  </ScrollView></Screen>;
}

const styles = StyleSheet.create({ content: { padding: spacing.lg, gap: spacing.md, paddingBottom: 60 }, center: { padding: spacing.lg, justifyContent: 'center', gap: spacing.lg }, hero: { alignItems: 'center', gap: spacing.md }, done: { width: 76, height: 76, borderRadius: 38, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.herb }, body: { color: colors.muted, lineHeight: 22, textAlign: 'center' }, card: { gap: spacing.md }, question: { color: colors.charcoal, fontSize: 18, fontWeight: '800' }, row: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }, score: { width: 46, height: 46, borderRadius: 23, borderWidth: 1, borderColor: colors.line, alignItems: 'center', justifyContent: 'center' }, scoreText: { color: colors.charcoal, fontWeight: '800' }, choice: { minHeight: 44, paddingHorizontal: 15, borderRadius: radii.round, borderWidth: 1, borderColor: colors.line, alignItems: 'center', justifyContent: 'center' }, choiceText: { color: colors.charcoal, fontWeight: '700' }, selected: { backgroundColor: colors.coral, borderColor: colors.coral }, selectedText: { color: colors.white }, error: { color: colors.coralDark, fontWeight: '700' } });
