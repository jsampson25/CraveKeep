import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Button, Screen } from '@/components/ui';
import { useRecipeStore } from '@/data/recipe-store';
import { colors, radii, spacing } from '@/theme';

export default function CookModeScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const recipe = useRecipeStore().findRecipe(id);
  const [stepIndex, setStepIndex] = useState(0);
  if (!recipe) return <Screen style={styles.center}><Text>Recipe not found.</Text><Button label="Close" onPress={() => router.back()} /></Screen>;
  const complete = stepIndex === recipe.steps.length - 1;
  return <Screen style={styles.screen}>
    <View style={styles.top}><Pressable accessibilityLabel="Exit Cook Mode" onPress={() => router.back()} style={styles.close}><Ionicons name="close" size={25} /></Pressable><Text style={styles.progress}>Step {stepIndex + 1} of {recipe.steps.length}</Text><View style={styles.awake}><Ionicons color={colors.herb} name="hand-left-outline" size={18} /><Text style={styles.awakeText}>Keep screen on</Text></View></View>
    <View accessibilityLabel={`Cooking progress: step ${stepIndex + 1} of ${recipe.steps.length}`} style={styles.progressTrack}><View style={[styles.progressFill, { width: `${((stepIndex + 1) / recipe.steps.length) * 100}%` }]} /></View>
    <View style={styles.content}><Text style={styles.recipe}>{recipe.title}</Text><Text accessibilityRole="header" style={styles.stepText}>{recipe.steps[stepIndex]}</Text><View style={styles.art}><Ionicons color={colors.coral} name="restaurant-outline" size={76} /></View><Text style={styles.tip}>Ingredients remain visible within each step when structured step links are added in the guided-cooking slice.</Text></View>
    <View style={styles.controls}><Button label="Previous" variant="secondary" disabled={stepIndex === 0} onPress={() => setStepIndex((current) => Math.max(0, current - 1))} /><View style={styles.controlFlex}><Button label={complete ? 'Finish cooking' : 'Next step'} onPress={() => complete ? router.back() : setStepIndex((current) => current + 1)} /></View></View>
  </Screen>;
}
const styles = StyleSheet.create({ screen: { padding: spacing.lg, gap: spacing.md }, top: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }, close: { width: 44, height: 44, borderRadius: 22, borderWidth: 1, borderColor: colors.line, alignItems: 'center', justifyContent: 'center' }, progress: { color: colors.charcoal, fontWeight: '800' }, awake: { alignItems: 'center' }, awakeText: { color: colors.herb, fontSize: 10, fontWeight: '700' }, progressTrack: { height: 5, backgroundColor: colors.line, borderRadius: radii.round, overflow: 'hidden' }, progressFill: { height: 5, backgroundColor: colors.coral }, content: { flex: 1, gap: spacing.lg, paddingTop: spacing.xl }, recipe: { color: colors.muted, fontWeight: '700' }, stepText: { color: colors.charcoal, fontFamily: 'Georgia', fontSize: 34, lineHeight: 43, fontWeight: '700' }, art: { flex: 1, minHeight: 180, borderRadius: radii.large, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.herbSoft }, tip: { color: colors.muted, lineHeight: 20 }, controls: { flexDirection: 'row', gap: spacing.sm }, controlFlex: { flex: 1 }, center: { justifyContent: 'center', padding: spacing.lg, gap: spacing.lg } });
