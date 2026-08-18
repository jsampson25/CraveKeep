import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { OnboardingShell } from '@/components/onboarding-shell';
import { Button } from '@/components/ui';
import { useOnboardingStore } from '@/data/onboarding-store';
import { colors, radii, spacing, typography } from '@/theme';
import healthyFood from '../../assets/onboarding/goal-food/goal-0.webp';
import mealPrepFood from '../../assets/onboarding/goal-food/goal-1.webp';
import weightFood from '../../assets/onboarding/goal-food/goal-2.webp';
import proteinFood from '../../assets/onboarding/goal-food/goal-3.webp';
import mascot from '../../assets/onboarding/mascots/main-goal-pointer.webp';

const goals = [
  { value: 'balanced', title: 'Eat healthier', displayTitle: 'Eat\nhealthier', detail: 'Better nutrition every day', icon: 'leaf', color: colors.herb, soft: colors.herbSoft, image: healthyFood },
  { value: 'save-time', title: 'Save time', displayTitle: 'Save\ntime', detail: 'Simplify my cooking', icon: 'time', color: '#D88A18', soft: colors.lemonSoft, image: mealPrepFood },
  { value: 'lose', title: 'Lose weight', displayTitle: 'Lose\nweight', detail: 'Reach my goal weight', icon: 'scale', color: '#7A4BA0', soft: colors.lavenderSoft, image: weightFood },
  { value: 'muscle', title: 'Build muscle', displayTitle: 'Build\nmuscle', detail: 'High-protein meals', icon: 'barbell', color: colors.coralDark, soft: '#FFF0ED', image: proteinFood },
  { value: 'organize', title: 'Organize my recipes', displayTitle: 'Organize my\nrecipes', detail: 'Keep everything in one place', icon: 'folder-open', color: '#2F70D0', soft: '#EEF5FF' },
  { value: 'plan', title: 'Plan meals more easily', displayTitle: 'Plan meals\nmore easily', detail: 'Stress-free meal planning', icon: 'calendar', color: colors.coralDark, soft: '#FFF0ED' },
] as const;

export default function MainGoalScreen() {
  const { profile, update } = useOnboardingStore();
  const next = () => { if (profile.goal) router.push('/onboarding/dietary-preferences'); };
  return <OnboardingShell title={<>What’s your main <Text style={styles.accent}>goal?</Text></>} percent={15} footer={<Button disabled={!profile.goal} label="Continue" onPress={next} />}>
    <Text style={styles.subtitle}>We’ll personalize CraveKeep just for you.</Text>
    <View style={styles.grid}>{goals.map(goal => {
      const selected = profile.goal === goal.value;
      return <Pressable accessibilityRole="button" accessibilityState={{ selected }} key={goal.value} onPress={() => void update({ goal: goal.value })} style={[styles.card, { borderColor: selected ? goal.color : colors.line }, selected && { backgroundColor: goal.soft }]}>
        <View style={styles.cardTop}><View style={[styles.icon, { backgroundColor: goal.soft }]}><Ionicons color={goal.color} name={goal.icon} size={23} /></View>{selected ? <Ionicons color={colors.herb} name="checkmark-circle" size={24} /> : null}</View>
        <View style={styles.copy}><Text style={styles.title}>{goal.displayTitle}</Text><Text style={styles.detail}>{goal.detail}</Text></View>{'image' in goal ? <Image accessibilityLabel={`${goal.title} meal example`} resizeMode="contain" source={goal.image} style={styles.foodImage} /> : null}
      </Pressable>;
    })}</View>
    <View style={styles.mascotStage}><Image accessibilityLabel="CraveKeep mascot encouraging you to choose a goal" resizeMode="contain" source={mascot} style={styles.mascot} /></View>
  </OnboardingShell>;
}
const styles=StyleSheet.create({accent:{color:colors.coral},subtitle:{marginTop:-spacing.sm,color:colors.muted,fontSize:14,lineHeight:20},grid:{flexDirection:'row',flexWrap:'wrap',gap:10},card:{width:'48.4%',minHeight:174,padding:13,overflow:'hidden',borderWidth:1.5,borderRadius:radii.medium,backgroundColor:'#FFFFFF'},cardTop:{position:'absolute',left:13,right:13,top:13,flexDirection:'row',alignItems:'center',justifyContent:'space-between',zIndex:3},icon:{width:38,height:38,borderRadius:12,alignItems:'center',justifyContent:'center'},copy:{position:'absolute',left:13,top:67,width:'52%',zIndex:2},title:{color:colors.charcoal,...typography.label,fontSize:17,lineHeight:19},detail:{marginTop:6,color:colors.muted,fontSize:10,lineHeight:14},foodImage:{position:'absolute',right:3,bottom:3,width:92,height:92},mascotStage:{height:242,marginTop:-6,alignItems:'center',justifyContent:'flex-end'},mascot:{width:194,height:238}});
