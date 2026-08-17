import { Ionicons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { OnboardingShell } from '@/components/onboarding-shell';
import { Button } from '@/components/ui';
import { foodCategories } from '@/data/food-catalog';
import { useOnboardingStore } from '@/data/onboarding-store';
import { colors, radii, spacing, typography } from '@/theme';

type PreferenceKey = 'loves' | 'avoids';
type Props = { preferenceKey: PreferenceKey; percent: number; title: string; accent: string; subtitle: string; continueLabel?: string; onContinue: () => void };
const emoji: Record<string,string> = { Chicken:'🍗','Chicken breast':'🍗',Beef:'🥩',Steak:'🥩',Salmon:'🐟',Turkey:'🍗',Tofu:'◻️',Shrimp:'🍤',Broccoli:'🥦',Spinach:'🥬','Bell pepper':'🫑',Carrot:'🥕',Zucchini:'🥒','Sweet potato':'🍠',Mushrooms:'🍄',Onion:'🧅',Garlic:'🧄',Olives:'🫒',Eggplant:'🍆',Rice:'🍚',Pasta:'🍝',Bread:'🍞',Eggs:'🥚' };

export function FoodSelectionScreen({ preferenceKey, percent, title, accent, subtitle, continueLabel='Continue', onContinue }: Props) {
  const { profile, update } = useOnboardingStore(); const [query,setQuery]=useState('');
  const selected=profile[preferenceKey];
  const normalized=query.trim().toLowerCase();
  const visible=useMemo(()=>foodCategories.map(category=>({...category,items:category.items.filter(item=>!normalized||item.toLowerCase().includes(normalized)).slice(0,normalized?30:9)})).filter(category=>category.items.length),[normalized]);
  const toggle=(item:string)=>{const next=selected.includes(item)?selected.filter(value=>value!==item):[...selected,item];void update(preferenceKey==='loves'?{loves:next}:{avoids:next})};
  return <OnboardingShell title={<>{title} <Text style={styles.accent}>{accent}</Text></>} percent={percent} footer={<Button label={continueLabel} onPress={onContinue}/>}>
    <Text style={styles.subtitle}>{subtitle}</Text>
    <View style={styles.search}><Ionicons color={colors.muted} name="search" size={18}/><TextInput autoCapitalize="none" autoCorrect={false} onChangeText={setQuery} placeholder="Search foods" placeholderTextColor={colors.muted} style={styles.searchInput} value={query}/>{query?<Pressable onPress={()=>setQuery('')}><Ionicons color={colors.muted} name="close-circle" size={19}/></Pressable>:null}</View>
    {visible.map(category=><View key={category.title} style={styles.section}><View style={styles.sectionHeader}><Text style={styles.sectionTitle}>{category.title}</Text><Text style={styles.count}>{category.items.filter(item=>selected.includes(item)).length ? `${category.items.filter(item=>selected.includes(item)).length} selected` : ''}</Text></View><View style={styles.grid}>{category.items.map(item=>{const active=selected.includes(item);return <Pressable accessibilityRole="button" accessibilityState={{selected:active}} key={item} onPress={()=>toggle(item)} style={[styles.food,active&&styles.foodActive,preferenceKey==='avoids'&&active&&styles.avoidActive]}><Text style={styles.emoji}>{emoji[item]||'🍽️'}</Text><Text numberOfLines={1} style={styles.foodName}>{item}</Text>{active?<Ionicons color={preferenceKey==='loves'?colors.herb:colors.coral} name="checkmark-circle" size={18} style={styles.check}/>:null}</Pressable>})}</View></View>)}
    {!visible.length?<Text style={styles.empty}>No foods match that search.</Text>:null}
    {preferenceKey==='avoids'?<Pressable onPress={()=>void update({avoids:[]})} style={[styles.nothing,!selected.length&&styles.nothingActive]}><Ionicons color={!selected.length?colors.herb:colors.muted} name={!selected.length?'checkmark-circle':'ellipse-outline'} size={22}/><Text style={styles.nothingText}>Nothing to avoid</Text></Pressable>:null}
  </OnboardingShell>;
}
const styles=StyleSheet.create({accent:{color:colors.coral},subtitle:{marginTop:-spacing.sm,color:colors.muted,fontSize:14,lineHeight:19},search:{minHeight:46,paddingHorizontal:12,flexDirection:'row',alignItems:'center',gap:8,borderWidth:1,borderColor:colors.line,borderRadius:radii.small,backgroundColor:colors.paperRaised},searchInput:{flex:1,color:colors.charcoal,fontSize:14},section:{gap:7},sectionHeader:{flexDirection:'row',alignItems:'center',justifyContent:'space-between'},sectionTitle:{color:colors.charcoal,...typography.label,fontSize:14},count:{color:colors.coralDark,fontSize:10,fontWeight:'700'},grid:{flexDirection:'row',flexWrap:'wrap',gap:7},food:{width:'31.8%',minHeight:76,padding:7,alignItems:'center',justifyContent:'center',borderWidth:1,borderColor:colors.line,borderRadius:12,backgroundColor:colors.paperRaised},foodActive:{borderColor:colors.herb,backgroundColor:colors.herbSoft},avoidActive:{borderColor:colors.coral,backgroundColor:'#FFF0ED'},emoji:{fontSize:25,marginBottom:4},foodName:{maxWidth:'100%',color:colors.charcoal,fontSize:10,fontWeight:'700',textAlign:'center'},check:{position:'absolute',right:4,top:4},nothing:{minHeight:52,paddingHorizontal:13,flexDirection:'row',alignItems:'center',gap:9,borderWidth:1,borderColor:colors.line,borderRadius:radii.small,backgroundColor:colors.paperRaised},nothingActive:{borderColor:colors.herb,backgroundColor:colors.herbSoft},nothingText:{color:colors.charcoal,fontWeight:'700'},empty:{color:colors.muted,textAlign:'center'}});
