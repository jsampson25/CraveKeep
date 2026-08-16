import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { MotionSlot } from '@/components/animations/MotionSlot';
import { Button, Card, Screen, Title } from '@/components/ui';
import { useRecipeStore } from '@/data/recipe-store';
import { colors, radii, spacing, typography } from '@/theme';

const chapters = [
  { title: 'Get everything ready', time: '0:00', color: colors.coral },
  { title: 'Prep the ingredients', time: '0:42', color: colors.mint },
  { title: 'Cook the main components', time: '1:28', color: colors.lemon },
  { title: 'Finish, plate, and serve', time: '2:36', color: colors.lavender },
];

export default function RecipeVideoScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { findRecipe } = useRecipeStore();
  const recipe = findRecipe(id);

  if (!recipe) {
    return (
      <Screen style={styles.missing}>
        <Title>Recipe not found</Title>
        <Button label="Back to recipes" onPress={() => router.replace('/(tabs)/recipes')} />
      </Screen>
    );
  }

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Pressable accessibilityLabel="Go back" onPress={() => router.back()} style={styles.circle}>
            <Ionicons name="arrow-back" size={22} color={colors.charcoal} />
          </Pressable>
          <Text style={styles.headerTitle}>Recipe video</Text>
          <View style={styles.circle} />
        </View>

        <View style={styles.player}>
          <MotionSlot name="onboarding-recipe-card" size={130} accessibilityLabel="Animated recipe card preview" />
          <View style={styles.playButton}>
            <Ionicons name="play" size={28} color={colors.white} />
          </View>
          <Text style={styles.playerLabel}>CraveKeep Kitchen</Text>
        </View>

        <View style={styles.titleBlock}>
          <Text style={styles.eyebrow}>WATCH & COOK</Text>
          <Title>{recipe.title}</Title>
          <Text style={styles.body}>{recipe.description}</Text>
        </View>

        <Card style={styles.progressCard}>
          <View style={styles.progressTop}>
            <Text style={styles.progressLabel}>YOUR PROGRESS</Text>
            <Text style={styles.progressValue}>0:00 / 3:18</Text>
          </View>
          <View style={styles.progressTrack}><View style={styles.progressFill} /></View>
          <View style={styles.controls}>
            <Ionicons name="play-skip-back" size={18} color={colors.charcoal} />
            <Ionicons name="play" size={18} color={colors.coralDark} />
            <Ionicons name="play-skip-forward" size={18} color={colors.charcoal} />
            <View style={styles.controlSpacer} />
            <Ionicons name="speedometer-outline" size={18} color={colors.charcoal} />
            <Ionicons name="expand-outline" size={18} color={colors.charcoal} />
          </View>
        </Card>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Video chapters</Text>
          <Text style={styles.sectionMeta}>{chapters.length} steps</Text>
        </View>

        {chapters.map((chapter, index) => (
          <Pressable key={chapter.title} accessibilityRole="button" style={styles.chapter}>
            <View style={[styles.chapterNumber, { backgroundColor: chapter.color }]}><Text style={styles.chapterNumberText}>{index + 1}</Text></View>
            <View style={styles.chapterCopy}><Text style={styles.chapterTitle}>{chapter.title}</Text><Text style={styles.chapterTime}>{chapter.time}</Text></View>
            <Ionicons name="chevron-forward" size={18} color={colors.muted} />
          </Pressable>
        ))}

        <Button label="Start cooking mode" onPress={() => router.push('/cook/' + recipe.id)} />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { padding: spacing.lg, gap: spacing.md, paddingBottom: 56 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  headerTitle: { ...typography.label, color: colors.charcoal, fontSize: 16 },
  circle: { width: 42, height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.paperRaised, borderWidth: 1, borderColor: colors.line },
  player: { height: 280, borderRadius: radii.large, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.charcoal, overflow: 'hidden' },
  playButton: { width: 68, height: 68, borderRadius: 34, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.coral, marginTop: -4 },
  playerLabel: { color: colors.white, fontWeight: '800', marginTop: spacing.sm },
  titleBlock: { gap: spacing.xs },
  eyebrow: { color: colors.coralDark, fontSize: 11, fontWeight: '900', letterSpacing: 1 },
  body: { color: colors.muted, lineHeight: 21 },
  progressCard: { gap: spacing.sm },
  progressTop: { flexDirection: 'row', justifyContent: 'space-between' },
  progressLabel: { color: colors.coralDark, fontSize: 11, fontWeight: '900', letterSpacing: 1 },
  progressValue: { color: colors.muted, fontSize: 12, fontWeight: '700' },
  progressTrack: { height: 8, borderRadius: 4, backgroundColor: colors.lavenderSoft, overflow: 'hidden' },
  progressFill: { width: '18%', height: '100%', borderRadius: 4, backgroundColor: colors.coral },
  controls: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  controlSpacer: { flex: 1 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: spacing.sm },
  sectionTitle: { ...typography.title, color: colors.charcoal, fontSize: 20 },
  sectionMeta: { color: colors.muted, fontWeight: '700' },
  chapter: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, padding: spacing.sm, borderRadius: radii.medium, backgroundColor: colors.paperRaised, borderWidth: 1, borderColor: colors.line },
  chapterNumber: { width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center' },
  chapterNumberText: { color: colors.charcoal, fontWeight: '900' },
  chapterCopy: { flex: 1, gap: 2 },
  chapterTitle: { color: colors.charcoal, fontWeight: '800' },
  chapterTime: { color: colors.muted, fontSize: 12 },
  missing: { padding: spacing.lg, justifyContent: 'center', gap: spacing.lg },
});
