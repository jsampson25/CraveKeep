import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Image, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { OnboardingShell } from '@/components/onboarding-shell';
import { Button } from '@/components/ui';
import { foodCategories } from '@/data/food-catalog';
import { foodPhotos } from '@/components/onboarding-food-selection';
import { useOnboardingStore } from '@/data/onboarding-store';
import { colors, radii, spacing, typography } from '@/theme';
import healthyFood from '../../assets/onboarding/goal-food/goal-0.webp';
import mealPrepFood from '../../assets/onboarding/goal-food/goal-1.webp';
import weightFood from '../../assets/onboarding/goal-food/goal-2.webp';
import proteinFood from '../../assets/onboarding/goal-food/goal-3.webp';

type Step = 'profile' | 'goal' | 'diet' | 'loves' | 'avoids' | 'allergies';
const goals = [{ value: 'balanced', title: 'Eat healthier', detail: 'Better nutrition every day', icon: 'leaf', color: colors.herb, image: healthyFood }, { value: 'save-time', title: 'Save time', detail: 'Simplify my cooking', icon: 'time', color: '#D88A18', image: mealPrepFood }, { value: 'lose', title: 'Lose weight', detail: 'Reach my goal weight', icon: 'scale', color: '#7A4BA0', image: weightFood }, { value: 'muscle', title: 'Build muscle', detail: 'High-protein meals', icon: 'barbell', color: colors.coralDark, image: proteinFood }, { value: 'organize', title: 'Organize my recipes', detail: 'Keep everything in one place', icon: 'folder-open', color: '#2F70D0' }, { value: 'plan', title: 'Plan meals more easily', detail: 'Stress-free meal planning', icon: 'calendar', color: colors.coralDark }];
const diets = [{ value: 'Vegetarian', icon: 'vegetarian', color: colors.herb, image: require('../../assets/onboarding/preferences/pref-0.webp') }, { value: 'Vegan', icon: 'vegan', color: colors.herb, image: require('../../assets/onboarding/preferences/pref-1.webp') }, { value: 'Pescatarian', icon: 'pescatarian', color: '#2572A8', image: require('../../assets/onboarding/preferences/pref-2.webp') }, { value: 'Gluten-free', icon: 'gluten-free', color: '#D88A18', image: require('../../assets/onboarding/preferences/pref-3.webp') }, { value: 'Dairy-free', icon: 'dairy-free', color: '#7A4BA0', image: require('../../assets/onboarding/preferences/pref-4.webp') }, { value: 'Low carb', icon: 'low-carb', color: colors.coralDark, image: require('../../assets/onboarding/preferences/pref-5.webp') }];
const allergies = ['Peanuts', 'Tree nuts', 'Milk', 'Eggs', 'Wheat', 'Soy', 'Fish', 'Shellfish', 'Sesame'];
const allergyImages: Record<string, number> = {
  Peanuts: require('../../assets/onboarding/allergies/peanuts.webp'),
  'Tree nuts': require('../../assets/onboarding/allergies/tree-nuts.webp'),
  Milk: require('../../assets/onboarding/allergies/milk.webp'),
  Eggs: require('../../assets/onboarding/allergies/eggs.webp'),
  Wheat: require('../../assets/onboarding/allergies/wheat.webp'),
  Soy: require('../../assets/onboarding/allergies/soy.webp'),
  Fish: require('../../assets/onboarding/allergies/fish.webp'),
  Shellfish: require('../../assets/onboarding/allergies/shellfish.webp'),
  Sesame: require('../../assets/onboarding/allergies/sesame.webp'),
};

function DietaryIcon({ name, color }: { name: string; color: string }) {
  if (name === 'gluten-free') return <View style={[styles.symbolBadge, { borderColor: color }]}><Text style={[styles.symbolLetters, { color }]}>GF</Text><View style={[styles.symbolSlash, { backgroundColor: color }]} /></View>;
  if (name === 'dairy-free') return <View style={styles.symbolCanvas}><MaterialCommunityIcons color={color} name="bottle-tonic-outline" size={25} /><View style={[styles.symbolSlash, { backgroundColor: color }]} /></View>;
  if (name === 'low-carb') return <View style={styles.symbolCanvas}><MaterialCommunityIcons color={color} name="bread-slice-outline" size={26} /><View style={[styles.symbolSlash, { backgroundColor: color }]} /></View>;
  return <Ionicons color={color} name={name === 'vegetarian' ? 'leaf-outline' : name === 'vegan' ? 'nutrition-outline' : 'fish-outline'} size={24} />;
}

export default function HouseholdMemberScreen() {
  const { memberId, type } = useLocalSearchParams<{ memberId?: string; type?: 'adult' | 'child' }>();
  const { profile, update } = useOnboardingStore();
  const existing = useMemo(() => profile.householdMembers.find(member => member.id === memberId), [memberId, profile.householdMembers]);
  const [step, setStep] = useState<Step>('profile');
  const [name, setName] = useState(existing?.name ?? '');
  const [memberType, setMemberType] = useState<'adult' | 'child'>(existing?.type ?? (type === 'child' ? 'child' : 'adult'));
  const [goal, setGoal] = useState('');
  const [diet, setDiet] = useState(existing?.dietaryPreferences?.[0] ?? '');
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
    setMessage('');
    const member = { id: existing?.id ?? `local-${Date.now()}`, name: name.trim(), type: memberType, allergies: memberAllergies, preferences: loves, avoids, dietaryPreferences: diet === 'No preference' ? [] : [diet] };
    const members = existing ? profile.householdMembers.map(value => value.id === existing.id ? member : value) : [...profile.householdMembers, member];
    try {
      await update({ householdMembers: members });
      setSaving(false);
      router.replace('/onboarding/household');
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
    {step === 'goal' ? <View style={styles.grid}>{goals.map(item => <Pressable key={item.value} onPress={() => setGoal(item.value)} style={[styles.goalCard, goal === item.value && styles.selected]}><View style={styles.cardHeader}><View style={[styles.iconWrap, { backgroundColor: item.color + '18' }]}><Ionicons color={item.color} name={item.icon as any} size={22}/></View><Text style={styles.goalTitle}>{item.title}</Text></View><Text style={styles.detail}>{item.detail}</Text>{item.image ? <Image source={item.image} resizeMode="contain" style={styles.goalImage}/> : <View style={styles.emptyVisual}><Ionicons color={item.color} name={item.icon as any} size={45}/></View>}{goal === item.value ? <Ionicons color={colors.herb} name="checkmark-circle" size={21} style={styles.check}/> : null}</Pressable>)}</View> : null}
    {step === 'diet' ? <><View style={styles.grid}>{diets.map(item => <Pressable key={item.value} onPress={() => setDiet(item.value)} style={[styles.dietCard, diet === item.value && styles.selected]}><View style={styles.cardHeader}><View style={[styles.iconWrap, { backgroundColor: item.color + '18' }]}><DietaryIcon name={item.icon} color={item.color}/></View><Text style={styles.goalTitle}>{item.value}</Text></View><Image source={item.image} resizeMode="contain" style={styles.dietImage}/>{diet === item.value ? <Ionicons color={colors.herb} name="checkmark-circle" size={21} style={styles.check}/> : null}</Pressable>)}</View><Pressable onPress={() => setDiet(diet === 'No preference' ? '' : 'No preference')} style={[styles.none, diet === 'No preference' && styles.selected]}><Ionicons color={colors.coral} name="happy-outline" size={22}/><Text style={styles.cardText}>No preferences / Anything</Text></Pressable></> : null}
    {step === 'allergies' ? <><View style={styles.safety}><Ionicons color={colors.white} name="shield-checkmark" size={22}/><Text style={styles.safetyText}>Their safety matters. We’ll flag recipes that may contain these.</Text></View><View style={styles.allergyGrid}>{allergies.map(item => <Pressable key={item} onPress={() => setMemberAllergies(memberAllergies.includes(item) ? memberAllergies.filter(value => value !== item) : [...memberAllergies, item])} style={[styles.allergyCard, memberAllergies.includes(item) && styles.selected]}><Image accessibilityLabel={item} resizeMode="contain" source={allergyImages[item]} style={styles.allergyPhoto}/><Text style={styles.cardText}>{item}</Text>{memberAllergies.includes(item) ? <Ionicons color={colors.herb} name="checkmark-circle" size={19} style={styles.check}/> : null}</Pressable>)}</View><Pressable onPress={() => setMemberAllergies([])} style={[styles.none, !memberAllergies.length && styles.selected]}><Ionicons color={colors.herb} name={!memberAllergies.length ? 'checkmark-circle' : 'ellipse-outline'} size={22}/><Text style={styles.cardText}>No known allergies</Text></Pressable></> : null}
    {step === 'loves' || step === 'avoids' ? <><View style={styles.search}><Ionicons color={colors.muted} name="search" size={18}/><TextInput autoCapitalize="words" onChangeText={setQuery} placeholder="Search foods" placeholderTextColor={colors.muted} style={styles.searchInput} value={query}/></View>{filteredCategories.map(category => <View key={category.title} style={styles.foodSection}><View style={styles.sectionHeader}><Text style={styles.sectionTitle}>{category.title}</Text><Text style={styles.sectionCount}>{category.items.filter(item => current.includes(item)).length ? category.items.filter(item => current.includes(item)).length + ' selected' : ''}</Text></View><View style={styles.grid}>{category.items.map(item => <Pressable key={item} onPress={() => toggle(item)} style={[styles.food, current.includes(item) && styles.selected]}>{foodPhotos[item] ? <Image accessibilityLabel={item} resizeMode="contain" source={foodPhotos[item]} style={styles.foodPhoto}/> : null}<Text numberOfLines={2} style={styles.cardText}>{item}</Text>{current.includes(item) ? <Ionicons color={step === 'loves' ? colors.herb : colors.coral} name="checkmark-circle" size={19}/> : null}</Pressable>)}</View></View>)}</> : null}
    {message ? <Text style={styles.error}>{message}</Text> : null}
  </OnboardingShell>;
}
const styles=StyleSheet.create({accent:{color:colors.coralDark},subtitle:{marginTop:-spacing.md,color:colors.muted,fontSize:13,lineHeight:19},label:{...typography.label,color:colors.charcoal,fontSize:12},input:{height:48,paddingHorizontal:14,borderWidth:1,borderColor:colors.line,borderRadius:radii.small,color:colors.charcoal,backgroundColor:colors.paperRaised,fontSize:15},segment:{flexDirection:'row',gap:8},segmentButton:{flex:1,minHeight:46,alignItems:'center',justifyContent:'center',borderWidth:1,borderColor:colors.line,borderRadius:radii.small,backgroundColor:colors.paperRaised},grid:{flexDirection:'row',flexWrap:'wrap',gap:8},goalCard:{width:'48.4%',height:212,padding:12,overflow:'hidden',borderWidth:1.5,borderColor:colors.line,borderRadius:radii.medium,backgroundColor:'#FFFFFF'},dietCard:{width:'48.5%',height:164,padding:10,borderWidth:1.5,borderColor:colors.line,borderRadius:radii.medium,backgroundColor:'#FFFFFF',overflow:'hidden'},cardHeader:{height:40,paddingRight:20,flexDirection:'row',alignItems:'center',gap:8},iconWrap:{width:36,height:36,borderRadius:11,alignItems:'center',justifyContent:'center',flexShrink:0},goalTitle:{flex:1,color:colors.charcoal,...typography.label,fontSize:15,lineHeight:17},detail:{minHeight:31,marginTop:5,color:'#536179',fontSize:11,lineHeight:15},goalImage:{width:'100%',height:102,marginTop:2},dietImage:{width:'100%',height:101,marginTop:3},emptyVisual:{width:'100%',height:102,alignItems:'center',justifyContent:'center'},symbolCanvas:{width:27,height:27,alignItems:'center',justifyContent:'center'},symbolBadge:{width:25,height:25,borderRadius:13,borderWidth:1.8,alignItems:'center',justifyContent:'center'},symbolLetters:{fontSize:10,fontWeight:'900'},symbolSlash:{position:'absolute',width:2,height:31,transform:[{rotate:'45deg'}]},check:{position:'absolute',right:7,top:7,backgroundColor:'#FFFFFF',borderRadius:11},card:{width:'48%',minHeight:58,padding:12,flexDirection:'row',alignItems:'center',justifyContent:'space-between',gap:6,borderWidth:1,borderColor:colors.line,borderRadius:radii.medium,backgroundColor:colors.paperRaised},food:{width:'31.5%',minHeight:104,padding:7,alignItems:'center',justifyContent:'flex-end',gap:4,borderWidth:1,borderColor:colors.line,borderRadius:12,backgroundColor:'#FFFFFF'},selected:{borderColor:colors.herb,backgroundColor:colors.herbSoft},cardText:{flex:1,color:colors.charcoal,fontSize:12,fontWeight:'800',textAlign:'center'},safety:{padding:12,flexDirection:'row',alignItems:'center',gap:9,borderRadius:radii.small,backgroundColor:colors.coral},safetyText:{flex:1,color:colors.white,fontSize:12,lineHeight:17},allergyGrid:{flexDirection:'row',flexWrap:'wrap',gap:8},allergyCard:{width:'31.5%',height:112,padding:7,alignItems:'center',justifyContent:'flex-end',gap:3,borderWidth:1,borderColor:colors.line,borderRadius:12,backgroundColor:'#FFFFFF',overflow:'hidden'},allergyPhoto:{width:70,height:70},check:{position:'absolute',right:4,top:4,backgroundColor:'#FFFFFF',borderRadius:9},none:{minHeight:52,paddingHorizontal:13,flexDirection:'row',alignItems:'center',gap:9,borderWidth:1,borderColor:colors.line,borderRadius:radii.small,backgroundColor:'#FFFFFF'},foodSection:{gap:7},sectionHeader:{flexDirection:'row',alignItems:'center',justifyContent:'space-between'},sectionTitle:{...typography.label,color:colors.charcoal,fontSize:14},sectionCount:{color:colors.coralDark,fontSize:10,fontWeight:'700'},search:{minHeight:46,paddingHorizontal:12,flexDirection:'row',alignItems:'center',gap:8,borderWidth:1,borderColor:colors.line,borderRadius:radii.small,backgroundColor:'#FFFFFF'},foodPhoto:{width:70,height:68},foodPhotoPlaceholder:{width:70,height:68,alignItems:'center',justifyContent:'center'},searchInput:{flex:1,color:colors.charcoal,fontSize:14},optionText:{color:colors.charcoal,fontWeight:'800'},error:{color:colors.coralDark,textAlign:'center'}});
