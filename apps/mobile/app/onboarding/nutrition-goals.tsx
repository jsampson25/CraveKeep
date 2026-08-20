import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useMemo, useRef, useState } from 'react';
import { Image, Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { OnboardingShell } from '@/components/onboarding-shell';
import { Button } from '@/components/ui';
import { useOnboardingStore } from '@/data/onboarding-store';
import { colors, radii, spacing, typography } from '@/theme';
import nutritionMascot from '../../assets/onboarding/mascots/nutrition-coach.webp';

type Step = 'about' | 'activity' | 'recommended';
const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const goals = [
  ['lose','Lose weight','trending-down-outline'],
  ['maintain','Maintain weight','scale-outline'],
  ['gain','Gain weight','trending-up-outline'],
  ['muscle','Build muscle','barbell-outline'],
] as const;
const activities = ['Mostly seated','Lightly active','Moderately active','Very active','Highly active'];
const multipliers = [1.2,1.375,1.55,1.725,1.9];

function daysInMonth(month:number, year:number){ return new Date(year, month, 0).getDate(); }

function DateWheel({values, value, onChange, format=(n:number)=>String(n)}:{
  values:number[]; value:number; onChange:(n:number)=>void; format?: (n:number)=>string;
}) {
  const ref = useRef<ScrollView>(null);
  const row = 46;
  const index = Math.max(0, values.indexOf(value));
  return <View style={styles.wheel}>
    <View pointerEvents="none" style={styles.wheelSelected}/>
    <ScrollView
      ref={ref}
      showsVerticalScrollIndicator={false}
      snapToInterval={row}
      decelerationRate="fast"
      contentContainerStyle={{paddingVertical: (184-row)/2}}
      onLayout={()=>ref.current?.scrollTo({y:index*row,animated:false})}
      onMomentumScrollEnd={e=>{
        const i=Math.max(0,Math.min(values.length-1,Math.round(e.nativeEvent.contentOffset.y/row)));
        onChange(values[i]);
      }}
    >
      {values.map((v,i)=><Pressable
        key={v}
        onPress={()=>{
          onChange(v);
          ref.current?.scrollTo({y:i*row,animated:true});
        }}
        style={styles.wheelRow}
      ><Text style={styles.wheelText}>{format(v)}</Text></Pressable>)}
    </ScrollView>
  </View>;
}

export default function NutritionGoalsScreen(){
  const {profile,update,saveNutritionGoals,saving,error}=useOnboardingStore();
  const [step,setStep]=useState<Step>('about');
  const [unit,setUnit]=useState<'US'|'Metric'>('US');
  const yearNow=new Date().getFullYear();
  const [birthMonth,setBirthMonth]=useState(3);
  const [birthDay,setBirthDay]=useState(25);
  const [birthYear,setBirthYear]=useState(Math.max(yearNow-100,yearNow-(profile.age??35)));
  const [dateOpen,setDateOpen]=useState(false);
  const [sex,setSex]=useState<'female'|'male'|undefined>(profile.sexForCalculation);
  const [height,setHeight]=useState(profile.heightCm?String(Math.round(profile.heightCm)):'');
  const [feet,setFeet]=useState(profile.heightCm?String(Math.floor(profile.heightCm/30.48)):'');
  const [inches,setInches]=useState(profile.heightCm?String(Math.round((profile.heightCm/2.54)%12)):'');
  const [weight,setWeight]=useState(profile.currentWeightKg?String(Math.round(profile.currentWeightKg*2.20462)):'');
  const [targetWeight,setTargetWeight]=useState(profile.targetWeightKg?String(Math.round(profile.targetWeightKg*2.20462)):'');
  const [goal,setGoal]=useState(profile.goal==='balanced'?'maintain':profile.goal==='save-time'?'lose':profile.goal||'lose');
  const [activity,setActivity]=useState(profile.activityLevel||activities[2]);
  const [pace,setPace]=useState('Moderate');
  const [customize,setCustomize]=useState(false);
  const [customCalories,setCustomCalories]=useState('');
  const [customProtein,setCustomProtein]=useState('');
  const [customCarbs,setCustomCarbs]=useState('');
  const [customFat,setCustomFat]=useState('');
  const [message,setMessage]=useState('');

  const birthLabel=`${months[birthMonth-1]} ${birthDay}, ${birthYear}`;
  const age=useMemo(()=>{
    const d=new Date(birthYear,birthMonth-1,birthDay),t=new Date();
    let a=t.getFullYear()-d.getFullYear();
    if(t.getMonth()<d.getMonth()||(t.getMonth()===d.getMonth()&&t.getDate()<d.getDate()))a--;
    return Math.max(13,a);
  },[birthDay,birthMonth,birthYear]);

  const recommendation=useMemo(()=>{
    const lb=Number(weight)||(profile.currentWeightKg?profile.currentWeightKg*2.20462:191);
    const totalIn=unit==='US'?((Number(feet)||5)*12+(Number(inches)||10)):((Number(height)||178)/2.54);
    const bmr=sex==='female'?10*(lb/2.20462)+6.25*(totalIn*2.54)-5*age-161:10*(lb/2.20462)+6.25*(totalIn*2.54)-5*age+5;
    let calories=Math.round(bmr*multipliers[Math.max(0,activities.indexOf(activity))]);
    if(goal==='lose')calories-=pace==='Faster'?500:pace==='Gentle'?250:400;
    if(goal==='gain'||goal==='muscle')calories+=250;
    calories=Math.min(6000,Math.max(1200,Math.round(calories/50)*50));
    const protein=Math.round(goal==='muscle'?lb*.85:lb*.72);
    const fat=Math.round(calories*.28/9);
    const carbs=Math.max(0,Math.round((calories-protein*4-fat*9)/4));
    return {calories,protein,carbs,fat,fiber:25};
  },[activity,age,goal,pace,profile.currentWeightKg,sex,weight,height,unit,feet,inches]);

  const chooseMonth=(m:number)=>{setBirthMonth(m);setBirthDay(d=>Math.min(d,daysInMonth(m,birthYear)));};
  const chooseYear=(y:number)=>{setBirthYear(y);setBirthDay(d=>Math.min(d,daysInMonth(birthMonth,y)));};

  const next=()=>{
    setMessage('');
    if(step==='about'){
      if(!sex||!(unit==='US'?feet:height)||!weight||!targetWeight){setMessage('Complete your sex, height, current weight, and goal weight.');return;}
      setStep('activity');
    }else if(step==='activity')setStep('recommended');else void save();
  };
  const save=async()=>{
    setMessage('Saving your nutrition goals…');
    const values=customize
      ? {calories:Number(customCalories)||recommendation.calories,protein:(Number(customProtein)||recommendation.protein)+' g',carbs:(Number(customCarbs)||recommendation.carbs)+' g',fat:(Number(customFat)||recommendation.fat)+' g'}
      : {calories:recommendation.calories,protein:recommendation.protein+' g',carbs:recommendation.carbs+' g',fat:recommendation.fat+' g'};
    await update({
      age,sexForCalculation:sex,
      heightCm:unit==='US'?((Number(feet)*12+Number(inches))*2.54):Number(height),
      currentWeightKg:unit==='US'?Number(weight)/2.20462:Number(weight),
      targetWeightKg:unit==='US'?Number(targetWeight)/2.20462:Number(targetWeight),
      goal,activityLevel:activity,calories:values.calories,protein:values.protein,carbs:values.carbs,fat:values.fat,
      fiber:recommendation.fiber+' g',calculationMode:customize?'manual':'calculated'
    });
    const saveError=await saveNutritionGoals();
    if(saveError)setMessage(saveError);else router.push('/onboarding/settings');
  };

  const title=step==='about'?<>Tell us <Text style={styles.accent}>about you</Text></>:step==='activity'?<>Activity & <Text style={styles.accent}>weight goal</Text></>:<>Your recommended <Text style={styles.accent}>nutrition goals</Text></>;
  return <OnboardingShell title={title} percent={step==='about'?91:step==='activity'?94:97} footer={<Button disabled={saving} label={step==='recommended'?(saving?'Saving…':'Save & continue'):'Continue'} onPress={next}/>}> 
    {step==='about'&&<>
      <Text style={styles.subtitle}>We’ll use this to create your recommended nutrition targets.</Text>
      <View style={styles.segment}>{(['US','Metric'] as const).map(v=><Pressable key={v} onPress={()=>setUnit(v)} style={[styles.seg,unit===v&&styles.active]}><Text style={styles.segText}>{v}</Text></Pressable>)}</View>
      <Text style={styles.label}>Date of birth</Text>
      <Pressable onPress={()=>setDateOpen(true)} style={styles.dateInput}><Text style={styles.inputText}>{birthLabel}</Text><Ionicons name="calendar-outline" size={20} color={colors.charcoal}/></Pressable>
      <Text style={styles.label}>Sex</Text>
      <View style={styles.segment}>{(['female','male'] as const).map(v=><Pressable key={v} onPress={()=>setSex(v)} style={[styles.seg,sex===v&&styles.active]}><Text style={styles.segText}>{v==='female'?'Female':'Male'}</Text></Pressable>)}</View>
      <Text style={styles.label}>Height</Text>
      {unit==='US'?<View style={styles.row}><TextInput keyboardType="numeric" placeholder="Feet" value={feet} onChangeText={setFeet} style={styles.field}/><TextInput keyboardType="numeric" placeholder="Inches" value={inches} onChangeText={setInches} style={styles.field}/></View>:<TextInput keyboardType="numeric" placeholder="Height in cm" value={height} onChangeText={setHeight} style={styles.fieldFull}/>} 
      <Text style={styles.label}>Current weight</Text><TextInput keyboardType="numeric" placeholder={unit==='US'?'Weight in pounds':'Weight in kg'} value={weight} onChangeText={setWeight} style={styles.fieldFull}/>
      <Text style={styles.label}>Goal weight</Text><TextInput keyboardType="numeric" placeholder={unit==='US'?'Goal weight in pounds':'Goal weight in kg'} value={targetWeight} onChangeText={setTargetWeight} style={styles.fieldFull}/>
      <View style={styles.privacy}><Ionicons name="lock-closed-outline" size={20} color={colors.charcoal}/><Text style={styles.privacyText}>Your body information is private and only used to personalize your nutrition recommendations.</Text></View>
      <View style={styles.mascot}><Image source={nutritionMascot} resizeMode="contain" style={styles.mascotImage} accessibilityLabel="CraveKeep nutrition coach mascot"/></View>
    </>}
    {step==='activity'&&<>
      <Text style={styles.subtitle}>Help us estimate what your body needs each day.</Text><Text style={styles.label}>What’s your primary goal?</Text>
      <View style={styles.grid}>{goals.map(([v,l,icon])=><Pressable key={v} onPress={()=>setGoal(v)} style={[styles.option,goal===v&&styles.active]}><Ionicons name={icon as any} size={22} color={colors.charcoal}/><Text style={styles.optionText}>{l}</Text></Pressable>)}</View>
      <Text style={styles.label}>Typical activity level</Text><View style={styles.list}>{activities.map(v=><Pressable key={v} onPress={()=>setActivity(v)} style={[styles.activity,activity===v&&styles.active]}><Text style={styles.optionText}>{v}</Text></Pressable>)}</View>
      <Text style={styles.label}>Desired weekly pace</Text><View style={styles.segment}>{['Gentle','Moderate','Faster'].map(v=><Pressable key={v} onPress={()=>setPace(v)} style={[styles.seg,pace===v&&styles.active]}><Text style={styles.segText}>{v}</Text></Pressable>)}</View>
      <View style={styles.mascot}><Image source={nutritionMascot} resizeMode="contain" style={styles.mascotImage} accessibilityLabel="CraveKeep nutrition coach mascot"/></View>
    </>}
    {step==='recommended'&&<>
      <Text style={styles.subtitle}>Based on your age, height, weight, activity, and goal, we recommend:</Text>
      <View style={styles.calorie}><Text style={styles.calories}>{customize?customCalories||recommendation.calories:recommendation.calories}</Text><Text style={styles.unit}>calories / day</Text></View>
      <View style={styles.targets}>{[['Protein',customize?customProtein||recommendation.protein:recommendation.protein],['Carbs',customize?customCarbs||recommendation.carbs:recommendation.carbs],['Fat',customize?customFat||recommendation.fat:recommendation.fat],['Fiber',recommendation.fiber]].map(([label,value])=><View key={label} style={styles.targetRow}><Text style={styles.optionText}>{label}</Text>{customize&&label!=='Fiber'?<TextInput keyboardType="numeric" value={String(value)} onChangeText={t=>label==='Protein'?setCustomProtein(t):label==='Carbs'?setCustomCarbs(t):setCustomFat(t)} style={styles.targetInput}/>:<Text style={styles.value}>{value} g</Text>}</View>)}</View>
      <View style={styles.segment}><Pressable onPress={()=>setCustomize(false)} style={[styles.seg,!customize&&styles.active]}><Text style={styles.segText}>Use recommended</Text></Pressable><Pressable onPress={()=>{setCustomize(true);setCustomCalories(String(recommendation.calories));setCustomProtein(String(recommendation.protein));setCustomCarbs(String(recommendation.carbs));setCustomFat(String(recommendation.fat));}} style={[styles.seg,customize&&styles.active]}><Text style={styles.segText}>Customize targets</Text></Pressable></View>
      <Pressable onPress={()=>router.push('/onboarding/settings')}><Text style={styles.skip}>Skip nutrition tracking</Text></Pressable>
      <View style={styles.mascot}><Image source={nutritionMascot} resizeMode="contain" style={styles.mascotImage} accessibilityLabel="CraveKeep nutrition coach mascot"/></View>
    </>}
    {!!message&&<Text style={styles.message}>{message}</Text>}{!!error&&<Text style={styles.error}>{error}</Text>}

    <Modal visible={dateOpen} transparent animationType="slide" onRequestClose={()=>setDateOpen(false)}>
      <View style={styles.backdrop}><View style={styles.modal}>
        <View style={styles.modalHead}><View><Text style={styles.modalTitle}>Date of birth</Text><Text style={styles.modalSub}>{birthLabel}</Text></View><Pressable onPress={()=>setDateOpen(false)} style={styles.close}><Ionicons name="close" size={22} color={colors.charcoal}/></Pressable></View>
        <View style={styles.wheels}>
          <View style={styles.monthWheel}><Text style={styles.wheelLabel}>Month</Text><DateWheel values={months.map((_,i)=>i+1)} value={birthMonth} onChange={chooseMonth} format={n=>months[n-1]}/></View>
          <View style={styles.wheelCol}><Text style={styles.wheelLabel}>Day</Text><DateWheel values={Array.from({length:daysInMonth(birthMonth,birthYear)},(_,i)=>i+1)} value={birthDay} onChange={setBirthDay} format={n=>String(n).padStart(2,'0')}/></View>
          <View style={styles.wheelCol}><Text style={styles.wheelLabel}>Year</Text><DateWheel values={Array.from({length:88},(_,i)=>yearNow-100+i)} value={birthYear} onChange={chooseYear}/></View>
        </View>
        <Button label="Done" onPress={()=>setDateOpen(false)}/>
      </View></View>
    </Modal>
  </OnboardingShell>;
}

const styles=StyleSheet.create({
 accent:{color:colors.coralDark},subtitle:{marginTop:-spacing.sm,color:colors.muted,fontSize:14,lineHeight:19},label:{...typography.label,color:colors.charcoal,fontSize:12},
 segment:{flexDirection:'row',gap:6},seg:{flex:1,minHeight:40,alignItems:'center',justifyContent:'center',borderWidth:1,borderColor:colors.line,borderRadius:radii.small,backgroundColor:'#FFF'},active:{borderColor:colors.coral,backgroundColor:'#FFF0ED'},segText:{color:colors.charcoal,fontSize:12,fontWeight:'800'},
 dateInput:{minHeight:46,paddingHorizontal:12,borderWidth:1,borderColor:colors.line,borderRadius:radii.small,backgroundColor:'#FFF',flexDirection:'row',alignItems:'center',justifyContent:'space-between'},inputText:{color:colors.charcoal,fontSize:14},
 row:{flexDirection:'row',gap:8},field:{flex:1,minHeight:46,paddingHorizontal:12,borderWidth:1,borderColor:colors.line,borderRadius:radii.small,color:colors.charcoal,backgroundColor:'#FFF'},fieldFull:{minHeight:46,paddingHorizontal:12,borderWidth:1,borderColor:colors.line,borderRadius:radii.small,color:colors.charcoal,backgroundColor:'#FFF'},
 privacy:{padding:12,flexDirection:'row',alignItems:'center',gap:9,borderWidth:1,borderColor:'#E8C697',borderRadius:radii.small,backgroundColor:'#FFF8EE'},privacyText:{flex:1,color:colors.charcoal,fontSize:11,lineHeight:16},
 mascot:{width:'100%',minHeight:170,alignItems:'center',justifyContent:'flex-end',paddingTop:8},mascotImage:{width:190,height:170,maxWidth:'100%'},
 grid:{flexDirection:'row',flexWrap:'wrap',gap:7},option:{width:'48%',minHeight:58,padding:9,alignItems:'center',justifyContent:'center',gap:5,borderWidth:1,borderColor:colors.line,borderRadius:radii.small,backgroundColor:'#FFF'},optionText:{color:colors.charcoal,fontSize:12,fontWeight:'800',textAlign:'center'},
 list:{gap:7},activity:{minHeight:44,padding:12,borderWidth:1,borderColor:colors.line,borderRadius:radii.small,backgroundColor:'#FFF'},
 calorie:{padding:16,alignItems:'center',borderWidth:1,borderColor:'#E8C697',borderRadius:radii.medium,backgroundColor:'#FFF8EE'},calories:{color:colors.coralDark,fontSize:38,fontWeight:'900'},unit:{color:colors.charcoal,fontWeight:'800'},
 targets:{overflow:'hidden',borderWidth:1,borderColor:colors.line,borderRadius:radii.medium,backgroundColor:'#FFF'},targetRow:{minHeight:45,paddingHorizontal:12,flexDirection:'row',alignItems:'center',justifyContent:'space-between',borderBottomWidth:1,borderBottomColor:colors.line},targetInput:{minWidth:65,textAlign:'right',color:colors.charcoal,fontWeight:'800'},value:{color:colors.charcoal,fontWeight:'900'},skip:{margin:10,color:colors.coralDark,textAlign:'center',textDecorationLine:'underline'},message:{padding:9,color:colors.herb,textAlign:'center'},error:{color:colors.coralDark,textAlign:'center'},
 backdrop:{flex:1,justifyContent:'flex-end',backgroundColor:'rgba(12,26,52,.35)'},modal:{backgroundColor:'#FFF',borderTopLeftRadius:24,borderTopRightRadius:24,padding:20,gap:16},modalHead:{flexDirection:'row',alignItems:'center',justifyContent:'space-between'},modalTitle:{color:colors.charcoal,fontSize:20,fontWeight:'900'},modalSub:{marginTop:2,color:colors.muted,fontSize:13},close:{width:38,height:38,borderRadius:19,borderWidth:1,borderColor:colors.line,alignItems:'center',justifyContent:'center'},wheels:{flexDirection:'row',gap:8},monthWheel:{flex:1.8},wheelCol:{flex:1},wheelLabel:{marginBottom:6,color:colors.muted,fontSize:11,fontWeight:'800',textAlign:'center'},wheel:{height:184,overflow:'hidden',borderRadius:12,backgroundColor:'#FAF9F7'},wheelSelected:{position:'absolute',zIndex:0,top:69,left:5,right:5,height:46,borderRadius:10,borderWidth:1,borderColor:colors.coral,backgroundColor:'rgba(255,240,237,0.55)'},wheelRow:{height:46,alignItems:'center',justifyContent:'center',zIndex:1},wheelText:{color:colors.charcoal,fontSize:14,fontWeight:'700'}
});
