import { SAMPLE_RECIPE } from '@cravekeep/domain';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MotionSlot } from '@/components/animations/MotionSlot';
import { Button } from '@/components/ui';
import { useGroceryStore } from '@/data/grocery-store';
import { useOnboardingStore } from '@/data/onboarding-store';
import { usePlanningStore } from '@/data/planning-store';
import { useRecipeStore } from '@/data/recipe-store';
import { colors, radii, spacing, typography } from '@/theme';

export default function KitchenSetupScreen() {
  const { profile } = useOnboardingStore();
  const { recipes, addRecipe } = useRecipeStore();
  const { meals } = usePlanningStore();
  const { items } = useGroceryStore();
  const [busy, setBusy] = useState(false);
  const firstName = profile.displayName.trim().split(/\s+/)[0] || 'there';
  const tasks = [
    { complete: recipes.length > 0, icon: 'document-text-outline', title: 'Save your first recipe', detail: 'Capture a recipe from any website or app.', action: 'Capture a recipe', route: '/capture' },
    { complete: meals.length > 0, icon: 'calendar-outline', title: 'Plan your first meal', detail: 'Build your first meal plan in just a few taps.', action: 'Start planning', route: '/(tabs)/plan' },
    { complete: items.length > 0, icon: 'basket-outline', title: 'Build a grocery list', detail: 'Create a list from a recipe or start fresh.', action: 'Create a list', route: '/(tabs)/groceries' },
  ] as const;
  const completed = tasks.filter(task => task.complete).length;
  const progress = Math.round((completed / tasks.length) * 100);

  const addSample = async () => {
    setBusy(true);
    try {
      if (!recipes.some(recipe => recipe.id === SAMPLE_RECIPE.id)) await addRecipe(SAMPLE_RECIPE);
      router.replace('/(tabs)/home');
    } finally { setBusy(false); }
  };

  return <SafeAreaView edges={['top', 'bottom']} style={styles.screen}>
    <ScrollView contentContainerStyle={styles.content}>
      <View style={styles.topRow}><Pressable accessibilityLabel="Open notifications" onPress={() => router.push('/notifications')} style={styles.iconButton}><Ionicons color={colors.charcoal} name="notifications-outline" size={20} /></Pressable><Pressable onPress={() => router.replace('/(tabs)/home')}><Text style={styles.skip}>Go to Home</Text></Pressable></View>
      <View style={styles.hero}>
        <View style={styles.heroCopy}><Text style={styles.heroTitle}>Welcome to your</Text><Text style={styles.heroTitle}>kitchen, <Text style={styles.accent}>{firstName}</Text></Text><Text style={styles.heroBody}>Let’s make CraveKeep yours.</Text></View>
        <MotionSlot name="onboarding-preferences" size={148} accessibilityLabel="CraveKeep mascot welcoming you to your kitchen" />
      </View>

      <View style={styles.progressCard}>
        <View style={styles.progressHeader}><View><Text style={styles.progressTitle}>Make CraveKeep yours</Text><Text style={styles.progressCount}>{completed} of {tasks.length} completed</Text></View><Text style={styles.progressPercent}>{progress}%</Text></View>
        <View accessibilityRole="progressbar" accessibilityValue={{ min: 0, max: 100, now: progress }} style={styles.track}><View style={[styles.fill, { width: progress + '%' }]} /></View>
      </View>

      <View style={styles.tasks}>{tasks.map(task => <View key={task.title} style={styles.task}>
        <View style={[styles.taskIcon, task.complete && styles.taskIconComplete]}><Ionicons color={task.complete ? colors.white : colors.herb} name={task.complete ? 'checkmark' : task.icon} size={21} /></View>
        <View style={styles.taskCopy}><Text style={styles.taskTitle}>{task.title}</Text><Text style={styles.taskDetail}>{task.detail}</Text></View>
        <Pressable accessibilityRole="button" onPress={() => router.push(task.route)} style={[styles.taskButton, task.complete && styles.doneButton]}><Text style={[styles.taskButtonText, task.complete && styles.doneText]}>{task.complete ? 'Done' : task.action}</Text></Pressable>
      </View>)}</View>

      <Pressable accessibilityRole="button" disabled={busy} onPress={() => void addSample()} style={styles.sample}>
        <View style={styles.sampleArt}><Ionicons color={colors.coralDark} name="restaurant" size={24} /></View>
        <View style={styles.taskCopy}><Text style={styles.taskTitle}>Try it with a sample recipe</Text><Text style={styles.taskDetail}>Explore a CraveKeep starter to see how it works.</Text></View>
        <Ionicons color={colors.charcoal} name="chevron-forward" size={20} />
      </Pressable>
    </ScrollView>
    <View style={styles.footer}><Button label={completed === tasks.length ? 'Open my Home' : 'Continue to Home'} onPress={() => router.replace('/(tabs)/home')} /></View>
  </SafeAreaView>;
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: spacing.lg, paddingBottom: 110, gap: spacing.md },
  topRow: { minHeight: 48, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  iconButton: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.line, backgroundColor: colors.paperRaised },
  skip: { color: colors.coralDark, fontWeight: '800' },
  hero: { minHeight: 184, flexDirection: 'row', alignItems: 'center', overflow: 'hidden', borderRadius: radii.large, backgroundColor: '#FFF8EE' },
  heroCopy: { flex: 1, paddingLeft: spacing.md }, heroTitle: { color: colors.charcoal, ...typography.title, fontSize: 26, lineHeight: 30 }, accent: { color: colors.coralDark }, heroBody: { marginTop: 8, color: colors.muted },
  progressCard: { padding: spacing.md, gap: 10, borderWidth: 1, borderColor: colors.line, borderRadius: radii.medium, backgroundColor: colors.paperRaised },
  progressHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }, progressTitle: { color: colors.charcoal, fontWeight: '900' }, progressCount: { marginTop: 3, color: colors.muted, fontSize: 11 }, progressPercent: { color: colors.coralDark, fontSize: 18, fontWeight: '900' },
  track: { height: 8, overflow: 'hidden', borderRadius: radii.round, backgroundColor: colors.line }, fill: { height: 8, borderRadius: radii.round, backgroundColor: colors.coral },
  tasks: { gap: spacing.sm }, task: { minHeight: 82, padding: 10, flexDirection: 'row', alignItems: 'center', gap: 10, borderWidth: 1, borderColor: colors.line, borderRadius: radii.medium, backgroundColor: colors.paperRaised },
  taskIcon: { width: 42, height: 42, borderRadius: 13, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.herbSoft }, taskIconComplete: { backgroundColor: colors.herb },
  taskCopy: { flex: 1 }, taskTitle: { color: colors.charcoal, fontSize: 13, fontWeight: '900' }, taskDetail: { marginTop: 3, color: colors.muted, fontSize: 10, lineHeight: 14 },
  taskButton: { minWidth: 96, minHeight: 38, paddingHorizontal: 10, alignItems: 'center', justifyContent: 'center', borderRadius: radii.small, backgroundColor: colors.coral },
  taskButtonText: { color: colors.white, fontSize: 10, fontWeight: '900' }, doneButton: { backgroundColor: colors.herbSoft }, doneText: { color: colors.herb },
  sample: { minHeight: 76, padding: 10, flexDirection: 'row', alignItems: 'center', gap: 10, borderWidth: 1, borderColor: colors.line, borderRadius: radii.medium, backgroundColor: '#FFF8EE' },
  sampleArt: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.lemonSoft },
  footer: { paddingHorizontal: spacing.lg, paddingVertical: spacing.sm, borderTopWidth: 1, borderTopColor: colors.line, backgroundColor: colors.background }
});
