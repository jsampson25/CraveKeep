import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radii, spacing, typography } from '@/theme';

export default function NotFoundScreen() {
  return <View style={styles.screen}>
    <View style={styles.mark}><Ionicons color={colors.white} name="book-outline" size={42} /></View>
    <Text style={styles.eyebrow}>CRAVEKEEP</Text>
    <Text accessibilityRole="header" style={styles.title}>That recipe page got lost.</Text>
    <Text style={styles.body}>The link may be outdated, or this page may have moved. Let’s get you back to your kitchen.</Text>
    <Pressable accessibilityRole="button" onPress={() => router.replace('/')} style={styles.button}><Text style={styles.buttonText}>Back to CraveKeep</Text><Ionicons color={colors.white} name="arrow-forward" size={19} /></Pressable>
  </View>;
}

const styles = StyleSheet.create({
  screen: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xl, backgroundColor: colors.paper },
  mark: { width: 86, height: 86, borderRadius: 30, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.coral, marginBottom: spacing.lg },
  eyebrow: { color: colors.coralDark, ...typography.label, letterSpacing: 1.2, marginBottom: spacing.sm },
  title: { color: colors.navy, ...typography.display, fontSize: 34, lineHeight: 39, textAlign: 'center' },
  body: { maxWidth: 330, color: colors.muted, fontSize: 16, lineHeight: 23, textAlign: 'center', marginTop: spacing.md },
  button: { minHeight: 54, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm, paddingHorizontal: spacing.lg, borderRadius: radii.round, backgroundColor: colors.coral, marginTop: spacing.xl },
  buttonText: { color: colors.white, ...typography.action, fontSize: 16 }
});
