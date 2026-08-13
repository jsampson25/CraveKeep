import type { PropsWithChildren, ReactNode } from 'react';
import { Pressable, StyleSheet, Text, TextInput, type TextInputProps, View, type ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, radii, spacing, typography } from '../theme';

export function Screen({ children, style }: PropsWithChildren<{ style?: ViewStyle }>) {
  return <SafeAreaView edges={['top']} style={[styles.screen, style]}>{children}</SafeAreaView>;
}

export function Eyebrow({ children }: PropsWithChildren) {
  return <Text style={styles.eyebrow}>{children}</Text>;
}

export function Title({ children }: PropsWithChildren) {
  return <Text accessibilityRole="header" style={styles.title}>{children}</Text>;
}

export function SectionTitle({ children, action }: PropsWithChildren<{ action?: ReactNode }>) {
  return <View style={styles.sectionRow}><Text style={styles.sectionTitle}>{children}</Text>{action}</View>;
}

export function Card({ children, style }: PropsWithChildren<{ style?: ViewStyle }>) {
  return <View style={[styles.card, style]}>{children}</View>;
}

export function Button({ label, onPress, variant = 'primary', disabled = false }: { label: string; onPress: () => void; variant?: 'primary' | 'secondary' | 'quiet'; disabled?: boolean }) {
  return (
    <Pressable accessibilityRole="button" accessibilityState={{ disabled }} disabled={disabled} onPress={onPress} style={({ pressed }) => [styles.button, styles[`${variant}Button`], pressed && !disabled && styles.pressed, disabled && styles.disabled]}>
      <Text style={[styles.buttonText, variant !== 'primary' && styles.secondaryButtonText]}>{label}</Text>
    </Pressable>
  );
}

export function Field({ label, error, ...props }: TextInputProps & { label: string; error?: string }) {
  return <View style={styles.fieldWrap}><Text style={styles.label}>{label}</Text><TextInput placeholderTextColor={colors.muted} style={[styles.input, error && styles.inputError]} {...props} />{error ? <Text style={styles.error}>{error}</Text> : null}</View>;
}

const styles = StyleSheet.create({
  screen: { flex: 1, paddingTop: spacing.sm, backgroundColor: colors.paper },
  eyebrow: { color: colors.coralDark, fontSize: 12, fontWeight: '800', letterSpacing: 1.2, textTransform: 'uppercase' },
  title: { color: colors.charcoal, ...typography.title, fontSize: 34, lineHeight: 39 },
  sectionRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.sm },
  sectionTitle: { color: colors.charcoal, ...typography.label, fontSize: 19 },
  card: { backgroundColor: colors.paperRaised, borderColor: colors.line, borderRadius: radii.medium, borderWidth: 1, padding: spacing.md },
  button: { minHeight: 52, borderRadius: radii.medium, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.md },
  primaryButton: { backgroundColor: colors.coral },
  secondaryButton: { backgroundColor: colors.paperRaised, borderColor: colors.coral, borderWidth: 1 },
  quietButton: { backgroundColor: 'transparent' },
  pressed: { opacity: 0.78 },
  disabled: { opacity: 0.45 },
  buttonText: { color: colors.white, ...typography.action, fontSize: 16 },
  secondaryButtonText: { color: colors.coralDark },
  fieldWrap: { gap: spacing.xs },
  label: { color: colors.charcoal, ...typography.label, fontSize: 14 },
  input: { minHeight: 50, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.paperRaised, borderRadius: radii.small, paddingHorizontal: 14, color: colors.charcoal, ...typography.body, fontSize: 16 },
  inputError: { borderColor: colors.coral },
  error: { color: colors.coralDark, fontSize: 13 }
});
