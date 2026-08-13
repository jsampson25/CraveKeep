import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { OnboardingShell } from '@/components/onboarding-shell';
import { Button } from '@/components/ui';
import { useOnboardingStore } from '@/data/onboarding-store';
import { colors, radii, spacing, typography } from '@/theme';

type Preference = 'loves' | 'avoids' | 'neverSuggest';
const groups = [
  { title: 'Proteins', items: [['Chicken','🍗'],['Beef','🥩'],['Turkey','🦃'],['Salmon','🐟'],['Shrimp','🍤'],['Eggs','🥚'],['Tofu','🫘']] },
  { title: 'Vegetables', items: [['Spinach','🥬'],['Broccoli','🥦'],['Bell peppers','🫑'],['Mushrooms','🍄'],['Tomatoes','🍅'],['Carrots','🥕'],['Eggplant','🍆']] },
  { title: 'Fruits & flavors', items: [['Lemon','🍋'],['Avocado','🥑'],['Berries','🫐'],['Apple','🍎'],['Garlic','🧄'],['Cilantro','🌿'],['Olives','🫒']] }
] as const;
const diets = ['None','Vegetarian','Vegan','Pescatarian','Gluten-free','Low carb'];
const times = ['Any','15 minutes','30 minutes','45 minutes'];
const skills = ['Beginner','Intermediate','Confident'];
const applianceOptions = ['Oven','Air fryer','Slow cooker','Instant Pot','Grill','Blender'];
const preferenceLabels: Record<Preference,string> = { loves: 'Love', avoids: 'Avoid', neverSuggest: 'Never suggest' };

export default function FoodProfileScreen() {
  const { profile, update, saveFoodProfile, saving, error } = useOnboardingStore();
  const [mode, setMode] = useState<Preference>('loves'); const [allergy, setAllergy] = useState('');
  const selectFood = (item: string) => {
    const otherKeys = (['loves','avoids','neverSuggest'] as Preference[]).filter(key => key !== mode);
    const selected = profile[mode].includes(item);
    void update({ [mode]: selected ? profile[mode].filter(value => value !== item) : [...profile[mode], item], ...Object.fromEntries(otherKeys.map(key => [key, profile[key].filter(value => value !== item)])) });
  };
  const addAllergy = () => { const value = allergy.trim(); if (value && !profile.allergies.some(item => item.toLowerCase() === value.toLowerCase())) void update({ allergies: [...profile.allergies, value] }); setAllergy(''); };
  const toggleAppliance = (item: string) => { const values = profile.appliances.split(',').map(value => value.trim()).filter(Boolean); void update({ appliances: (values.includes(item) ? values.filter(value => value !== item) : [...values, item]).join(', ') }); };
  const next = async () => { if (!await saveFoodProfile()) router.push('/onboarding/nutrition-goals'); };
  return <OnboardingShell title="Your food profile" percent={65} footer={<Button disabled={saving} label={saving ? 'Saving…' : 'Save and continue'} onPress={() => void next()} />}>
    <View><Text style={styles.hero}>Make every recipe feel like yours.</Text><Text style={styles.hint}>Choose an action, then tap foods. You can change this anytime.</Text></View>
    <View style={styles.modeRow}>{(['loves','avoids','neverSuggest'] as Preference[]).map(key => <Pressable key={key} onPress={() => setMode(key)} style={[styles.mode, mode === key && styles.modeActive]}><Text style={[styles.modeText, mode === key && styles.modeTextActive]}>{preferenceLabels[key]}</Text></Pressable>)}</View>
    {groups.map(group => <View key={group.title}><Text style={styles.section}>{group.title}</Text><View style={styles.grid}>{group.items.map(([item, icon]) => { const state = (['loves','avoids','neverSuggest'] as Preference[]).find(key => profile[key].includes(item)); return <Pressable accessibilityLabel={`${item}: ${state ? preferenceLabels[state] : 'not selected'}`} key={item} onPress={() => selectFood(item)} style={[styles.food, state && styles.foodSelected, state === 'neverSuggest' && styles.foodNever]}><Text style={styles.emoji}>{icon}</Text><Text style={styles.foodName}>{item}</Text>{state ? <View style={styles.badge}><Text style={styles.badgeText}>{state === 'loves' ? '♥' : state === 'avoids' ? '–' : '×'}</Text></View> : null}</Pressable>; })}</View></View>)}
    <View style={styles.card}><Text style={styles.section}>Allergies & intolerances</Text><Text style={styles.hint}>These are treated as safety information, not dislikes.</Text><View style={styles.inputRow}><TextInput autoCapitalize="words" onChangeText={setAllergy} onSubmitEditing={addAllergy} placeholder="Add an allergy" placeholderTextColor={colors.muted} style={styles.input} value={allergy}/><Pressable accessibilityLabel="Add allergy" onPress={addAllergy} style={styles.add}><Ionicons color={colors.white} name="add" size={22}/></Pressable></View><View style={styles.chips}>{profile.allergies.map(item => <Pressable key={item} onPress={() => void update({ allergies: profile.allergies.filter(value => value !== item) })} style={styles.alertChip}><Text style={styles.alertText}>{item}  ×</Text></Pressable>)}</View></View>
    <Choice title="Dietary preference" options={diets} selected={profile.dietaryPreference} onSelect={dietaryPreference => void update({ dietaryPreference })}/>
    <Choice title="Typical cooking time" options={times} selected={profile.cookingTime} onSelect={cookingTime => void update({ cookingTime })}/>
    <Choice title="Cooking confidence" options={skills} selected={profile.skill} onSelect={skill => void update({ skill })}/>
    <View><Text style={styles.section}>Appliances you use</Text><View style={styles.chips}>{applianceOptions.map(item => <Chip key={item} label={item} selected={profile.appliances.split(',').map(value => value.trim()).includes(item)} onPress={() => toggleAppliance(item)}/>)}</View></View>
    {error ? <Text accessibilityRole="alert" style={styles.error}>{error}</Text> : null}
  </OnboardingShell>;
}

function Choice({ title, options, selected, onSelect }: { title: string; options: string[]; selected: string; onSelect: (value: string) => void }) { return <View><Text style={styles.section}>{title}</Text><View style={styles.chips}>{options.map(item => <Chip key={item} label={item} selected={selected === item} onPress={() => onSelect(item)}/>)}</View></View>; }
function Chip({ label, selected, onPress }: { label: string; selected: boolean; onPress: () => void }) { return <Pressable onPress={onPress} style={[styles.chip, selected && styles.chipSelected]}><Text style={[styles.chipText, selected && styles.chipTextSelected]}>{label}</Text></Pressable>; }

const styles=StyleSheet.create({hero:{...typography.title,fontSize:25,color:colors.charcoal},hint:{color:colors.muted,lineHeight:19},modeRow:{flexDirection:'row',padding:4,borderRadius:radii.medium,backgroundColor:'#EEE7DC'},mode:{flex:1,minHeight:42,alignItems:'center',justifyContent:'center',borderRadius:12},modeActive:{backgroundColor:colors.charcoal},modeText:{fontWeight:'700',fontSize:12,color:colors.muted},modeTextActive:{color:colors.white},section:{marginBottom:spacing.sm,...typography.label,fontSize:16,color:colors.charcoal},grid:{flexDirection:'row',flexWrap:'wrap',gap:8},food:{width:'31.5%',minHeight:84,alignItems:'center',justifyContent:'center',borderWidth:1,borderColor:colors.line,borderRadius:radii.medium,backgroundColor:colors.paperRaised,position:'relative'},foodSelected:{borderColor:colors.herb,backgroundColor:colors.herbSoft},foodNever:{borderColor:colors.coral},emoji:{fontSize:29},foodName:{marginTop:4,fontWeight:'700',fontSize:11,textAlign:'center'},badge:{position:'absolute',right:6,top:6,width:20,height:20,borderRadius:10,alignItems:'center',justifyContent:'center',backgroundColor:colors.herb},badgeText:{color:colors.white,fontWeight:'900'},card:{padding:spacing.md,borderWidth:1,borderColor:'#E5B65C',borderRadius:radii.medium,backgroundColor:colors.paperRaised,gap:spacing.sm},inputRow:{flexDirection:'row',gap:8},input:{flex:1,minHeight:46,paddingHorizontal:12,borderWidth:1,borderColor:colors.line,borderRadius:radii.small,color:colors.charcoal},add:{width:46,alignItems:'center',justifyContent:'center',borderRadius:radii.small,backgroundColor:colors.coral},chips:{flexDirection:'row',flexWrap:'wrap',gap:8},chip:{paddingHorizontal:13,paddingVertical:10,borderWidth:1,borderColor:colors.line,borderRadius:radii.round,backgroundColor:colors.paperRaised},chipSelected:{borderColor:colors.herb,backgroundColor:colors.herbSoft},chipText:{color:colors.charcoal,fontSize:12,fontWeight:'700'},chipTextSelected:{color:colors.herb},alertChip:{paddingHorizontal:12,paddingVertical:8,borderRadius:radii.round,backgroundColor:'#FCE4DF'},alertText:{color:colors.coralDark,fontSize:12,fontWeight:'800'},error:{color:colors.coralDark,textAlign:'center'}});
