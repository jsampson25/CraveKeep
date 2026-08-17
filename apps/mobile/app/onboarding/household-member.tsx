import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Switch, Text, TextInput, View } from 'react-native';
import { OnboardingShell } from '@/components/onboarding-shell';
import { MotionSlot } from '@/components/animations/MotionSlot';
import { Button } from '@/components/ui';
import { useOnboardingStore } from '@/data/onboarding-store';
import { colors, radii, spacing, typography } from '@/theme';

const FOODS = ['Chicken', 'Pasta', 'Broccoli', 'Beef', 'Salmon', 'Rice', 'Tacos', 'Spinach', 'Pizza', 'Carrots', 'Eggs', 'Shrimp'];
const ALLERGENS = ['Peanuts', 'Tree nuts', 'Milk', 'Eggs', 'Wheat', 'Soy', 'Fish', 'Shellfish', 'Sesame'];
const DIETS = ['Vegetarian', 'Vegan', 'Pescatarian', 'Gluten-free', 'Dairy-free', 'Low-carb'];
const toggle = (items: string[], value: string) => items.includes(value) ? items.filter(item => item !== value) : [...items, value];

function ChoiceField({ label, values, options, onChange }: { label: string; values: string[]; options: string[]; onChange: (values: string[]) => void }) {
  const [open, setOpen] = useState(false);
  return <View style={styles.fieldGroup}>
    <Text style={styles.label}>{label}</Text>
    <Pressable onPress={() => setOpen(value => !value)} style={styles.selectBox}>
      <View style={styles.chips}>{values.length ? values.map(value => <View key={value} style={styles.valueChip}><Text style={styles.valueChipText}>{value}</Text><Ionicons color={colors.muted} name="close" size={13} /></View>) : <Text style={styles.placeholder}>Select any that apply</Text>}</View>
      <Ionicons color={colors.charcoal} name={open ? 'chevron-up' : 'chevron-down'} size={18} />
    </Pressable>
    {open ? <View style={styles.options}>{options.map(option => {
      const selected = values.includes(option);
      return <Pressable key={option} onPress={() => onChange(toggle(values, option))} style={[styles.option, selected && styles.optionSelected]}>
        <Text style={[styles.optionText, selected && styles.optionTextSelected]}>{option}</Text>
        {selected ? <Ionicons color={colors.herb} name="checkmark-circle" size={17} /> : null}
      </Pressable>;
    })}</View> : null}
  </View>;
}

export default function HouseholdMemberScreen() {
  const params = useLocalSearchParams<{ memberId?: string; type?: 'adult' | 'child' }>();
  const { profile, update } = useOnboardingStore();
  const existing = useMemo(() => profile.householdMembers.find(member => member.id === params.memberId), [params.memberId, profile.householdMembers]);
  const [name, setName] = useState(existing?.name ?? '');
  const [type, setType] = useState<'adult' | 'child'>(existing?.type ?? (params.type === 'child' ? 'child' : 'adult'));
  const [loves, setLoves] = useState(existing?.preferences ?? []);
  const [avoids, setAvoids] = useState(existing?.avoids ?? []);
  const [allergies, setAllergies] = useState(existing?.allergies ?? []);
  const [dietaryPreferences, setDietaryPreferences] = useState(existing?.dietaryPreferences ?? []);
  const [useMine, setUseMine] = useState(false);
  const [message, setMessage] = useState<string>();

  const copyMine = (enabled: boolean) => {
    setUseMine(enabled);
    if (!enabled) return;
    setLoves(profile.loves);
    setAvoids(profile.avoids);
    setAllergies(profile.allergies);
    setDietaryPreferences(profile.dietaryPreference && !profile.dietaryPreference.toLowerCase().includes('no dietary') ? [profile.dietaryPreference] : []);
  };
  const save = async () => {
    if (!name.trim()) { setMessage('Enter this household member’s name.'); return; }
    const member = { id: existing?.id ?? `local-${Date.now()}`, name: name.trim(), type, allergies, preferences: loves, avoids, dietaryPreferences };
    const members = existing ? profile.householdMembers.map(value => value.id === existing.id ? member : value) : [...profile.householdMembers, member];
    await update({ householdMembers: members });
    router.back();
  };

  return <OnboardingShell
    title={<Text>Set up a{"\n"}<Text style={styles.accent}>household member</Text></Text>}
    percent={88}
    footer={<Button label="Save member" onPress={() => void save()} />}
  >
    <Text style={styles.subtitle}>Add a few details to personalize their meals.</Text>
    <View style={styles.fieldGroup}><Text style={styles.label}>Name</Text><TextInput autoCapitalize="words" onChangeText={setName} placeholder="Name" placeholderTextColor={colors.muted} style={styles.input} value={name} /></View>
    <View style={styles.fieldGroup}><Text style={styles.label}>Adult or child</Text><View style={styles.segment}>{(['adult', 'child'] as const).map(value => <Pressable key={value} onPress={() => setType(value)} style={[styles.segmentButton, type === value && styles.segmentActive]}><Text style={[styles.segmentText, type === value && styles.segmentTextActive]}>{value === 'adult' ? 'Adult' : 'Child'}</Text></Pressable>)}</View></View>

    <ChoiceField label="Foods they love" values={loves} options={FOODS} onChange={setLoves} />
    <ChoiceField label="Foods they avoid" values={avoids} options={FOODS} onChange={setAvoids} />
    <ChoiceField label="Allergies or intolerances" values={allergies} options={ALLERGENS} onChange={setAllergies} />
    <ChoiceField label="Food preferences" values={dietaryPreferences} options={DIETS} onChange={setDietaryPreferences} />

    <View style={styles.copyCard}>
      <View style={styles.copyText}><Text style={styles.copyTitle}>Use my preferences</Text><Text style={styles.copyBody}>Copy your foods, dietary preferences, and allergies to save time.</Text></View>
      <Switch accessibilityLabel="Use my preferences" onValueChange={copyMine} thumbColor={colors.white} trackColor={{ false: colors.line, true: colors.coral }} value={useMine} />
    </View>
    <View style={styles.mascot}><MotionSlot name="onboarding-preferences" size={132} accessibilityLabel="CraveKeep mascot helping set up a household member" /></View>
    {message ? <Text accessibilityRole="alert" style={styles.error}>{message}</Text> : null}
  </OnboardingShell>;
}

const styles = StyleSheet.create({
  accent: { color: colors.coralDark },
  subtitle: { marginTop: -spacing.md, color: colors.muted, fontSize: 13 },
  fieldGroup: { gap: 6 },
  label: { ...typography.label, color: colors.charcoal, fontSize: 12 },
  input: { height: 48, paddingHorizontal: spacing.md, borderWidth: 1, borderColor: colors.line, borderRadius: radii.small, backgroundColor: colors.paperRaised, color: colors.charcoal, fontSize: 15 },
  segment: { flexDirection: 'row', padding: 3, borderWidth: 1, borderColor: colors.line, borderRadius: radii.small, backgroundColor: colors.paperRaised },
  segmentButton: { flex: 1, minHeight: 38, alignItems: 'center', justifyContent: 'center', borderRadius: radii.small },
  segmentActive: { borderWidth: 1, borderColor: colors.coral, backgroundColor: colors.coralSoft },
  segmentText: { color: colors.muted, fontWeight: '700' }, segmentTextActive: { color: colors.coralDark },
  selectBox: { minHeight: 48, padding: 8, flexDirection: 'row', alignItems: 'center', gap: 8, borderWidth: 1, borderColor: colors.line, borderRadius: radii.small, backgroundColor: colors.paperRaised },
  chips: { flex: 1, flexDirection: 'row', flexWrap: 'wrap', gap: 5 },
  valueChip: { flexDirection: 'row', alignItems: 'center', gap: 3, paddingHorizontal: 8, paddingVertical: 5, borderRadius: radii.round, backgroundColor: colors.background },
  valueChipText: { color: colors.charcoal, fontSize: 11, fontWeight: '700' },
  placeholder: { color: colors.muted, fontSize: 12 },
  options: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, padding: 8, borderWidth: 1, borderColor: colors.line, borderRadius: radii.small, backgroundColor: colors.paperRaised },
  option: { minHeight: 34, paddingHorizontal: 10, flexDirection: 'row', alignItems: 'center', gap: 5, borderWidth: 1, borderColor: colors.line, borderRadius: radii.round },
  optionSelected: { borderColor: colors.herb, backgroundColor: colors.herbSoft },
  optionText: { color: colors.charcoal, fontSize: 11, fontWeight: '700' }, optionTextSelected: { color: colors.herb },
  copyCard: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, padding: spacing.md, borderWidth: 1, borderColor: colors.line, borderRadius: radii.medium, backgroundColor: colors.paperRaised },
  copyText: { flex: 1 }, copyTitle: { color: colors.charcoal, fontWeight: '900' }, copyBody: { marginTop: 3, color: colors.muted, fontSize: 11, lineHeight: 15 },
  mascot: { alignItems: 'flex-end', marginTop: -8, marginBottom: -22 },
  error: { color: colors.coralDark, textAlign: 'center' }
});
