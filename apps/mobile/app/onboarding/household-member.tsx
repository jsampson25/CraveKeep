import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Image, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { OnboardingShell } from '@/components/onboarding-shell';
import { Button } from '@/components/ui';
import { foodCategories } from '@/data/food-catalog';
import { foodPhotos } from '@/components/onboarding-food-selection';
import { useOnboardingStore } from '@/data/onboarding-store';
import { colors, radii, spacing, typography } from '@/theme';

type Step = 'profile' | 'goal' | 'diet' | 'loves' | 'avoids' | 'allergies';
const goals = ['Eat healthier', 'Lose weight', 'Build muscle', 'Save time', 'Plan meals', 'Try new recipes'];
const diets = ['No preference', 'Vegetarian', 'Vegan', 'Pescatarian', 'Gluten-free', 'Dairy-free', 'Low carb'];
const allergies = ['Peanuts', 'Tree nuts', 'Milk', 'Eggs', 'Wheat', 'Soy', 'Fish', 'Shellfish', 'Sesame'];

export default function HouseholdMemberScreen() {
  const { memberId, type } = useLocalSearchParams<{ memberId?: string; type?: 'adult' | 'child' }>();
  const { profile, update } = useOnboardingStore();
  const existing = useMemo(() => profile.householdMembers.find(member => member.id === memberId), [memberId, profile.householdMembers]);
  const [step, setStep] = useState<Step>('profile');
  const [name, setName] = useState(existing?.name ?? '');
  const [memberType, setMemberType] = useState<'adult' | 'child'>(existing?.type ?? (type === 'child' ? 'child' : 'adult'));
  const [goal, setGoal] = useState('');
  const [diet, setDiet] = useState(existing?.dietaryPreferences?.[0] ?? 'No preference');
  const [loves, setLoves] = useState(existing?.preferences ?? []);
  const [avoids, setAvoids] = useState(existing?.avoids ?? []);
  const [memberAllergies, setMemberAllergies] = useState(existing?.allergies ?? []);
  const [query, setQuery] = useState('');
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => setQuery(''), [step]);
  const stepIndex = ['profile', 'goal', 'diet', 'loves', 'avoids', 'allergies'].indexOf(step);
  const filteredCategories = useMemo(() => foodCategories.map(category => ({ ...category, items: category.items.filter(item => !query.trim() || item.toLowerCase().includes(query.trim().toLowerCase())) })).filter(category => category.items.length), [query]);
  const current = step === 'loves' ? loves : avoids;
  const toggle = (value: string) => {
    const next = current.includes(value) ? current.filter(item => item !== value) : [...current, value];
    if (step === 'loves') setLoves(next); else setAvoids(next);
  };
  const next = () => {
    setMessage('');
    const steps: Step[] = ['profile', 'goal', 'diet', 'loves', 'avoids', 'allergies'];
    if (step === 'profile' && !name.trim()) { setMessage('Enter their name to continue.'); return; }
    if (stepIndex < steps.length - 1) setStep(steps[stepIndex + 1]); else void save();
  };
  const save = async () => {
    if (saving) return;
    setSaving(true);
    setMessage('Saving member…');
    const member = { id: existing?.id ?? `local-${Date.now()}`, name: name.trim(), type: memberType, allergies: memberAllergies, preferences: loves, avoids, dietaryPreferences: diet === 'No preference' ? [] : [diet] };
    const members = existing ? profile.householdMembers.map(value => value.id === existing.id ? member : value) : [...profile.householdMembers, member];
    try {
      await update({ householdMembers: members });
      router.back();
    } catch (reason) {
      setSaving(false);
      setMessage(reason instanceof Error ? reason.message : 'We could not save this member. Please try again.');
    }
  };
  const title = step === 'profile' ? <>Set up a <Text style={styles.accent}>household member</Text></> :
    step === 'goal' ? <>What is their <Text style={styles.accent}>main goal?</Text></> :
    step === 'diet' ? <>Their food <Text style={styles.accent}>preferences</Text></> :
    step === 'loves' ? <>What foods do they <Text style={styles.accent}>love?</Text></> :
    step === 'avoids' ? <>Anything they <Text style={styles.accent}>don’t like?</Text></> :
    <>Any <Text style={styles.accent}>allergies?</Text></>;
  return <OnboardingShell title={title} percent={Math.round(((stepIndex + 1) / 6) * 100)} footer={<Button disabled={saving} label={stepIndex === 5 ? (saving ? 'Saving…' : 'Save member') : 'Continue'} onPress={next} />}>
    <Text style={styles.subtitle}>Use the same preferences workflow to personalize meals for {name || 'them'}.</Text>
    {step === 'profile' ? <><Text style={styles.label}>Name</Text><TextInput autoCapitalize="words" onChangeText={setName} placeholder="Their name" placeholderTextColor={colors.muted} style={styles.input} value={name}/><Text style={styles.label}>They are</Text><View style={styles.segment}>{(['adult', 'child'] as const).map(value => <Pressable key={value} onPress={() => setMemberType(value)} style={[styles.segmentButton, memberType === value && styles.selected]}><Text style={styles.optionText}>{value === 'adult' ? 'Adult' : 'Child'}</Text></Pressable>)}</View></> : null}
    {step === 'goal' ? <View style={styles.grid}>{goals.map(item => <Pressable key={item} onPress={() => setGoal(item)} style={[styles.card, goal === item && styles.selected]}><Text style={styles.cardText}>{item}</Text>{goal === item ? <Ionicons color={colors.herb} name="checkmark-circle" size={20}/> : null}</Pressable>)}</View> : null}
    {step === 'diet' ? <View style={styles.grid}>{diets.map(item => <Pressable key={item} onPress={() => setDiet(item)} style={[styles.card, diet === item && styles.selected]}><Text style={styles.cardText}>{item}</Text>{diet === item ? <Ionicons color={colors.herb} name="checkmark-circle" size={20}/> : null}</Pressable>)}</View> : null}
    {step === 'allergies' ? <View style={styles.grid}>{allergies.map(item => <Pressable key={item} onPress={() => setMemberAllergies(memberAllergies.includes(item) ? memberAllergies.filter(value => value !== item) : [...memberAllergies, item])} style={[styles.card, memberAllergies.includes(item) && styles.selected]}><Text style={styles.cardText}>{item}</Text>{memberAllergies.includes(item) ? <Ionicons color={colors.herb} name="checkmark-circle" size={20}/> : null}</Pressable>)}</View> : null}
    {step === 'loves' || step === 'avoids' ? <><View style={styles.search}><Ionicons color={colors.muted} name="search" size={18}/><TextInput autoCapitalize="words" onChangeText={setQuery} placeholder="Search foods" placeholderTextColor={colors.muted} style={styles.searchInput} value={query}/></View>{filteredCategories.map(category => <View key={category.title} style={styles.foodSection}><View style={styles.sectionHeader}><Text style={styles.sectionTitle}>{category.title}</Text><Text style={styles.sectionCount}>{category.items.filter(item => current.includes(item)).length ? category.items.filter(item => current.includes(item)).length + ' selected' : ''}</Text></View><View style={styles.grid}>{category.items.map(item => <Pressable key={item} onPress={() => toggle(item)} style={[styles.food, current.includes(item) && styles.selected]}>{foodPhotos[item] ? <Image accessibilityLabel={item} resizeMode="contain" source={foodPhotos[item]} style={styles.foodPhoto}/> : null}<Text numberOfLines={2} style={styles.cardText}>{item}</Text>{current.includes(item) ? <Ionicons color={step === 'loves' ? colors.herb : colors.coral} name="checkmark-circle" size={19}/> : null}</Pressable>)}</View></View>)}</> : null}
    {message ? <Text style={styles.error}>{message}</Text> : null}
  </OnboardingShell>;
}
const styles=StyleSheet.create({accent:{color:colors.coralDark},subtitle:{marginTop:-spacing.md,color:colors.muted,fontSize:13,lineHeight:19},label:{...typography.label,color:colors.charcoal,fontSize:12},input:{height:48,paddingHorizontal:14,borderWidth:1,borderColor:colors.line,borderRadius:radii.small,color:colors.charcoal,backgroundColor:colors.paperRaised,fontSize:15},segment:{flexDirection:'row',gap:8},segmentButton:{flex:1,minHeight:46,alignItems:'center',justifyContent:'center',borderWidth:1,borderColor:colors.line,borderRadius:radii.small,backgroundColor:colors.paperRaised},grid:{flexDirection:'row',flexWrap:'wrap',gap:8},card:{width:'48%',minHeight:58,padding:12,flexDirection:'row',alignItems:'center',justifyContent:'space-between',gap:6,borderWidth:1,borderColor:colors.line,borderRadius:radii.medium,backgroundColor:colors.paperRaised},food:{width:'31.5%',minHeight:104,padding:7,alignItems:'center',justifyContent:'flex-end',gap:4,borderWidth:1,borderColor:colors.line,borderRadius:12,backgroundColor:'#FFFFFF'},selected:{borderColor:colors.herb,backgroundColor:colors.herbSoft},cardText:{flex:1,color:colors.charcoal,fontSize:12,fontWeight:'800',textAlign:'center'},foodSection:{gap:7},sectionHeader:{flexDirection:'row',alignItems:'center',justifyContent:'space-between'},sectionTitle:{...typography.label,color:colors.charcoal,fontSize:14},sectionCount:{color:colors.coralDark,fontSize:10,fontWeight:'700'},search:{minHeight:46,paddingHorizontal:12,flexDirection:'row',alignItems:'center',gap:8,borderWidth:1,borderColor:colors.line,borderRadius:radii.small,backgroundColor:'#FFFFFF'},foodPhoto:{width:70,height:68},foodPhotoPlaceholder:{width:70,height:68,alignItems:'center',justifyContent:'center'},searchInput:{flex:1,color:colors.charcoal,fontSize:14},optionText:{color:colors.charcoal,fontWeight:'800'},error:{color:colors.coralDark,textAlign:'center'}});
