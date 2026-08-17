import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { OnboardingShell } from '@/components/onboarding-shell';
import { MotionSlot } from '@/components/animations/MotionSlot';
import { Button } from '@/components/ui';
import { useOnboardingStore } from '@/data/onboarding-store';
import { colors, radii, spacing, typography } from '@/theme';

const rows = [
  { key: 'calories', label: 'Calories', unit: 'kcal', color: '#718786' },
  { key: 'protein', label: 'Protein', unit: 'g', color: '#287CB7' },
  { key: 'carbs', label: 'Carbs', unit: 'g', color: colors.herb },
  { key: 'fat', label: 'Fat', unit: 'g', color: '#D69021' },
  { key: 'fiber', label: 'Fiber', unit: 'g', color: '#944A91' },
] as const;

const presets = [
  { name: 'Balanced', detail: 'A flexible everyday starting point', calories: 1900, protein: '130 g', carbs: '220 g', fat: '60 g', fiber: '28 g' },
  { name: 'Higher protein', detail: 'Supports fullness and muscle goals', calories: 1900, protein: '155 g', carbs: '190 g', fat: '58 g', fiber: '30 g' },
  { name: 'Lower carb', detail: 'More protein and healthy fats', calories: 1900, protein: '145 g', carbs: '145 g', fat: '82 g', fiber: '28 g' },
] as const;

export default function NutritionGoalsScreen() {
  const { profile, update, saveNutritionGoals, saving, error } = useOnboardingStore();
  const [mode, setMode] = useState<'manual' | 'quick'>('manual');
  const [message, setMessage] = useState<string>();

  const setTarget = (key: typeof rows[number]['key'], value: string) => {
    if (key === 'calories') void update({ calories: Number(value.replace(/\D/g, '')) || 0, calculationMode: 'manual' });
    else void update({ [key]: `${value.replace(/\D/g, '')} g`, calculationMode: 'manual' });
  };
  const usePreset = async (preset: typeof presets[number]) => {
    await update({ calories: preset.calories, protein: preset.protein, carbs: preset.carbs, fat: preset.fat, fiber: preset.fiber, calculationMode: 'calculated' });
    setMessage(`${preset.name} targets selected. You can still adjust them manually.`);
    setMode('manual');
  };
  const next = async () => {
    setMessage('Saving your nutrition goals…');
    const saveError = await saveNutritionGoals();
    if (!saveError) router.push('/onboarding/settings');
    else setMessage(saveError);
  };

  return <OnboardingShell
    title={<Text>Set your <Text style={styles.accent}>nutrition</Text>{'\n'}goals</Text>}
    percent={94}
    footer={<Button disabled={saving} label={saving ? 'Saving…' : 'Save & continue'} onPress={() => void next()} />}
  >
    <View style={styles.tabs}>
      <Pressable accessibilityRole="tab" accessibilityState={{ selected: mode === 'manual' }} onPress={() => setMode('manual')} style={[styles.tab, mode === 'manual' && styles.tabActive]}><Text style={[styles.tabText, mode === 'manual' && styles.tabTextActive]}>Manual targets</Text></Pressable>
      <Pressable accessibilityRole="tab" accessibilityState={{ selected: mode === 'quick' }} onPress={() => setMode('quick')} style={[styles.tab, mode === 'quick' && styles.tabActive]}><Text style={[styles.tabText, mode === 'quick' && styles.tabTextActive]}>Quick options</Text></Pressable>
    </View>

    {mode === 'manual' ? <View>
      <View style={styles.sectionRow}><Text style={styles.section}>Daily targets</Text><Text style={styles.learn}>Learn more</Text></View>
      <View style={styles.targetCard}>{rows.map((row, index) => {
        const value = row.key === 'calories' ? String(profile.calories) : profile[row.key].replace(/\D/g, '');
        return <View key={row.key} style={[styles.targetRow, index === rows.length - 1 && styles.lastRow]}>
          <View style={[styles.dot, { backgroundColor: row.color }]} /><Text style={styles.targetLabel}>{row.label}</Text>
          <TextInput accessibilityLabel={`${row.label} daily target`} keyboardType="number-pad" onChangeText={text => setTarget(row.key, text)} selectTextOnFocus style={styles.targetInput} value={value} />
          <Text style={styles.unit}>{row.unit}</Text>
        </View>;
      })}</View>
    </View> : <View style={styles.presetList}>
      <Text style={styles.quickIntro}>Choose a starting point. You can fine-tune every number afterward.</Text>
      {presets.map(preset => <Pressable key={preset.name} onPress={() => void usePreset(preset)} style={styles.preset}>
        <View style={styles.presetIcon}><Ionicons color={colors.coralDark} name={preset.name === 'Higher protein' ? 'barbell-outline' : preset.name === 'Lower carb' ? 'leaf-outline' : 'restaurant-outline'} size={22} /></View>
        <View style={styles.presetCopy}><Text style={styles.presetName}>{preset.name}</Text><Text style={styles.presetDetail}>{preset.detail}</Text></View>
        <Ionicons color={colors.muted} name="chevron-forward" size={19} />
      </Pressable>)}
    </View>}

    <View style={styles.tip}>
      <Ionicons color={colors.herb} name="leaf-outline" size={25} />
      <Text style={styles.tipText}>These targets help us build meals that fit you.</Text>
      <MotionSlot name="onboarding-preferences" size={76} accessibilityLabel="CraveKeep mascot holding a nutrition card" />
    </View>
    {message ? <Text style={styles.message}>{message}</Text> : null}
    {error ? <Text accessibilityRole="alert" style={styles.error}>{error}</Text> : null}
    <Text style={styles.disclaimer}>Targets are general wellness estimates and can be changed anytime. They are not medical advice.</Text>
  </OnboardingShell>;
}

const styles = StyleSheet.create({
  accent: { color: colors.coralDark },
  tabs: { flexDirection: 'row', gap: 6 },
  tab: { flex: 1, minHeight: 40, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.line, borderRadius: radii.small, backgroundColor: colors.paperRaised },
  tabActive: { borderColor: colors.coral, backgroundColor: '#FFF0ED' },
  tabText: { color: colors.muted, fontSize: 12, fontWeight: '700' }, tabTextActive: { color: colors.coralDark },
  sectionRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.sm },
  section: { ...typography.label, color: colors.charcoal, fontSize: 14 }, learn: { color: colors.coralDark, fontSize: 11, fontWeight: '700' },
  targetCard: { overflow: 'hidden', borderWidth: 1, borderColor: colors.line, borderRadius: radii.medium, backgroundColor: colors.paperRaised },
  targetRow: { minHeight: 51, paddingHorizontal: spacing.md, flexDirection: 'row', alignItems: 'center', borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.line },
  lastRow: { borderBottomWidth: 0 }, dot: { width: 8, height: 8, marginRight: 10, borderRadius: 4 },
  targetLabel: { flex: 1, color: colors.charcoal, fontSize: 13, fontWeight: '700' },
  targetInput: { minWidth: 72, paddingVertical: 8, color: colors.charcoal, fontSize: 15, fontWeight: '900', textAlign: 'right' },
  unit: { width: 35, marginLeft: 5, color: colors.muted, fontSize: 11 },
  presetList: { gap: spacing.sm }, quickIntro: { color: colors.muted, fontSize: 13, lineHeight: 18 },
  preset: { minHeight: 72, padding: spacing.sm, flexDirection: 'row', alignItems: 'center', gap: 10, borderWidth: 1, borderColor: colors.line, borderRadius: radii.medium, backgroundColor: colors.paperRaised },
  presetIcon: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFF0ED' },
  presetCopy: { flex: 1 }, presetName: { color: colors.charcoal, fontWeight: '900' }, presetDetail: { marginTop: 3, color: colors.muted, fontSize: 11 },
  tip: { minHeight: 112, paddingLeft: spacing.md, flexDirection: 'row', alignItems: 'center', gap: 9, overflow: 'hidden', borderWidth: 1, borderColor: '#E8C697', borderRadius: radii.medium, backgroundColor: '#FFF8EE' },
  tipText: { flex: 1, color: colors.charcoal, fontSize: 12, lineHeight: 17 },
  message: { padding: 9, color: colors.herb, textAlign: 'center', backgroundColor: colors.herbSoft, borderRadius: radii.small },
  error: { color: colors.coralDark, textAlign: 'center' },
  disclaimer: { color: colors.muted, fontSize: 10, lineHeight: 14, textAlign: 'center' }
});
