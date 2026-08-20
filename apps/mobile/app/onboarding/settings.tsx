import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { OnboardingShell } from '@/components/onboarding-shell';
import { MotionSlot } from '@/components/animations/MotionSlot';
import { Button } from '@/components/ui';
import { useOnboardingStore } from '@/data/onboarding-store';
import { colors, radii, spacing, typography } from '@/theme';
import readyMascot from '../../assets/onboarding/mascots/account-ready.png';

const benefits = [
  { icon: 'sparkles-outline', title: 'Personalized recipes', detail: 'Just for you' },
  { icon: 'calendar-outline', title: 'Smart meal planning', detail: 'Built around your week' },
  { icon: 'shield-checkmark-outline', title: 'Nutrition tracking', detail: 'Made simple' },
  { icon: 'basket-outline', title: 'Grocery lists', detail: 'That stay in sync' },
] as const;

export default function SettingsScreen() {
  const { profile, finish, saving, error } = useOnboardingStore();
  const [message, setMessage] = useState<string>();
  const firstName = profile.displayName.trim().split(/\s+/)[0] || 'there';

  const complete = async () => {
    setMessage('Preparing your kitchen…');
    const finishError = await finish();
    if (!finishError) router.replace('/onboarding/kitchen-setup');
    else setMessage(finishError);
  };

  return <OnboardingShell
    title={<Text style={styles.heading}>You’re all set,{'\n'}{firstName}!</Text>}
    percent={100}
    footer={<Button disabled={saving} label={saving ? 'Opening your kitchen…' : 'Let’s go to my kitchen'} onPress={() => void complete()} />}
  >
    <Text style={styles.subtitle}>Your profile is ready and we’ll tailor everything to you.</Text>

    <View style={styles.celebration}>
      <View style={styles.confettiOne} /><View style={styles.confettiTwo} /><View style={styles.confettiThree} />
      <View style={styles.check}><Ionicons color={colors.white} name="checkmark" size={31} /></View>
      <<Image source={readyMascot} resizeMode="contain" style={styles.readyMascot} accessibilityLabel="CraveKeep mascot celebrating your completed setup" />
      <View style={styles.recipeCard}><Ionicons color={colors.coralDark} name="document-text-outline" size={24} /><Text style={styles.recipeText}>Made for {firstName}</Text></View>
    </View>

    <View style={styles.benefitGrid}>{benefits.map(benefit => <View key={benefit.title} style={styles.benefit}>
      <View style={styles.icon}><Ionicons color={colors.herb} name={benefit.icon} size={20} /></View>
      <View style={styles.benefitCopy}><Text style={styles.benefitTitle}>{benefit.title}</Text><Text style={styles.benefitDetail}>{benefit.detail}</Text></View>
    </View>)}</View>

    <View style={styles.summary}>
      <View style={styles.summaryItem}><Text style={styles.summaryNumber}>{profile.loves.length}</Text><Text style={styles.summaryLabel}>loved foods</Text></View>
      <View style={styles.divider} />
      <View style={styles.summaryItem}><Text style={styles.summaryNumber}>{profile.householdMembers.length + 1}</Text><Text style={styles.summaryLabel}>household members</Text></View>
      <View style={styles.divider} />
      <View style={styles.summaryItem}><Text style={styles.summaryNumber}>{profile.calories.toLocaleString()}</Text><Text style={styles.summaryLabel}>daily calories</Text></View>
    </View>

    <View style={styles.private}><Ionicons color={colors.herb} name="lock-closed-outline" size={20} /><Text style={styles.privateText}>Your allergies, preferences, and nutrition information remain private and can be updated later.</Text></View>
    {message || error ? <Text accessibilityRole="alert" style={styles.error}>{message || error}</Text> : null}
  </OnboardingShell>;
}

const styles = StyleSheet.create({
  heading: { color: colors.charcoal, ...typography.title, fontSize: 29, lineHeight: 32, textAlign: 'center' },
  subtitle: { marginTop: -spacing.md, color: colors.muted, lineHeight: 19, textAlign: 'center' },
  readyMascot: { width: 185, height: 218 },
  celebration: { minHeight: 218, alignItems: 'center', justifyContent: 'flex-end', overflow: 'hidden' },
  check: { position: 'absolute', top: 2, zIndex: 2, width: 58, height: 58, borderRadius: 29, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.herb, shadowColor: colors.herb, shadowOpacity: 0.25, shadowRadius: 12, elevation: 3 },
  recipeCard: { position: 'absolute', right: 20, bottom: 26, zIndex: 2, padding: 9, alignItems: 'center', borderWidth: 1, borderColor: '#E8C697', borderRadius: radii.small, backgroundColor: '#FFF8EE', transform: [{ rotate: '4deg' }] },
  recipeText: { marginTop: 2, color: colors.charcoal, fontSize: 10, fontWeight: '800' },
  confettiOne: { position: 'absolute', top: 40, left: 28, width: 8, height: 24, borderRadius: 4, backgroundColor: colors.coral, transform: [{ rotate: '-28deg' }] },
  confettiTwo: { position: 'absolute', top: 69, right: 35, width: 9, height: 20, borderRadius: 4, backgroundColor: colors.lemon, transform: [{ rotate: '35deg' }] },
  confettiThree: { position: 'absolute', top: 25, right: 88, width: 8, height: 8, borderRadius: 4, backgroundColor: colors.mint },
  benefitGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  benefit: { width: '48.5%', minHeight: 70, padding: 10, flexDirection: 'row', alignItems: 'center', gap: 8, borderWidth: 1, borderColor: colors.line, borderRadius: radii.small, backgroundColor: colors.paperRaised },
  icon: { width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.herbSoft },
  benefitCopy: { flex: 1 }, benefitTitle: { color: colors.charcoal, fontSize: 11, fontWeight: '900' }, benefitDetail: { marginTop: 2, color: colors.muted, fontSize: 9, lineHeight: 12 },
  summary: { paddingVertical: spacing.md, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: colors.line, borderRadius: radii.medium, backgroundColor: colors.paperRaised },
  summaryItem: { flex: 1, alignItems: 'center' }, summaryNumber: { color: colors.coralDark, fontSize: 17, fontWeight: '900' }, summaryLabel: { marginTop: 3, color: colors.muted, fontSize: 9, textAlign: 'center' },
  divider: { width: 1, height: 30, backgroundColor: colors.line },
  private: { padding: 12, flexDirection: 'row', alignItems: 'center', gap: 9, borderRadius: radii.small, backgroundColor: colors.herbSoft },
  privateText: { flex: 1, color: colors.charcoal, fontSize: 10, lineHeight: 15 },
  error: { color: colors.coralDark, textAlign: 'center' }
});
