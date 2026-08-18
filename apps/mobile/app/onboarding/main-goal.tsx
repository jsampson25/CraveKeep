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

const goals = [
  { value: 'balanced', title: 'Eat healthier', detail: 'Better nutrition every day', icon: 'leaf', color: colors.herb, soft: colors.herbSoft, image: healthyFood },
  { value: 'save-time', title: 'Save time', detail: 'Simplify my cooking', icon: 'time', color: '#D88A18', soft: colors.lemonSoft, image: mealPrepFood },
  { value: 'lose', title: 'Lose weight', detail: 'Reach my goal weight', icon: 'scale', color: '#7A4BA0', soft: colors.lavenderSoft, image: weightFood },
  { value: 'muscle', title: 'Build muscle', detail: 'High-protein meals', icon: 'barbell', color: colors.coralDark, soft: '#FFF0ED', image: proteinFood },
  { value: 'organize', title: 'Organize my recipes', detail: 'Keep everything in one place', icon: 'folder-open', color: '#2F70D0', soft: '#EEF5FF' },
  { value: 'plan', title: 'Plan meals more easily', detail: 'Stress-free meal planning', icon: 'calendar', color: colors.coralDark, soft: '#FFF0ED' },
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
        <Text style={styles.title}>{goal.title}</Text><Text style={styles.detail}>{goal.detail}</Text>{'image' in goal ? <Image accessibilityLabel={`${goal.title} meal example`} resizeMode="cover" source={goal.image} style={styles.foodImage} /> : null}
      </Pressable>;
    })}</View>
  </OnboardingShell>;
}
const styles=StyleSheet.create({accent:{color:colors.coral},subtitle:{marginTop:-spacing.sm,color:colors.muted,fontSize:14,lineHeight:20},grid:{flexDirection:'row',flexWrap:'wrap',gap:10},card:{width:'48.4%',minHeight:152,padding:13,justifyContent:'flex-end',overflow:'hidden',borderWidth:1.5,borderRadius:radii.medium,backgroundColor:'#FFFFFF'},cardTop:{position:'absolute',left:13,right:13,top:13,flexDirection:'row',alignItems:'center',justifyContent:'space-between',zIndex:2},icon:{width:38,height:38,borderRadius:12,alignItems:'center',justifyContent:'center'},title:{maxWidth:'65%',color:colors.charcoal,...typography.label,fontSize:14,zIndex:2},detail:{maxWidth:'62%',marginTop:4,color:colors.muted,fontSize:10,lineHeight:14,zIndex:2},foodImage:{position:'absolute',right:-8,bottom:-8,width:78,height:78,borderRadius:39}});
