import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Image, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { OnboardingShell } from '@/components/onboarding-shell';
import { Button } from '@/components/ui';
import { useOnboardingStore } from '@/data/onboarding-store';
import { colors, radii, spacing, typography } from '@/theme';
import nutritionMascot from '../../assets/onboarding/mascots/main-goal-pointer.webp';

type Step = 'about' | 'activity' | 'recommended';
const goals = [{ value: 'lose', label: 'Lose weight', icon: 'trending-down-outline' }, { value: 'maintain', label: 'Maintain weight', icon: 'scale-outline' }, { value: 'gain', label: 'Gain weight', icon: 'trending-up-outline' }, { value: 'muscle', label: 'Build muscle', icon: 'barbell-outline' }];
const activities = ['Mostly seated', 'Lightly active', 'Moderately active', 'Very active', 'Highly active'];
const multiplier = [1.2, 1.375, 1.55, 1.725, 1.9];

export default function NutritionGoalsScreen() {
  const { profile, update, saveNutritionGoals, saving, error } = useOnboardingStore();
  const [step, setStep] = useState<Step>('about');
  const [unit, setUnit] = useState<'US' | 'Metric'>('US');
  const [birthDate, setBirthDate] = useState('');
  const [sex, setSex] = useState<'female' | 'male' | undefined>(profile.sexForCalculation);
  const [height, setHeight] = useState(profile.heightCm ? String(Math.round(profile.heightCm)) : '');
  const [heightFeet, setHeightFeet] = useState(profile.heightCm ? String(Math.floor(profile.heightCm / 30.48)) : '');
  const [heightInches, setHeightInches] = useState(profile.heightCm ? String(Math.round((profile.heightCm / 2.54) % 12)) : '');
  const [weight, setWeight] = useState(profile.currentWeightKg ? String(Math.round(profile.currentWeightKg * 2.20462)) : '');
  const [targetWeight, setTargetWeight] = useState(profile.targetWeightKg ? String(Math.round(profile.targetWeightKg * 2.20462)) : '');
  const [goal, setGoal] = useState(profile.goal === 'balanced' ? 'maintain' : profile.goal === 'save-time' ? 'lose' : profile.goal || 'lose');
  const [activity, setActivity] = useState(profile.activityLevel || activities[2]);
  const [pace, setPace] = useState('Moderate');
  const [customize, setCustomize] = useState(false);
  const [customCalories, setCustomCalories] = useState('');
  const [customProtein, setCustomProtein] = useState('');
  const [customCarbs, setCustomCarbs] = useState('');
  const [customFat, setCustomFat] = useState('');
  const [message, setMessage] = useState('');

  const age = useMemo(() => { const match = birthDate.match(/(\d{4})/); return match ? Math.max(13, new Date().getFullYear() - Number(match[1])) : profile.age ?? 35; }, [birthDate, profile.age]);
  const recommendation = useMemo(() => {
    const pounds = Number(weight) || (profile.currentWeightKg ? profile.currentWeightKg * 2.20462 : 191);
    const inches = unit === 'US' ? ((Number(heightFeet) || 5) * 12 + (Number(heightInches) || 10)) : ((Number(height) || 178) / 2.54);
    const base = sex === 'female' ? 10 * (pounds / 2.20462) + 6.25 * (inches * 2.54) - 5 * age - 161 : 10 * (pounds / 2.20462) + 6.25 * (inches * 2.54) - 5 * age + 5;
    let calories = Math.round(base * multiplier[Math.max(0, activities.indexOf(activity))]);
    if (goal === 'lose') calories -= pace === 'Faster' ? 500 : pace === 'Gentle' ? 250 : 400;
    if (goal === 'gain' || goal === 'muscle') calories += 250;
    calories = Math.min(6000, Math.max(1200, Math.round(calories / 50) * 50));
    const protein = Math.round((goal === 'muscle' ? pounds * 0.85 : pounds * 0.72));
    const fat = Math.round((calories * 0.28) / 9);
    const carbs = Math.max(0, Math.round((calories - protein * 4 - fat * 9) / 4));
    return { calories, protein, carbs, fat, fiber: 25 };
  }, [activity, age, goal, pace, profile.currentWeightKg, sex, weight, height, unit, heightFeet, heightInches]);

  const next = () => {
    setMessage('');
    if (step === 'about') { if (!sex || !(unit === 'US' ? heightFeet : height) || !weight) { setMessage('Complete your sex, height, and current weight.'); return; } setStep('activity'); }
    else if (step === 'activity') setStep('recommended');
    else void save();
  };
  const save = async () => {
    setMessage('Saving your nutrition goals…');
    const values = customize ? { calories: Number(customCalories) || recommendation.calories, protein: (Number(customProtein) || recommendation.protein) + ' g', carbs: (Number(customCarbs) || recommendation.carbs) + ' g', fat: (Number(customFat) || recommendation.fat) + ' g' } : { calories: recommendation.calories, protein: recommendation.protein + ' g', carbs: recommendation.carbs + ' g', fat: recommendation.fat + ' g' };
    await update({ age, sexForCalculation: sex, heightCm: unit === 'US' ? ((Number(heightFeet) * 12 + Number(heightInches)) * 2.54) : Number(height), currentWeightKg: unit === 'US' ? Number(weight) / 2.20462 : Number(weight), targetWeightKg: unit === 'US' ? Number(targetWeight) / 2.20462 : Number(targetWeight), goal, activityLevel: activity, calories: values.calories, protein: values.protein, carbs: values.carbs, fat: values.fat, fiber: recommendation.fiber + ' g', calculationMode: customize ? 'manual' : 'calculated' });
    const saveError = await saveNutritionGoals();
    if (saveError) setMessage(saveError); else router.push('/onboarding/settings');
  };
  const title = step === 'about' ? <>Tell us <Text style={styles.accent}>about you</Text></> : step === 'activity' ? <>Activity & <Text style={styles.accent}>weight goal</Text></> : <>Your recommended <Text style={styles.accent}>nutrition goals</Text></>;
  return <OnboardingShell title={title} percent={step === 'about' ? 91 : step === 'activity' ? 94 : 97} footer={<Button disabled={saving} label={step === 'recommended' ? (saving ? 'Saving…' : 'Save & continue') : 'Continue'} onPress={next} />}>
    {step === 'about' ? <><Text style={styles.subtitle}>We’ll use this to create your recommended nutrition targets.</Text><View style={styles.segment}>{(['US', 'Metric'] as const).map(value => <Pressable key={value} onPress={() => setUnit(value)} style={[styles.segmentButton, unit === value && styles.active]}><Text style={styles.segmentText}>{value}</Text></Pressable>)}</View><TextInput placeholder="Date of birth (e.g. March 25, 1985)" value={birthDate} onChangeText={setBirthDate} style={styles.input}/><Text style={styles.label}>Sex used for calorie estimate</Text><View style={styles.segment}>{(['female', 'male'] as const).map(value => <Pressable key={value} onPress={() => setSex(value)} style={[styles.segmentButton, sex === value && styles.active]}><Text style={styles.segmentText}>{value === 'female' ? 'Female' : 'Male'}</Text></Pressable>)}</View><Text style={styles.label}>Height</Text>{unit === 'US' ? <View style={styles.heightRow}><TextInput keyboardType="numeric" placeholder="Feet" value={heightFeet} onChangeText={setHeightFeet} style={styles.heightInput}/><TextInput keyboardType="numeric" placeholder="Inches" value={heightInches} onChangeText={setHeightInches} style={styles.heightInput}/></View> : <TextInput keyboardType="numeric" placeholder="Height in cm" value={height} onChangeText={setHeight} style={styles.input}/>}<Text style={styles.label}>Current weight</Text><TextInput keyboardType="numeric" placeholder={unit === 'US' ? 'Weight in pounds' : 'Weight in kg'} value={weight} onChangeText={setWeight} style={styles.input}/><Text style={styles.label}>Goal weight</Text><TextInput keyboardType="numeric" placeholder={unit === 'US' ? 'Goal weight in pounds' : 'Goal weight in kg'} value={targetWeight} onChangeText={setTargetWeight} style={styles.input}/><View style={styles.privacy}><Ionicons color={colors.charcoal} name="lock-closed-outline" size={20}/><Text style={styles.privacyText}>Your body information is private and only used to personalize your nutrition recommendations.</Text></View><View style={styles.mascotWrap}><Image accessibilityLabel="CraveKeep nutrition mascot holding a nutrition card" resizeMode="contain" source={nutritionMascot} style={styles.nutritionMascot} /></View></> : null}
    {step === 'activity' ? <><Text style={styles.subtitle}>Help us estimate what your body needs each day.</Text><Text style={styles.label}>What’s your primary goal?</Text><View style={styles.grid}>{goals.map(item => <Pressable key={item.value} onPress={() => setGoal(item.value)} style={[styles.option, goal === item.value && styles.active]}><Ionicons color={colors.charcoal} name={item.icon as any} size={22}/><Text style={styles.optionText}>{item.label}</Text></Pressable>)}</View><Text style={styles.label}>Typical activity level</Text><View style={styles.list}>{activities.map(item => <Pressable key={item} onPress={() => setActivity(item)} style={[styles.row, activity === item && styles.active]}><Text style={styles.optionText}>{item}</Text></Pressable>)}</View><Text style={styles.label}>Desired weekly pace</Text><View style={styles.segment}>{['Gentle', 'Moderate', 'Faster'].map(item => <Pressable key={item} onPress={() => setPace(item)} style={[styles.segmentButton, pace === item && styles.active]}><Text style={styles.segmentText}>{item}</Text></Pressable>)}</View><View style={styles.mascotWrap}><Image accessibilityLabel="CraveKeep nutrition mascot holding an activity checklist" resizeMode="contain" source={nutritionMascot} style={styles.nutritionMascot} /></View></> : null}
    {step === 'recommended' ? <><Text style={styles.subtitle}>Based on your age, height, weight, activity, and goal, we recommend:</Text><View style={styles.calorieCard}><Text style={styles.calories}>{customize ? customCalories || recommendation.calories : recommendation.calories}</Text><Text style={styles.unit}>calories / day</Text></View><View style={styles.targetCard}>{[['Protein',customize ? customProtein || recommendation.protein : recommendation.protein],['Carbs',customize ? customCarbs || recommendation.carbs : recommendation.carbs],['Fat',customize ? customFat || recommendation.fat : recommendation.fat],['Fiber',recommendation.fiber]].map(([label,value]) => <View key={label} style={styles.targetRow}><Text style={styles.optionText}>{label}</Text>{customize && label !== 'Fiber' ? <TextInput keyboardType="numeric" value={String(value)} onChangeText={text => label === 'Protein' ? setCustomProtein(text) : label === 'Carbs' ? setCustomCarbs(text) : setCustomFat(text)} style={styles.targetInput}/> : <Text style={styles.value}>{value} g</Text>}</View>)}</View><View style={styles.segment}><Pressable onPress={() => setCustomize(false)} style={[styles.segmentButton, !customize && styles.active]}><Text style={styles.segmentText}>Use recommended</Text></Pressable><Pressable onPress={() => { setCustomize(true); setCustomCalories(String(recommendation.calories)); setCustomProtein(String(recommendation.protein)); setCustomCarbs(String(recommendation.carbs)); setCustomFat(String(recommendation.fat)); }} style={[styles.segmentButton, customize && styles.active]}><Text style={styles.segmentText}>Customize targets</Text></Pressable></View><Pressable onPress={() => router.push('/onboarding/settings')}><Text style={styles.skip}>Skip nutrition tracking</Text></Pressable><View style={styles.mascotWrap}><Image accessibilityLabel="CraveKeep nutrition mascot holding recommended goals" resizeMode="contain" source={nutritionMascot} style={styles.nutritionMascot} /></View></> : null}
    {message ? <Text style={styles.message}>{message}</Text> : null}{error ? <Text style={styles.error}>{error}</Text> : null}
  </OnboardingShell>;
}
const styles=StyleSheet.create({accent:{color:colors.coralDark},subtitle:{marginTop:-spacing.sm,color:colors.muted,fontSize:14,lineHeight:19},label:{...typography.label,color:colors.charcoal,fontSize:12},heightRow:{flexDirection:'row',gap:8},heightInput:{flex:1,minHeight:46,paddingHorizontal:12,borderWidth:1,borderColor:colors.line,borderRadius:radii.small,color:colors.charcoal,backgroundColor:'#FFF'},privacy:{padding:12,flexDirection:'row',alignItems:'center',gap:9,borderWidth:1,borderColor:'#E8C697',borderRadius:radii.small,backgroundColor:'#FFF8EE'},privacyText:{flex:1,color:colors.charcoal,fontSize:11,lineHeight:16},mascotWrap:{width:'100%',minHeight:155,alignItems:'center',justifyContent:'flex-end',paddingTop:4,paddingBottom:4,overflow:'visible'},nutritionMascot:{width:190,height:160,maxWidth:'100%'},input:{minHeight:46,paddingHorizontal:12,borderWidth:1,borderColor:colors.line,borderRadius:radii.small,color:colors.charcoal,backgroundColor:'#FFF'},segment:{flexDirection:'row',gap:6},segmentButton:{flex:1,minHeight:40,alignItems:'center',justifyContent:'center',borderWidth:1,borderColor:colors.line,borderRadius:radii.small,backgroundColor:'#FFF'},active:{borderColor:colors.coral,backgroundColor:'#FFF0ED'},segmentText:{color:colors.charcoal,fontSize:12,fontWeight:'800'},grid:{flexDirection:'row',flexWrap:'wrap',gap:7},option:{width:'48%',minHeight:54,padding:9,alignItems:'center',justifyContent:'center',gap:5,borderWidth:1,borderColor:colors.line,borderRadius:radii.small,backgroundColor:'#FFF'},optionText:{color:colors.charcoal,fontSize:12,fontWeight:'800',textAlign:'center'},list:{gap:7},row:{minHeight:44,padding:12,borderWidth:1,borderColor:colors.line,borderRadius:radii.small,backgroundColor:'#FFF'},calorieCard:{padding:16,alignItems:'center',borderWidth:1,borderColor:'#E8C697',borderRadius:radii.medium,backgroundColor:'#FFF8EE'},calories:{color:colors.coralDark,fontSize:38,fontWeight:'900'},unit:{color:colors.charcoal,fontWeight:'800'},targetCard:{overflow:'hidden',borderWidth:1,borderColor:colors.line,borderRadius:radii.medium,backgroundColor:'#FFF'},targetRow:{minHeight:45,paddingHorizontal:12,flexDirection:'row',alignItems:'center',justifyContent:'space-between',borderBottomWidth:1,borderBottomColor:colors.line},targetInput:{minWidth:65,textAlign:'right',color:colors.charcoal,fontWeight:'800'},value:{color:colors.charcoal,fontWeight:'900'},message:{padding:9,color:colors.herb,textAlign:'center'},error:{color:colors.coralDark,textAlign:'center'},skip:{margin:10,color:colors.coralDark,textAlign:'center',textDecorationLine:'underline'}});
