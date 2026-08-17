import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { OnboardingShell } from '@/components/onboarding-shell';
import { Button } from '@/components/ui';
import { useOnboardingStore } from '@/data/onboarding-store';
import { colors, radii, spacing, typography } from '@/theme';

const choices = [
  { value: 'Vegetarian', icon: 'leaf', color: colors.herb },
  { value: 'Vegan', icon: 'nutrition', color: colors.herb },
  { value: 'Pescatarian', icon: 'fish', color: '#2572A8' },
  { value: 'Gluten-free', icon: 'flower', color: '#D88A18' },
  { value: 'Dairy-free', icon: 'water', color: '#7A4BA0' },
  { value: 'Low carb', icon: 'remove-circle-outline', color: colors.coralDark },
] as const;

export default function DietaryPreferencesScreen() {
  const { profile, update } = useOnboardingStore();
  const next = () => { if (profile.dietaryPreference) router.push('/onboarding/foods-you-love'); };
  return <OnboardingShell title={<>Tell us about your food <Text style={styles.accent}>preferences</Text></>} percent={29} footer={<Button disabled={!profile.dietaryPreference} label="Continue" onPress={next} />}>
    <Text style={styles.subtitle}>Select the option that best fits you.</Text>
    <View style={styles.grid}>{choices.map(choice => {
      const selected = profile.dietaryPreference === choice.value;
      return <Pressable accessibilityRole="button" accessibilityState={{ selected }} key={choice.value} onPress={() => void update({ dietaryPreference: choice.value })} style={[styles.card, selected && styles.selected]}>
        <View style={[styles.art, { backgroundColor: selected ? colors.herbSoft : colors.paper }]}><Ionicons color={choice.color} name={choice.icon} size={29} /></View><Text style={styles.title}>{choice.value}</Text>{selected ? <Ionicons color={colors.herb} name="checkmark-circle" size={20} style={styles.check} /> : null}
      </Pressable>;
    })}</View>
    <Pressable accessibilityRole="button" accessibilityState={{ selected: profile.dietaryPreference === 'No dietary preference' }} onPress={() => void update({ dietaryPreference: 'No dietary preference' })} style={[styles.anything, profile.dietaryPreference === 'No dietary preference' && styles.selected]}><Ionicons color={colors.coral} name="happy-outline" size={22} /><Text style={styles.anythingText}>No preferences / Anything</Text>{profile.dietaryPreference === 'No dietary preference' ? <Ionicons color={colors.herb} name="checkmark-circle" size={20} /> : null}</Pressable>
    <View style={styles.notice}><Ionicons color={colors.herb} name="leaf-outline" size={23} /><Text style={styles.noticeText}>You can update these anytime in your settings.</Text></View>
  </OnboardingShell>;
}
const styles=StyleSheet.create({accent:{color:colors.coral},subtitle:{marginTop:-spacing.sm,color:colors.muted,fontSize:14},grid:{flexDirection:'row',flexWrap:'wrap',gap:9},card:{width:'48.5%',minHeight:104,padding:10,borderWidth:1,borderColor:colors.line,borderRadius:radii.medium,backgroundColor:colors.paperRaised,overflow:'hidden'},selected:{borderColor:colors.herb,backgroundColor:colors.herbSoft},art:{height:58,borderRadius:12,alignItems:'center',justifyContent:'center'},title:{marginTop:7,color:colors.charcoal,...typography.label,fontSize:12},check:{position:'absolute',right:7,top:7},anything:{minHeight:52,paddingHorizontal:13,flexDirection:'row',alignItems:'center',gap:9,borderWidth:1,borderColor:colors.line,borderRadius:radii.small,backgroundColor:colors.paperRaised},anythingText:{flex:1,color:colors.charcoal,fontWeight:'700',fontSize:13},notice:{padding:13,flexDirection:'row',alignItems:'center',gap:10,borderWidth:1,borderColor:'#E8C697',borderRadius:radii.small,backgroundColor:'#FFF8EE'},noticeText:{flex:1,color:colors.charcoal,fontSize:12,lineHeight:17}});
