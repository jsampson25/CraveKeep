import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { OnboardingShell } from '@/components/onboarding-shell';
import { Button } from '@/components/ui';
import { useOnboardingStore } from '@/data/onboarding-store';
import { colors, radii, spacing, typography } from '@/theme';

const choices = [
  { value: 'Vegetarian', icon: 'leaf', color: colors.herb, image: require('../../assets/onboarding/preferences/pref-0.webp') },
  { value: 'Vegan', icon: 'nutrition', color: colors.herb, image: require('../../assets/onboarding/preferences/pref-1.webp') },
  { value: 'Pescatarian', icon: 'fish', color: '#2572A8', image: require('../../assets/onboarding/preferences/pref-2.webp') },
  { value: 'Gluten-free', icon: 'flower', color: '#D88A18', image: require('../../assets/onboarding/preferences/pref-3.webp') },
  { value: 'Dairy-free', icon: 'water', color: '#7A4BA0', image: require('../../assets/onboarding/preferences/pref-4.webp') },
  { value: 'Low carb', icon: 'remove-circle-outline', color: colors.coralDark, image: require('../../assets/onboarding/preferences/pref-5.webp') },
] as const;

export default function DietaryPreferencesScreen() {
  const { profile, update } = useOnboardingStore();
  const next = () => { if (profile.dietaryPreference) router.push('/onboarding/foods-you-love'); };
  return <OnboardingShell title={<>Tell us about your food <Text style={styles.accent}>preferences</Text></>} percent={29} footer={<Button disabled={!profile.dietaryPreference} label="Continue" onPress={next} />}>
    <Text style={styles.subtitle}>Select all that apply.</Text>
    <View style={styles.grid}>{choices.map(choice => {
      const selected = profile.dietaryPreference === choice.value;
      return <Pressable accessibilityRole="button" accessibilityState={{ selected }} key={choice.value} onPress={() => void update({ dietaryPreference: choice.value })} style={[styles.card, selected && styles.selected]}>
        <Ionicons color={choice.color} name={choice.icon} size={21} style={styles.icon} /><Text style={styles.title}>{choice.value}</Text><Image accessibilityLabel={`${choice.value} meal example`} resizeMode="contain" source={choice.image} style={styles.photo} />{selected ? <Ionicons color={colors.herb} name="checkmark-circle" size={20} style={styles.check} /> : null}
      </Pressable>;
    })}</View>
    <Pressable accessibilityRole="button" accessibilityState={{ selected: profile.dietaryPreference === 'No dietary preference' }} onPress={() => void update({ dietaryPreference: 'No dietary preference' })} style={[styles.anything, profile.dietaryPreference === 'No dietary preference' && styles.selected]}><Ionicons color={colors.coral} name="happy-outline" size={22} /><Text style={styles.anythingText}>No preferences / Anything</Text>{profile.dietaryPreference === 'No dietary preference' ? <Ionicons color={colors.herb} name="checkmark-circle" size={20} /> : null}</Pressable>
    <View style={styles.notice}><Ionicons color={colors.herb} name="leaf-outline" size={23} /><Text style={styles.noticeText}>You can update these anytime in your settings.</Text></View>
  </OnboardingShell>;
}
const styles=StyleSheet.create({accent:{color:colors.coral},subtitle:{marginTop:-spacing.sm,color:colors.muted,fontSize:14},grid:{flexDirection:'row',flexWrap:'wrap',gap:9},card:{width:'48.5%',minHeight:104,padding:10,justifyContent:'flex-end',borderWidth:1,borderColor:colors.line,borderRadius:radii.medium,backgroundColor:'#FFFFFF',overflow:'hidden'},selected:{borderColor:colors.herb,backgroundColor:colors.herbSoft},icon:{position:'absolute',left:10,top:10,zIndex:2},photo:{position:'absolute',right:4,bottom:4,width:78,height:78},title:{maxWidth:'58%',color:colors.charcoal,...typography.label,fontSize:12,zIndex:2},check:{position:'absolute',right:7,top:7,zIndex:3,backgroundColor:'#FFFFFF',borderRadius:10},anything:{minHeight:52,paddingHorizontal:13,flexDirection:'row',alignItems:'center',gap:9,borderWidth:1,borderColor:colors.line,borderRadius:radii.small,backgroundColor:'#FFFFFF'},anythingText:{flex:1,color:colors.charcoal,fontWeight:'700',fontSize:13},notice:{padding:13,flexDirection:'row',alignItems:'center',gap:10,borderWidth:1,borderColor:'#E8C697',borderRadius:radii.small,backgroundColor:'#FFF8EE'},noticeText:{flex:1,color:colors.charcoal,fontSize:12,lineHeight:17}});
