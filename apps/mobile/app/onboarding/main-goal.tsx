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
        <View style={styles.cardHeader}><View style={[styles.icon, { backgroundColor: goal.soft }]}><Ionicons color={goal.color} name={goal.icon} size={22} /></View><Text style={styles.title}>{goal.title}</Text></View>
        <Text style={styles.detail}>{goal.detail}</Text>
        {'image' in goal ? <Image accessibilityLabel={`${goal.title} meal example`} resizeMode="contain" source={goal.image} style={styles.foodImage} /> : <View style={[styles.emptyVisual, { backgroundColor: goal.soft }]}><Ionicons color={goal.color} name={goal.icon} size={48} /></View>}
        {selected ? <Ionicons color={colors.herb} name="checkmark-circle" size={23} style={styles.check} /> : null}
      </Pressable>;
    })}</View>
    <View style={styles.mascotStage}><Image accessibilityLabel="CraveKeep mascot encouraging you to choose a goal" resizeMode="contain" source={mascot} style={styles.mascot} /></View>
  </OnboardingShell>;
}
const styles=StyleSheet.create({accent:{color:colors.coral},subtitle:{marginTop:-spacing.sm,color:'#536179',fontSize:15,lineHeight:21},grid:{flexDirection:'row',flexWrap:'wrap',gap:10},card:{width:'48.4%',height:212,padding:12,overflow:'hidden',borderWidth:1.5,borderRadius:radii.medium,backgroundColor:'#FFFFFF'},cardHeader:{minHeight:42,paddingRight:22,flexDirection:'row',alignItems:'center',gap:8},icon:{width:38,height:38,borderRadius:12,alignItems:'center',justifyContent:'center',flexShrink:0},title:{flex:1,color:colors.charcoal,...typography.label,fontSize:16,lineHeight:18},detail:{minHeight:31,marginTop:5,color:'#536179',fontSize:11,lineHeight:15},foodImage:{width:'100%',height:102,marginTop:2,alignSelf:'center'},emptyVisual:{width:'100%',height:102,marginTop:2,borderRadius:14,alignItems:'center',justifyContent:'center'},check:{position:'absolute',right:8,top:8,zIndex:4,backgroundColor:'#FFFFFF',borderRadius:12},mascotStage:{height:242,marginTop:-6,alignItems:'center',justifyContent:'flex-end'},mascot:{width:194,height:238}});
