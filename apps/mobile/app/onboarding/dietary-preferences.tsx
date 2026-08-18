import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { OnboardingShell } from '@/components/onboarding-shell';
import { Button } from '@/components/ui';
import { useOnboardingStore } from '@/data/onboarding-store';
import { colors, radii, spacing, typography } from '@/theme';
import mascot from '../../assets/onboarding/mascots/food-preferences-guide.webp';

const choices = [
  { value: 'Vegetarian', icon: 'vegetarian', color: colors.herb, image: require('../../assets/onboarding/preferences/pref-0.webp') },
  { value: 'Vegan', icon: 'vegan', color: colors.herb, image: require('../../assets/onboarding/preferences/pref-1.webp') },
  { value: 'Pescatarian', icon: 'pescatarian', color: '#2572A8', image: require('../../assets/onboarding/preferences/pref-2.webp') },
  { value: 'Gluten-free', icon: 'gluten-free', color: '#D88A18', image: require('../../assets/onboarding/preferences/pref-3.webp') },
  { value: 'Dairy-free', icon: 'dairy-free', color: '#7A4BA0', image: require('../../assets/onboarding/preferences/pref-4.webp') },
  { value: 'Low carb', icon: 'low-carb', color: colors.coralDark, image: require('../../assets/onboarding/preferences/pref-5.webp') },
] as const;

type DietaryIconName = typeof choices[number]['icon'];

function DietaryIcon({ name, color }: { name: DietaryIconName; color: string }) {
  if (name === 'gluten-free') return <View accessibilityLabel="Gluten-free GF symbol" style={[styles.symbolBadge, { borderColor: color }]}><Text style={[styles.symbolLetters, { color }]}>GF</Text><View style={[styles.symbolSlash, { backgroundColor: color }]} /></View>;
  if (name === 'dairy-free') return <View accessibilityLabel="Dairy-free symbol" style={styles.symbolCanvas}><MaterialCommunityIcons color={color} name="bottle-tonic-outline" size={25} /><View style={[styles.symbolSlash, { backgroundColor: color }]} /></View>;
  if (name === 'low-carb') return <View accessibilityLabel="Low-carb symbol" style={styles.symbolCanvas}><MaterialCommunityIcons color={color} name="bread-slice-outline" size={26} /><View style={[styles.symbolSlash, { backgroundColor: color }]} /></View>;
  const icon = name === 'vegetarian' ? 'leaf-outline' : name === 'vegan' ? 'nutrition-outline' : 'fish-outline';
  return <Ionicons accessibilityLabel={`${name} symbol`} color={color} name={icon} size={24} />;
}

export default function DietaryPreferencesScreen() {
  const { profile, update } = useOnboardingStore();
  const next = () => { if (profile.dietaryPreference) router.push('/onboarding/foods-you-love'); };
  return <OnboardingShell title={<>Tell us about your food <Text style={styles.accent}>preferences</Text></>} percent={29} footer={<Button disabled={!profile.dietaryPreference} label="Continue" onPress={next} />}>
    <Text style={styles.subtitle}>Select all that apply.</Text>
    <View style={styles.grid}>{choices.map(choice => {
      const selected = profile.dietaryPreference === choice.value;
      return <Pressable accessibilityRole="button" accessibilityState={{ selected }} key={choice.value} onPress={() => void update({ dietaryPreference: choice.value })} style={[styles.card, selected && styles.selected]}>
        <View style={styles.cardHeader}><View style={[styles.iconWrap, { backgroundColor: `${choice.color}14` }]}><DietaryIcon color={choice.color} name={choice.icon} /></View><Text style={styles.title}>{choice.value}</Text></View><Image accessibilityLabel={`${choice.value} meal example`} resizeMode="contain" source={choice.image} style={styles.photo} />{selected ? <Ionicons color={colors.herb} name="checkmark-circle" size={21} style={styles.check} /> : null}
      </Pressable>;
    })}</View>
    <Pressable accessibilityRole="button" accessibilityState={{ selected: profile.dietaryPreference === 'No dietary preference' }} onPress={() => void update({ dietaryPreference: 'No dietary preference' })} style={[styles.anything, profile.dietaryPreference === 'No dietary preference' && styles.selected]}><Ionicons color={colors.coral} name="happy-outline" size={22} /><Text style={styles.anythingText}>No preferences / Anything</Text>{profile.dietaryPreference === 'No dietary preference' ? <Ionicons color={colors.herb} name="checkmark-circle" size={20} /> : null}</Pressable>
    <View style={styles.notice}><Ionicons color={colors.herb} name="leaf-outline" size={23} /><Text style={styles.noticeText}>You can update these anytime in your settings.</Text></View>
    <View style={styles.mascotStage}><Image accessibilityLabel="CraveKeep mascot holding a fresh salad and presenting food preferences" resizeMode="contain" source={mascot} style={styles.mascot} /></View>
  </OnboardingShell>;
}
const styles=StyleSheet.create({accent:{color:colors.coral},subtitle:{marginTop:-spacing.sm,color:'#536179',fontSize:15,lineHeight:21},grid:{flexDirection:'row',flexWrap:'wrap',gap:9},card:{width:'48.5%',height:164,padding:10,borderWidth:1.5,borderColor:colors.line,borderRadius:radii.medium,backgroundColor:'#FFFFFF',overflow:'hidden'},selected:{borderColor:colors.herb,backgroundColor:colors.herbSoft},cardHeader:{height:40,paddingRight:20,flexDirection:'row',alignItems:'center',gap:8},iconWrap:{width:36,height:36,borderRadius:11,alignItems:'center',justifyContent:'center',flexShrink:0},symbolCanvas:{width:27,height:27,alignItems:'center',justifyContent:'center'},symbolBadge:{width:25,height:25,borderRadius:13,borderWidth:1.8,alignItems:'center',justifyContent:'center'},symbolLetters:{fontSize:10,fontWeight:'900',letterSpacing:-0.5},symbolSlash:{position:'absolute',width:2,height:31,borderRadius:2,transform:[{rotate:'45deg'}]},photo:{width:'100%',height:101,marginTop:3,alignSelf:'center'},title:{flex:1,color:colors.charcoal,...typography.label,fontSize:15,lineHeight:17},check:{position:'absolute',right:7,top:7,zIndex:3,backgroundColor:'#FFFFFF',borderRadius:11},anything:{minHeight:54,paddingHorizontal:13,flexDirection:'row',alignItems:'center',gap:9,borderWidth:1,borderColor:colors.line,borderRadius:radii.small,backgroundColor:'#FFFFFF'},anythingText:{flex:1,color:colors.charcoal,fontWeight:'700',fontSize:14},notice:{padding:13,flexDirection:'row',alignItems:'center',gap:10,borderWidth:1,borderColor:'#E8C697',borderRadius:radii.small,backgroundColor:'#FFF8EE'},noticeText:{flex:1,color:'#536179',fontSize:13,lineHeight:18},mascotStage:{height:244,marginTop:-4,alignItems:'center',justifyContent:'flex-end'},mascot:{width:206,height:242}});
