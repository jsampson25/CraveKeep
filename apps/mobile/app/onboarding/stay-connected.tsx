import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Image, Pressable, StyleSheet, Switch, Text, View } from 'react-native';
import { OnboardingShell } from '@/components/onboarding-shell';
import { Button } from '@/components/ui';
import { colors, radii, spacing, typography } from '@/theme';
import connectionMascot from '../../assets/onboarding/mascots/connection-guide.png';

const reminders = [
  ['notifications-outline', 'Meal reminders', 'Get reminders to cook and eat well.'],
  ['basket-outline', 'Grocery reminders', 'Get reminded to restock essentials.'],
  ['cloud-upload-outline', 'Recipe import updates', 'Know when your imports are complete.'],
] as const;
const sources = [
  ['logo-pinterest', 'Pinterest', 'Discover recipes and save ideas.'],
  ['logo-youtube', 'YouTube', 'Save recipes from videos.'],
  ['logo-instagram', 'Instagram', 'Save recipes from posts.'],
] as const;

export default function StayConnectedScreen() {
  const [enabled, setEnabled] = useState<Record<string, boolean>>({});
  const toggle = (key: string) => setEnabled(current => ({ ...current, [key]: !current[key] }));
  return <OnboardingShell
    title={<>Stay <Text style={styles.accent}>connected</Text></>}
    percent={99}
    footer={<Button label="Continue" onPress={() => router.push('/onboarding/settings')} />}
  >
    <Text style={styles.subtitle}>Choose what helps CraveKeep work better for you.</Text>
    <View style={styles.mascot}><Image source={connectionMascot} resizeMode="contain" style={styles.mascotImage} accessibilityLabel="CraveKeep mascot with notifications and connections" /></View>
    <Text style={styles.sectionTitle}>Reminders</Text>
    <View style={styles.card}>{reminders.map(([icon, title, detail]) => <View key={title} style={styles.row}><View style={styles.icon}><Ionicons name={icon as any} size={19} color={colors.white} /></View><View style={styles.copy}><Text style={styles.rowTitle}>{title}</Text><Text style={styles.detail}>{detail}</Text></View><Switch value={!!enabled[title]} onValueChange={() => toggle(title)} trackColor={{ false: colors.line, true: colors.coral }} thumbColor={colors.white} /></View>)}</View>
    <Text style={styles.sectionTitle}>Connect your favorite sources</Text>
    <View style={styles.card}>{sources.map(([icon, title, detail]) => <View key={title} style={styles.row}><View style={[styles.icon, styles.sourceIcon]}><Ionicons name={icon as any} size={19} color={colors.white} /></View><View style={styles.copy}><Text style={styles.rowTitle}>{title}</Text><Text style={styles.detail}>{detail}</Text></View><Switch value={!!enabled[title]} onValueChange={() => toggle(title)} trackColor={{ false: colors.line, true: colors.coral }} thumbColor={colors.white} /></View>)}</View>
    <Text style={styles.note}>You can change these anytime in Settings.</Text>
  </OnboardingShell>;
}
const styles=StyleSheet.create({
  accent:{color:colors.coralDark},subtitle:{marginTop:-spacing.sm,color:colors.muted,lineHeight:19,textAlign:'center'},mascot:{height:190,alignItems:'center',justifyContent:'center'},mascotImage:{width:190,height:190},sectionTitle:{marginTop:spacing.sm,color:colors.charcoal,...typography.label},card:{overflow:'hidden',borderWidth:1,borderColor:colors.line,borderRadius:radii.medium,backgroundColor:colors.paperRaised},row:{minHeight:68,padding:10,flexDirection:'row',alignItems:'center',gap:10,borderBottomWidth:1,borderBottomColor:colors.line},icon:{width:38,height:38,borderRadius:12,alignItems:'center',justifyContent:'center',backgroundColor:colors.coral},sourceIcon:{backgroundColor:colors.herb},copy:{flex:1},rowTitle:{color:colors.charcoal,fontSize:12,fontWeight:'900'},detail:{marginTop:3,color:colors.muted,fontSize:10,lineHeight:14},note:{marginTop:spacing.sm,color:colors.muted,fontSize:10,textAlign:'center'}
});