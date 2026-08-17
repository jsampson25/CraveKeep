import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { OnboardingShell } from '@/components/onboarding-shell';
import { Button } from '@/components/ui';
import { useOnboardingStore } from '@/data/onboarding-store';
import { colors, radii, spacing, typography } from '@/theme';

const items=[['Peanuts','🥜'],['Tree nuts','🌰'],['Milk','🥛'],['Eggs','🥚'],['Wheat','🌾'],['Soy','🫘'],['Fish','🐟'],['Shellfish','🦐'],['Sesame','🌱']] as const;
export default function AllergiesScreen(){
 const{profile,update,saveFoodProfile,saving,error}=useOnboardingStore();const[message,setMessage]=useState<string>();
 const toggle=(item:string)=>void update({allergies:profile.allergies.includes(item)?profile.allergies.filter(value=>value!==item):[...profile.allergies,item]});
 const next=async()=>{setMessage('Saving your food preferences…');await update({cookingTime:profile.cookingTime||'No preference',skill:profile.skill||'Comfortable'});const saveError=await saveFoodProfile();if(saveError){setMessage(saveError);return}router.push('/onboarding/household')};
 return <OnboardingShell title={<>Any allergies or <Text style={styles.accent}>intolerances?</Text></>} percent={65} footer={<Button disabled={saving} label={saving?'Saving…':'Continue'} onPress={()=>void next()}/>}>
  <Text style={styles.subtitle}>We’ll flag recipes that may contain these.</Text>
  <View style={styles.safety}><View style={styles.shield}><Ionicons color={colors.white} name="shield-checkmark" size={23}/></View><Text style={styles.safetyText}>Your safety matters. We’ll always prioritize your health.</Text></View>
  <View style={styles.grid}>{items.map(([item,emoji])=>{const active=profile.allergies.includes(item);return <Pressable accessibilityRole="button" accessibilityState={{selected:active}} key={item} onPress={()=>toggle(item)} style={[styles.item,active&&styles.selected]}><Text style={styles.emoji}>{emoji}</Text><Text style={styles.itemText}>{item}</Text>{active?<Ionicons color={colors.herb} name="checkmark-circle" size={18} style={styles.check}/>:null}</Pressable>})}</View>
  <Pressable onPress={()=>void update({allergies:[]})} style={[styles.none,!profile.allergies.length&&styles.noneActive]}><Ionicons color={!profile.allergies.length?colors.herb:colors.muted} name={!profile.allergies.length?'checkmark-circle':'ellipse-outline'} size={23}/><Text style={styles.noneText}>No known allergies</Text></Pressable>
  {message?<Text style={styles.message}>{message}</Text>:null}{error?<Text accessibilityRole="alert" style={styles.error}>{error}</Text>:null}
  <Text style={styles.disclaimer}>CraveKeep can flag ingredients but cannot guarantee that recipes or products are allergen-free. Always verify labels and preparation methods.</Text>
 </OnboardingShell>;
}
const styles=StyleSheet.create({accent:{color:colors.coral},subtitle:{marginTop:-spacing.sm,color:colors.muted,fontSize:14},safety:{padding:12,flexDirection:'row',alignItems:'center',gap:10,borderWidth:1,borderColor:'#E8C697',borderRadius:radii.small,backgroundColor:'#FFF8EE'},shield:{width:38,height:38,borderRadius:12,alignItems:'center',justifyContent:'center',backgroundColor:colors.coral},safetyText:{flex:1,color:colors.charcoal,fontSize:12,lineHeight:17},grid:{flexDirection:'row',flexWrap:'wrap',gap:8},item:{width:'31.7%',minHeight:88,padding:8,alignItems:'center',justifyContent:'center',borderWidth:1,borderColor:colors.line,borderRadius:radii.small,backgroundColor:colors.paperRaised},selected:{borderColor:colors.herb,backgroundColor:colors.herbSoft},emoji:{fontSize:29,marginBottom:5},itemText:{color:colors.charcoal,...typography.label,fontSize:11,textAlign:'center'},check:{position:'absolute',right:4,top:4},none:{minHeight:54,paddingHorizontal:14,flexDirection:'row',alignItems:'center',gap:10,borderWidth:1,borderColor:colors.line,borderRadius:radii.small,backgroundColor:colors.paperRaised},noneActive:{borderColor:colors.herb,backgroundColor:colors.herbSoft},noneText:{color:colors.charcoal,fontWeight:'800'},message:{padding:9,color:colors.herb,textAlign:'center',backgroundColor:colors.herbSoft,borderRadius:radii.small},error:{color:colors.coralDark,textAlign:'center'},disclaimer:{color:colors.muted,fontSize:10,lineHeight:15,textAlign:'center'}});
