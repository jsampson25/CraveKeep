import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { OnboardingShell } from '@/components/onboarding-shell';
import { MotionSlot } from '@/components/animations/MotionSlot';
import { Button } from '@/components/ui';
import { useOnboardingStore } from '@/data/onboarding-store';
import { colors, radii, spacing, typography } from '@/theme';

export default function HouseholdScreen() {
  const { profile, update, saveHousehold, saving, error } = useOnboardingStore();
  const [message, setMessage] = useState<string>();
  const ownerName = profile.displayName.trim() || 'You';
  const householdSize = profile.householdMembers.length + 1;

  const addMember = (type: 'adult' | 'child') => {
    router.push({ pathname: '/onboarding/household-member', params: { type } });
  };
  const removeMember = (id: string) => {
    void update({ householdMembers: profile.householdMembers.filter(member => member.id !== id) });
  };
  const continueOn = async () => {
    setMessage('Saving your household…');
    const householdName = profile.householdName.trim() || `${ownerName}’s Kitchen`;
    await update({ householdName });
    const saveError = await saveHousehold();
    if (!saveError) router.push('/onboarding/nutrition-goals');
    else setMessage(saveError);
  };

  return <OnboardingShell
    title={<Text>Who are we{"\n"}cooking for?</Text>}
    percent={76}
    footer={<Button disabled={saving} label={saving ? 'Saving…' : 'Continue'} onPress={() => void continueOn()} />}
  >
    <Text style={styles.subtitle}>Personalize meals for everyone at home.</Text>
    <View style={styles.people}>
      <View style={[styles.personCard, styles.selectedCard]}>
        <View style={styles.avatar}><Text style={styles.avatarText}>{ownerName.slice(0, 1).toUpperCase()}</Text></View>
        <Ionicons color={colors.herb} name="checkmark-circle" size={20} style={styles.check} />
        <Text numberOfLines={1} style={styles.personName}>{ownerName}</Text>
        <Text style={styles.personType}>(You)</Text>
      </View>
      <Pressable onPress={() => addMember('adult')} style={styles.personCard}>
        <View style={styles.addCircle}><Ionicons color={colors.charcoal} name="add" size={29} /></View>
        <Text style={styles.personName}>Add</Text><Text style={styles.personType}>adult</Text>
      </Pressable>
      <Pressable onPress={() => addMember('child')} style={styles.personCard}>
        <View style={styles.addCircle}><Ionicons color={colors.charcoal} name="person" size={24} /></View>
        <Text style={styles.personName}>Add</Text><Text style={styles.personType}>child</Text>
      </Pressable>
    </View>

    {profile.householdMembers.length ? <View style={styles.memberList}>
      {profile.householdMembers.map(member => <View key={member.id} style={styles.memberRow}>
        <View style={[styles.smallAvatar, member.type === 'child' && styles.childAvatar]}><Text style={styles.smallAvatarText}>{member.name.slice(0, 1).toUpperCase()}</Text></View>
        <Pressable style={styles.memberCopy} onPress={() => router.push({ pathname: '/onboarding/household-member', params: { memberId: member.id } })}>
          <Text style={styles.memberName}>{member.name}</Text>
          <Text numberOfLines={1} style={styles.memberDetail}>{member.preferences.length} loved · {member.avoids.length} avoided · {member.allergies.length} allergies</Text>
        </Pressable>
        <Pressable accessibilityLabel={`Edit ${member.name}`} onPress={() => router.push({ pathname: '/onboarding/household-member', params: { memberId: member.id } })}><Ionicons color={colors.coralDark} name="create-outline" size={21} /></Pressable>
        <Pressable accessibilityLabel={`Remove ${member.name}`} onPress={() => removeMember(member.id)}><Ionicons color={colors.muted} name="close-circle-outline" size={21} /></Pressable>
      </View>)}
    </View> : null}

    <View style={styles.sizeRow}>
      <Text style={styles.sizeLabel}>Household size</Text>
      <View style={styles.counter}><Pressable disabled={profile.householdMembers.length === 0} onPress={() => removeMember(profile.householdMembers.at(-1)!.id)} style={styles.counterButton}><Ionicons color={colors.charcoal} name="remove" size={20} /></Pressable><Text style={styles.count}>{householdSize}</Text><Pressable onPress={() => addMember('adult')} style={styles.counterButton}><Ionicons color={colors.charcoal} name="add" size={20} /></Pressable></View>
    </View>

    <View style={styles.mascotCard}>
      <MotionSlot name="onboarding-preferences" size={116} accessibilityLabel="CraveKeep mascot introducing household meal planning" />
      <View style={styles.sign}><Text style={styles.signText}>Great meals{"\n"}for your{"\n"}whole crew!</Text><View style={styles.faces}><Text>☺  ☺  ☺</Text></View></View>
    </View>
    {message || error ? <Text accessibilityRole="alert" style={styles.error}>{message || error}</Text> : null}
  </OnboardingShell>;
}

const styles = StyleSheet.create({
  subtitle: { marginTop: -spacing.md, color: colors.muted, fontSize: 13 },
  people: { flexDirection: 'row', gap: spacing.sm },
  personCard: { flex: 1, minHeight: 128, alignItems: 'center', justifyContent: 'center', padding: spacing.sm, borderWidth: 1, borderColor: colors.line, borderRadius: radii.medium, backgroundColor: colors.paperRaised },
  selectedCard: { borderColor: colors.herb, backgroundColor: colors.herbSoft },
  avatar: { width: 58, height: 58, borderRadius: 29, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.charcoal },
  avatarText: { color: colors.white, fontSize: 21, fontWeight: '900' },
  check: { position: 'absolute', top: 8, right: 8 },
  addCircle: { width: 58, height: 58, borderRadius: 29, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.line, backgroundColor: colors.background },
  personName: { marginTop: 8, color: colors.charcoal, fontWeight: '800' },
  personType: { color: colors.muted, fontSize: 12 },
  memberList: { overflow: 'hidden', borderWidth: 1, borderColor: colors.line, borderRadius: radii.medium, backgroundColor: colors.paperRaised },
  memberRow: { minHeight: 64, paddingHorizontal: spacing.sm, flexDirection: 'row', alignItems: 'center', gap: 9, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.line },
  smallAvatar: { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.charcoal },
  childAvatar: { backgroundColor: colors.herb },
  smallAvatarText: { color: colors.white, fontWeight: '900' },
  memberCopy: { flex: 1 }, memberName: { fontWeight: '800', color: colors.charcoal }, memberDetail: { color: colors.muted, fontSize: 11, marginTop: 2 },
  sizeRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  sizeLabel: { ...typography.label, color: colors.charcoal },
  counter: { flexDirection: 'row', alignItems: 'center', overflow: 'hidden', borderWidth: 1, borderColor: colors.line, borderRadius: radii.round, backgroundColor: colors.paperRaised },
  counterButton: { width: 42, height: 38, alignItems: 'center', justifyContent: 'center' },
  count: { minWidth: 30, textAlign: 'center', color: colors.charcoal, fontSize: 18, fontWeight: '900' },
  mascotCard: { minHeight: 152, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'center', gap: spacing.sm },
  sign: { minWidth: 132, marginBottom: 8, padding: spacing.md, borderWidth: 2, borderColor: '#B98243', borderRadius: radii.small, backgroundColor: '#FFF8E8', transform: [{ rotate: '-1deg' }] },
  signText: { color: colors.charcoal, textAlign: 'center', fontSize: 17, lineHeight: 20, fontWeight: '700' },
  faces: { marginTop: 8, alignItems: 'center' },
  error: { color: colors.coralDark, textAlign: 'center' }
});
