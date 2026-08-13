import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { OnboardingShell, Panel, SettingRow } from '@/components/onboarding-shell';
import { Button } from '@/components/ui';
import { useOnboardingStore } from '@/data/onboarding-store';
import { colors, radii, spacing, typography } from '@/theme';

export default function SettingsScreen(){
  const {profile,finish,saving,error}=useOnboardingStore();
  const complete=async()=>{if(!await finish())router.replace('/(tabs)/home')};
  return <OnboardingShell title="Ready to cook" percent={100} footer={<Button disabled={saving} label={saving?'Finishing setup…':'Finish setup'} onPress={()=>void complete()} />}>
    <View style={styles.hero}><View style={styles.check}><Ionicons color={colors.white} name="checkmark" size={34}/></View><Text style={styles.title}>CraveKeep is ready for you.</Text><Text style={styles.body}>We’ll use these choices to organize recipes and make suggestions that fit your kitchen.</Text></View>
    <Panel><SettingRow icon="person-outline" title={profile.displayName||'Your profile'} value={`@${profile.handle}`} onPress={()=>router.push('/onboarding/profile')}/><SettingRow icon="leaf-outline" title="Food profile" value={`${profile.loves.length} favorites · ${profile.allergies.length} allergies`} onPress={()=>router.push('/onboarding/food-profile')}/><SettingRow icon="pie-chart-outline" title="Nutrition direction" value={profile.goal==='none'?'No target':`${profile.calories.toLocaleString()} calories`} onPress={()=>router.push('/onboarding/nutrition-goals')}/><SettingRow icon="people-outline" title="Household" value={`${profile.householdMembers.length+1} member${profile.householdMembers.length?'s':''}`} onPress={()=>router.push('/onboarding/household')}/></Panel>
    <View style={styles.private}><Ionicons color={colors.herb} name="lock-closed" size={22}/><View style={styles.flex}><Text style={styles.privateTitle}>Private by default</Text><Text style={styles.body}>Your health details, allergies, and weight information are not part of your public profile.</Text></View></View>
    <Text style={styles.note}>All settings can be changed later from your profile.</Text>{error?<Text accessibilityRole="alert" style={styles.error}>{error}</Text>:null}
  </OnboardingShell>;
}
const styles=StyleSheet.create({hero:{alignItems:'center',gap:spacing.sm,paddingVertical:spacing.md},check:{width:64,height:64,borderRadius:32,alignItems:'center',justifyContent:'center',backgroundColor:colors.herb},title:{...typography.title,fontSize:28,color:colors.charcoal,textAlign:'center'},body:{color:colors.muted,lineHeight:20,textAlign:'center'},private:{flexDirection:'row',alignItems:'center',gap:12,padding:spacing.md,borderWidth:1,borderColor:colors.herb,borderRadius:radii.medium,backgroundColor:colors.herbSoft},flex:{flex:1},privateTitle:{fontWeight:'800',color:colors.herb},note:{color:colors.muted,fontSize:11,textAlign:'center'},error:{color:colors.coralDark,textAlign:'center'}});
