import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text } from 'react-native';
import { Card, Eyebrow, Screen, Title } from '@/components/ui';
import { colors, spacing } from '@/theme';
export default function PlanScreen() { return <Screen style={styles.screen}><Eyebrow>Next slice</Eyebrow><Title>Plan your week</Title><Card style={styles.card}><Ionicons color={colors.citrus} name="calendar-outline" size={58} /><Text style={styles.heading}>Meal planning is mapped, not mocked.</Text><Text style={styles.body}>The weekly calendar, nutrition targets, and Fit My Day modes will arrive after capture and recipe versions have dependable data.</Text></Card></Screen>; }
const styles = StyleSheet.create({ screen: { padding: spacing.lg, gap: spacing.lg }, card: { gap: spacing.md, alignItems: 'center', marginTop: spacing.lg }, heading: { color: colors.charcoal, fontSize: 20, fontWeight: '800', textAlign: 'center' }, body: { color: colors.muted, lineHeight: 22, textAlign: 'center' } });
