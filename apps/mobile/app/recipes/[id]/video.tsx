import { Ionicons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import { Image, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { createElement } from 'react';
import { MotionSlot } from '@/components/animations/MotionSlot';
import { Button, Card, Screen, Title } from '@/components/ui';
import { useRecipeStore } from '@/data/recipe-store';
import { colors, radii, spacing, typography } from '@/theme';

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

  const embedUrl = recipe.source.platform === 'youtube' && recipe.source.externalId
    ? `https://www.youtube.com/embed/${recipe.source.externalId}?playsinline=1&rel=0`
    : recipe.source.platform === 'vimeo' && recipe.source.externalId
      ? `https://player.vimeo.com/video/${recipe.source.externalId}`
      : recipe.source.platform === 'tiktok' && recipe.source.externalId
        ? `https://www.tiktok.com/player/v1/${recipe.source.externalId}`
        : recipe.source.platform === 'instagram' && recipe.source.externalId
          ? `https://www.instagram.com/reel/${recipe.source.externalId}/embed`
          : recipe.source.platform === 'facebook' && recipe.source.url
            ? `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(recipe.source.url)}&show_text=false`
            : undefined;
  const openSource = () => { if (recipe.source.url) void WebBrowser.openBrowserAsync(recipe.source.url); };
  const platformLabel = recipe.source.platform ? recipe.source.platform[0].toUpperCase() + recipe.source.platform.slice(1) : 'Original source';
  const chapterColors = [colors.coral, colors.mint, colors.lemon, colors.lavender];
  const chapters = recipe.steps.map((title, index) => ({ title, time: `Step ${index + 1}`, color: chapterColors[index % chapterColors.length] }));

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
          {embedUrl && Platform.OS === 'web'
            ? createElement('iframe', { title: `${recipe.title} video`, src: embedUrl, allow: 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share', allowFullScreen: true, style: styles.iframe })
            : <>{recipe.source.imageUrl ? <Image accessibilityLabel="Imported recipe preview" source={{ uri: recipe.source.imageUrl }} style={styles.sourceImage} /> : <MotionSlot name="onboarding-recipe-card" size={130} accessibilityLabel="Animated recipe card preview" />}<Pressable accessibilityRole="button" onPress={openSource} style={styles.playButton}><Ionicons name="play" size={28} color={colors.white} /></Pressable><Text style={styles.playerLabel}>{recipe.source.platform ? `Open on ${recipe.source.platform}` : 'Open original video'}</Text></>}
        </View>

        <View style={styles.titleBlock}>
          <Text style={styles.eyebrow}>WATCH & COOK</Text>
          <Title>{recipe.title}</Title>
          <Text style={styles.body}>{recipe.description}</Text>
          <Pressable accessibilityRole="button" onPress={openSource} style={styles.sourceRow}><Ionicons color={colors.coralDark} name="link-outline" size={16} /><Text style={styles.sourceLink}>Imported from {platformLabel}{recipe.source.creator ? ` · ${recipe.source.creator}` : ''}</Text></Pressable>
        </View>

        <Card style={styles.progressCard}>
          <View style={styles.progressTop}>
            <Text style={styles.progressLabel}>{embedUrl ? 'SOURCE PLAYER' : 'SOURCE LINK'}</Text>
            <Ionicons name={embedUrl ? 'play-circle-outline' : 'open-outline'} size={20} color={colors.coralDark} />
          </View>
          <Text style={styles.body}>{embedUrl ? 'Playback controls and progress are provided by the embedded source player.' : 'Open the original source to watch this recipe video.'}</Text>
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
  iframe: { width: '100%', height: '100%', borderWidth: 0 },
  sourceImage: { width: '78%', height: 170, borderRadius: radii.medium, resizeMode: 'cover' },
  playButton: { width: 68, height: 68, borderRadius: 34, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.coral, marginTop: -4 },
  playerLabel: { color: colors.white, fontWeight: '800', marginTop: spacing.sm },
  titleBlock: { gap: spacing.xs },
  eyebrow: { color: colors.coralDark, fontSize: 11, fontWeight: '900', letterSpacing: 1 },
  body: { color: colors.muted, lineHeight: 21 },
  sourceRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, paddingTop: spacing.xs },
  sourceLink: { color: colors.coralDark, fontWeight: '800', flexShrink: 1 },
  progressCard: { gap: spacing.sm },
  progressTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  progressLabel: { color: colors.coralDark, fontSize: 11, fontWeight: '900', letterSpacing: 1 },
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
