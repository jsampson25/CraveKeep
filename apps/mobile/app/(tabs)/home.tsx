import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Card, Eyebrow, Screen, SectionTitle, Title } from '@/components/ui';
import { useRecipeStore } from '@/data/recipe-store';
import { colors, radii, spacing } from '@/theme';

export default function HomeScreen() {
  const { recipes, ready, error } = useRecipeStore();
  const latest = recipes[0];
  return (
    <Screen><ScrollView contentContainerStyle={styles.content}>
      <View style={styles.header}><View><Eyebrow>CraveKeep</Eyebrow><Title>Good evening, Jason</Title></View><View accessibilityLabel="Open profile" style={styles.avatar}><Text style={styles.avatarText}>JS</Text></View></View>
      {error ? <Text accessibilityRole="alert" style={styles.error}>{error}</Text> : null}
      <Card style={styles.hero}><View style={styles.heroCopy}><Eyebrow>Your kitchen</Eyebrow><Text style={styles.heroTitle}>Every recipe worth making, kept in one place.</Text><Text style={styles.body}>Create your own recipe now. Capture from links, scans, and photos arrives in the next product slices.</Text></View><Ionicons color={colors.coral} name="restaurant-outline" size={64} /></Card>
      {!ready ? <ActivityIndicator color={colors.coral} /> : latest ? <>
        <SectionTitle action={<Pressable onPress={() => router.push('/(tabs)/recipes')}><Text style={styles.link}>See all</Text></Pressable>}>Recently saved</SectionTitle>
        <Pressable onPress={() => router.push(`/recipes/${latest.id}`)}><Card><View style={styles.recipeRow}><View style={styles.recipeIcon}><Ionicons color={colors.herb} name="leaf" size={26} /></View><View style={styles.flex}><Text style={styles.recipeTitle}>{latest.title}</Text><Text style={styles.body}>{latest.prepMinutes + latest.cookMinutes} min · {latest.servings} servings</Text><Text style={styles.source}>{latest.source.label} · Private</Text></View><Ionicons color={colors.muted} name="chevron-forward" size={22} /></View></Card></Pressable>
      </> : null}
      <SectionTitle>Pick up where you left off</SectionTitle>
      <Card><View style={styles.recipeRow}><Ionicons color={colors.citrus} name="time-outline" size={28} /><View style={styles.flex}><Text style={styles.recipeTitle}>Nothing unfinished</Text><Text style={styles.body}>Imports and cooking sessions you leave will wait safely here.</Text></View></View></Card>
    </ScrollView></Screen>
  );
}
const styles = StyleSheet.create({ content: { padding: spacing.lg, gap: spacing.lg, paddingBottom: 110 }, header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.md }, avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.charcoal, alignItems: 'center', justifyContent: 'center' }, avatarText: { color: colors.white, fontWeight: '800' }, hero: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.herbSoft }, heroCopy: { flex: 1, gap: spacing.sm }, heroTitle: { fontFamily: 'Georgia', color: colors.charcoal, fontSize: 24, lineHeight: 29, fontWeight: '700' }, body: { color: colors.muted, fontSize: 14, lineHeight: 20 }, error: { color: colors.coralDark, backgroundColor: '#FFF0ED', padding: spacing.md, borderRadius: radii.small }, link: { color: colors.coralDark, fontWeight: '700' }, recipeRow: { flexDirection: 'row', gap: spacing.md, alignItems: 'center' }, recipeIcon: { width: 54, height: 54, borderRadius: radii.medium, backgroundColor: colors.herbSoft, alignItems: 'center', justifyContent: 'center' }, flex: { flex: 1, gap: 3 }, recipeTitle: { color: colors.charcoal, fontSize: 17, fontWeight: '800' }, source: { color: colors.herb, fontSize: 12, fontWeight: '700' } });
