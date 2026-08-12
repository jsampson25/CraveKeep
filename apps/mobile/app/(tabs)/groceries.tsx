import { generateGroceryItems } from '@cravekeep/domain';
import { Ionicons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Button, Card, Eyebrow, Screen, SectionTitle, Title } from '@/components/ui';
import { useGroceryStore } from '@/data/grocery-store';
import { usePlanningStore } from '@/data/planning-store';
import { useRecipeStore } from '@/data/recipe-store';
import { colors, radii, spacing } from '@/theme';

const toLocalDate = (date: Date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
export default function GroceriesScreen() {
  const { recipes } = useRecipeStore(); const { meals } = usePlanningStore(); const { items, replaceItems, toggleChecked, clearChecked, error } = useGroceryStore(); const [message, setMessage] = useState<string>();
  const weekMeals = useMemo(() => { const dates = new Set(Array.from({ length: 7 }, (_, offset) => { const date = new Date(); date.setDate(date.getDate() + offset); return toLocalDate(date); })); return meals.filter((meal) => dates.has(meal.date)); }, [meals]);
  const generate = async () => { const generated = generateGroceryItems(weekMeals, recipes); const checkedByKey = new Map(items.map((item) => [item.key, item.checked])); await replaceItems(generated.map((item) => ({ ...item, checked: checkedByKey.get(item.key) ?? false }))); setMessage(generated.length ? `Generated ${generated.length} items from the next 7 days.` : 'Plan at least one upcoming meal to generate groceries.'); };
  const active = items.filter((item) => !item.checked); const checked = items.filter((item) => item.checked);
  return <Screen><ScrollView contentContainerStyle={styles.content}>
    <Eyebrow>GROCERIES</Eyebrow><Title>Shop from your plan.</Title><Text style={styles.body}>CraveKeep merges matching ingredient names and scales simple numeric quantities. Complex amounts stay visible and are marked for review.</Text>
    <Button label="Generate from next 7 days" onPress={() => void generate()} />
    <SectionTitle>Active list</SectionTitle>{active.length ? active.map((item) => <Pressable accessibilityRole="checkbox" accessibilityState={{ checked: false }} key={item.key} onPress={() => void toggleChecked(item.key)} style={styles.item}><Ionicons color={colors.muted} name="ellipse-outline" size={24} /><View style={styles.flex}><Text style={styles.itemName}>{item.name}</Text><Text style={styles.quantity}>{item.quantity || 'Quantity not specified'}{item.uncertain ? ' · Check quantity' : ''}</Text><Text style={styles.source}>From {item.sourceRecipeIds.map((id) => recipes.find((recipe) => recipe.id === id)?.title).filter(Boolean).join(', ') || 'planned recipe'}</Text></View></Pressable>) : <Card style={styles.empty}><Ionicons color={colors.herb} name="basket-outline" size={48} /><Text style={styles.body}>Your active list is empty. Generate it from this week’s planned meals.</Text></Card>}
    {checked.length ? <><SectionTitle action={<Pressable accessibilityRole="button" onPress={() => void clearChecked()}><Text style={styles.clear}>Clear checked</Text></Pressable>}>Checked</SectionTitle>{checked.map((item) => <Pressable accessibilityRole="checkbox" accessibilityState={{ checked: true }} key={item.key} onPress={() => void toggleChecked(item.key)} style={[styles.item, styles.checked]}><Ionicons color={colors.herb} name="checkmark-circle" size={24} /><View style={styles.flex}><Text style={[styles.itemName, styles.checkedText]}>{item.name}</Text><Text style={styles.quantity}>{item.quantity || 'Quantity not specified'}</Text></View></Pressable>)}</> : null}
    {message || error ? <Text accessibilityRole="alert" style={styles.message}>{message ?? error}</Text> : null}
  </ScrollView></Screen>;
}
const styles = StyleSheet.create({ content: { padding: spacing.lg, gap: spacing.md, paddingBottom: 100 }, body: { color: colors.muted, lineHeight: 22 }, item: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, padding: spacing.md, borderWidth: 1, borderColor: colors.line, borderRadius: radii.medium, backgroundColor: colors.paperRaised }, checked: { opacity: 0.65 }, flex: { flex: 1 }, itemName: { color: colors.charcoal, fontSize: 16, fontWeight: '900' }, checkedText: { textDecorationLine: 'line-through' }, quantity: { color: colors.coralDark, fontWeight: '700' }, source: { color: colors.muted, fontSize: 12 }, empty: { alignItems: 'center', gap: spacing.sm }, clear: { color: colors.coralDark, fontWeight: '900' }, message: { color: colors.coralDark, fontWeight: '700' } });
