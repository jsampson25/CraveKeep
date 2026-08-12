import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Button, Card, Screen, Title } from '@/components/ui';
import { useRecipeStore } from '@/data/recipe-store';
import { colors, radii, spacing } from '@/theme';
import { RecipeArt } from '@/components/recipe-art';

export default function RecipesScreen() {
  const { recipes, ready } = useRecipeStore();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'favorites' | 'versions'>('all');
  const visibleRecipes = useMemo(() => {
    const terms = query.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
    return recipes.filter((recipe) => {
      if (filter === 'favorites' && !recipe.favorite) return false;
      if (filter === 'versions' && recipe.version === 1) return false;
      const searchable = [recipe.title, recipe.description, recipe.source.label, ...recipe.ingredients.map((item) => item.name), ...recipe.steps].join(' ').toLocaleLowerCase();
      return terms.every((term) => searchable.includes(term));
    });
  }, [filter, query, recipes]);
  return <Screen><ScrollView contentContainerStyle={styles.content}>
    <View style={styles.header}><Title>My Recipes</Title><View style={styles.avatar}><Text style={styles.avatarText}>JS</Text></View></View>
    <View style={styles.search}><Ionicons color={colors.muted} name="search" size={20} /><TextInput accessibilityLabel="Search recipes" onChangeText={setQuery} placeholder="Title, ingredient, or direction" placeholderTextColor={colors.muted} returnKeyType="search" style={styles.searchInput} value={query} />{query ? <Pressable accessibilityLabel="Clear recipe search" onPress={() => setQuery('')}><Ionicons color={colors.muted} name="close-circle" size={20} /></Pressable> : null}</View>
    <View accessibilityRole="tablist" style={styles.filters}>{(['all', 'favorites', 'versions'] as const).map((value) => <Pressable accessibilityRole="tab" accessibilityState={{ selected: filter === value }} key={value} onPress={() => setFilter(value)}><Text style={filter === value ? styles.filterActive : styles.filter}>{value === 'all' ? 'All' : value === 'favorites' ? 'Favorites' : 'Versions'}</Text></Pressable>)}</View>
    {!ready ? <ActivityIndicator color={colors.coral} /> : recipes.length === 0 ? <Card style={styles.empty}><Ionicons color={colors.coral} name="book-outline" size={64} /><Text style={styles.emptyTitle}>Your recipes deserve one home.</Text><Text style={styles.body}>Create a recipe now, then capture from anywhere as those slices arrive.</Text><Button label="Add my first recipe" onPress={() => router.push('/recipes/new')} /></Card> : visibleRecipes.length === 0 ? <Card style={styles.empty}><Ionicons color={colors.herb} name="search-outline" size={48} /><Text style={styles.emptyTitle}>No recipes match.</Text><Text style={styles.body}>Try fewer words or choose a different filter.</Text><Button label="Clear search and filters" onPress={() => { setQuery(''); setFilter('all'); }} /></Card> : <View style={styles.grid}>{visibleRecipes.map((recipe) => <Pressable accessibilityLabel={`Open ${recipe.title}`} key={recipe.id} onPress={() => router.push(`/recipes/${recipe.id}`)} style={styles.recipeCard}><RecipeArt compact favorite={recipe.favorite} /><Text numberOfLines={2} style={styles.recipeTitle}>{recipe.title}</Text><Text style={styles.body}>{recipe.prepMinutes + recipe.cookMinutes} min</Text><Text style={styles.badge}>{recipe.version > 1 ? `Version ${recipe.version}` : recipe.source.kind === 'manual' ? 'Original' : recipe.source.kind === 'imported' ? 'Imported' : 'Sample'}</Text></Pressable>)}</View>}
    <Button label="Create a recipe" onPress={() => router.push('/recipes/new')} />
  </ScrollView></Screen>;
}
const styles = StyleSheet.create({ content: { padding: spacing.lg, gap: spacing.lg, paddingBottom: 110 }, header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }, avatar: { width: 42, height: 42, borderRadius: 21, backgroundColor: colors.charcoal, alignItems: 'center', justifyContent: 'center' }, avatarText: { color: colors.white, fontWeight: '800' }, search: { height: 50, flexDirection: 'row', alignItems: 'center', gap: spacing.sm, borderWidth: 1, borderColor: colors.line, borderRadius: radii.small, paddingHorizontal: spacing.md, backgroundColor: colors.paperRaised }, searchInput: { flex: 1, fontSize: 16, color: colors.charcoal }, filters: { flexDirection: 'row', gap: spacing.sm }, filter: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: radii.round, color: colors.muted, borderWidth: 1, borderColor: colors.line }, filterActive: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: radii.round, color: colors.white, backgroundColor: colors.coral, overflow: 'hidden' }, grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md }, recipeCard: { width: '47%', gap: 5 }, recipeArt: { height: 128, borderRadius: radii.medium, backgroundColor: colors.herbSoft, alignItems: 'center', justifyContent: 'center' }, heart: { position: 'absolute', right: 10, top: 10 }, recipeTitle: { color: colors.charcoal, fontSize: 16, lineHeight: 20, fontWeight: '800' }, body: { color: colors.muted, fontSize: 13, lineHeight: 19 }, badge: { alignSelf: 'flex-start', color: colors.herb, backgroundColor: colors.herbSoft, paddingHorizontal: 8, paddingVertical: 3, borderRadius: radii.round, fontSize: 11, fontWeight: '700' }, empty: { alignItems: 'center', gap: spacing.md }, emptyTitle: { fontFamily: 'Georgia', fontSize: 24, color: colors.charcoal, fontWeight: '700', textAlign: 'center' } });
