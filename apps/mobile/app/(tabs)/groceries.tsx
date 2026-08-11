import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text } from 'react-native';
import { Card, Eyebrow, Screen, Title } from '@/components/ui';
import { colors, spacing } from '@/theme';
export default function GroceriesScreen() { return <Screen style={styles.screen}><Eyebrow>Groceries</Eyebrow><Title>Shop from your recipes</Title><Card style={styles.card}><Ionicons color={colors.herb} name="basket-outline" size={58} /><Text style={styles.heading}>Your first list starts with real ingredients.</Text><Text style={styles.body}>Recipe-to-list merging and pantry confidence arrive in their own tested slice. This destination intentionally uses Groceries—not Shop.</Text></Card></Screen>; }
const styles = StyleSheet.create({ screen: { padding: spacing.lg, gap: spacing.lg }, card: { gap: spacing.md, alignItems: 'center', marginTop: spacing.lg }, heading: { color: colors.charcoal, fontSize: 20, fontWeight: '800', textAlign: 'center' }, body: { color: colors.muted, lineHeight: 22, textAlign: 'center' } });
