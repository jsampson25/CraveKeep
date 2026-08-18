import { Ionicons } from '@expo/vector-icons';
import { useEffect, useMemo, useState } from 'react';
import { Image, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { OnboardingShell } from '@/components/onboarding-shell';
import { Button } from '@/components/ui';
import { foodCategories } from '@/data/food-catalog';
import { useOnboardingStore } from '@/data/onboarding-store';
import { colors, radii, spacing, typography } from '@/theme';
import foodsLoveMascot from '../../assets/onboarding/mascots/foods-you-love-guide.webp';
import foodsAvoidMascot from '../../assets/onboarding/mascots/foods-dont-like-guide.webp';

type PreferenceKey = 'loves' | 'avoids';
type Props = { preferenceKey: PreferenceKey; percent: number; title: string; accent: string; subtitle: string; continueLabel?: string; onContinue: () => void };
export const foodPhotos: Record<string, number> = {
  'Chicken breast': require('../../assets/onboarding/food-items/meat-0.webp'),
  'Chicken thighs': require('../../assets/onboarding/food-items/meat-1.webp'),
  'Ground chicken': require('../../assets/onboarding/food-items/meat-2.webp'),
  Turkey: require('../../assets/onboarding/food-items/meat-3.webp'),
  'Ground turkey': require('../../assets/onboarding/food-items/meat-4.webp'),
  Beef: require('../../assets/onboarding/food-items/meat-5.webp'),
  'Ground beef': require('../../assets/onboarding/food-items/meat-6.webp'),
  Steak: require('../../assets/onboarding/food-items/meat-7.webp'),
  Pork: require('../../assets/onboarding/food-items/meat-8.webp'),
  'Pork chops': require('../../assets/onboarding/food-items/meat-1.webp'),
  Bacon: require('../../assets/onboarding/food-items/meat-6.webp'),
  Ham: require('../../assets/onboarding/food-items/meat-5.webp'),
  Lamb: require('../../assets/onboarding/food-items/meat-7.webp'),
  Sausage: require('../../assets/onboarding/food-items/meat-2.webp'),
  Duck: require('../../assets/onboarding/food-items/meat-3.webp'),
  Tofu: require('../../assets/onboarding/food-items/seafood-2.webp'),
  Tempeh: require('../../assets/onboarding/food-items/seafood-3.webp'),
  Lentils: require('../../assets/onboarding/food-items/meat-6.webp'),
  'Black beans': require('../../assets/onboarding/food-items/meat-6.webp'),
  Chickpeas: require('../../assets/onboarding/food-items/meat-6.webp'),
  'Kidney beans': require('../../assets/onboarding/food-items/meat-6.webp'),
  'White beans': require('../../assets/onboarding/food-items/meat-6.webp'),
  Salmon: require('../../assets/onboarding/food-items/seafood-0.webp'),
  Tuna: require('../../assets/onboarding/food-items/seafood-1.webp'),
  Cod: require('../../assets/onboarding/food-items/seafood-2.webp'),
  Tilapia: require('../../assets/onboarding/food-items/seafood-3.webp'),
  Shrimp: require('../../assets/onboarding/food-items/seafood-4.webp'),
  Crab: require('../../assets/onboarding/food-items/seafood-5.webp'),
  Lobster: require('../../assets/onboarding/food-items/seafood-6.webp'),
  Scallops: require('../../assets/onboarding/food-items/seafood-7.webp'),
  Eggs: require('../../assets/onboarding/food-items/seafood-8.webp'),
  Onion: require('../../assets/onboarding/food-items-v2/vegetables/item-0.webp'),
  'Red onion': require('../../assets/onboarding/food-items-v2/vegetables/item-1.webp'),
  'Green onion': require('../../assets/onboarding/food-items-v2/vegetables/item-2.webp'),
  Garlic: require('../../assets/onboarding/food-items-v2/vegetables/item-3.webp'),
  Tomato: require('../../assets/onboarding/food-items-v2/vegetables/item-4.webp'),
  'Bell pepper': require('../../assets/onboarding/food-items-v2/vegetables/item-5.webp'),
  'Jalapeño': require('../../assets/onboarding/food-items-v2/vegetables/item-6.webp'),
  Carrot: require('../../assets/onboarding/food-items-v2/vegetables/item-7.webp'),
  Broccoli: require('../../assets/onboarding/food-items-v2/vegetables/item-8.webp'),
  Cauliflower: require('../../assets/onboarding/food-items-v2/vegetables/item-9.webp'),
  Spinach: require('../../assets/onboarding/food-items-v2/vegetables/item-10.webp'),
  Kale: require('../../assets/onboarding/food-items-v2/vegetables/item-11.webp'),
  Lettuce: require('../../assets/onboarding/food-items-v2/vegetables/item-12.webp'),
  Cabbage: require('../../assets/onboarding/food-items-v2/vegetables/item-13.webp'),
  Zucchini: require('../../assets/onboarding/food-items-v2/vegetables/item-14.webp'),
  'Yellow squash': require('../../assets/onboarding/food-items-v2/vegetables/item-15.webp'),
  Eggplant: require('../../assets/onboarding/food-items-v2/vegetables/item-16.webp'),
  Mushrooms: require('../../assets/onboarding/food-items-v2/vegetables/item-17.webp'),
  'Green beans': require('../../assets/onboarding/food-items-v2/vegetables/item-18.webp'),
  Peas: require('../../assets/onboarding/food-items-v2/vegetables/item-19.webp'),
  Corn: require('../../assets/onboarding/food-items-v2/vegetables/item-20.webp'),
  Celery: require('../../assets/onboarding/food-items-v2/vegetables/item-21.webp'),
  Cucumber: require('../../assets/onboarding/food-items-v2/vegetables/item-22.webp'),
  Asparagus: require('../../assets/onboarding/food-items-v2/vegetables/item-23.webp'),
  'Brussels sprouts': require('../../assets/onboarding/food-items-v2/vegetables/item-24.webp'),
  'Sweet potato': require('../../assets/onboarding/food-items-v2/vegetables/item-25.webp'),
  Potato: require('../../assets/onboarding/food-items-v2/vegetables/item-26.webp'),
  Beets: require('../../assets/onboarding/food-items-v2/vegetables/item-27.webp'),
  Radish: require('../../assets/onboarding/food-items-v2/vegetables/item-28.webp'),
  Artichoke: require('../../assets/onboarding/food-items-v2/vegetables/item-29.webp'),
  Apple: require('../../assets/onboarding/food-items-v2/fruits/item-0.webp'),
  Banana: require('../../assets/onboarding/food-items-v2/fruits/item-1.webp'),
  Orange: require('../../assets/onboarding/food-items-v2/fruits/item-2.webp'),
  Lemon: require('../../assets/onboarding/food-items-v2/fruits/item-3.webp'),
  Lime: require('../../assets/onboarding/food-items-v2/fruits/item-4.webp'),
  Strawberry: require('../../assets/onboarding/food-items-v2/fruits/item-5.webp'),
  Blueberry: require('../../assets/onboarding/food-items-v2/fruits/item-6.webp'),
  Raspberry: require('../../assets/onboarding/food-items-v2/fruits/item-7.webp'),
  Blackberry: require('../../assets/onboarding/food-items-v2/fruits/item-8.webp'),
  Grapes: require('../../assets/onboarding/food-items-v2/fruits/item-9.webp'),
  Watermelon: require('../../assets/onboarding/food-items-v2/fruits/item-10.webp'),
  Cantaloupe: require('../../assets/onboarding/food-items-v2/fruits/item-11.webp'),
  Pineapple: require('../../assets/onboarding/food-items-v2/fruits/item-12.webp'),
  Mango: require('../../assets/onboarding/food-items-v2/fruits/item-13.webp'),
  Peach: require('../../assets/onboarding/food-items-v2/fruits/item-14.webp'),
  Pear: require('../../assets/onboarding/food-items-v2/fruits/item-15.webp'),
  Plum: require('../../assets/onboarding/food-items-v2/fruits/item-16.webp'),
  Cherry: require('../../assets/onboarding/food-items-v2/fruits/item-17.webp'),
  Kiwi: require('../../assets/onboarding/food-items-v2/fruits/item-18.webp'),
  Avocado: require('../../assets/onboarding/food-items-v2/fruits/item-19.webp'),
  Coconut: require('../../assets/onboarding/food-items-v2/fruits/item-20.webp'),
  Pomegranate: require('../../assets/onboarding/food-items-v2/fruits/item-21.webp'),
  Rice: require('../../assets/onboarding/food-items-v2/staples/item-0.webp'),
  'Brown rice': require('../../assets/onboarding/food-items-v2/staples/item-1.webp'),
  Quinoa: require('../../assets/onboarding/food-items-v2/staples/item-2.webp'),
  Pasta: require('../../assets/onboarding/food-items-v2/staples/item-3.webp'),
  Bread: require('../../assets/onboarding/food-items-v2/staples/item-4.webp'),
  Oats: require('../../assets/onboarding/food-items-v2/staples/item-5.webp'),
  Couscous: require('../../assets/onboarding/food-items-v2/staples/item-6.webp'),
  Tortillas: require('../../assets/onboarding/food-items-v2/staples/item-7.webp'),
  Flour: require('../../assets/onboarding/food-items-v2/staples/item-8.webp'),
  Milk: require('../../assets/onboarding/food-items-v2/staples/item-9.webp'),
  'Almond milk': require('../../assets/onboarding/food-items-v2/staples/item-10.webp'),
  'Oat milk': require('../../assets/onboarding/food-items-v2/staples/item-11.webp'),
  Butter: require('../../assets/onboarding/food-items-v2/staples/item-12.webp'),
  'Greek yogurt': require('../../assets/onboarding/food-items-v2/staples/item-13.webp'),
  Cheddar: require('../../assets/onboarding/food-items-v2/staples/item-14.webp'),
  Mozzarella: require('../../assets/onboarding/food-items-v2/staples/item-15.webp'),
  Parmesan: require('../../assets/onboarding/food-items-v2/staples/item-16.webp'),
  'Cream cheese': require('../../assets/onboarding/food-items-v2/staples/item-17.webp'),
  Peanuts: require('../../assets/onboarding/food-items-v2/staples/item-18.webp'),
  Almonds: require('../../assets/onboarding/food-items-v2/staples/item-19.webp'),
  Cashews: require('../../assets/onboarding/food-items-v2/staples/item-20.webp'),
  Walnuts: require('../../assets/onboarding/food-items-v2/staples/item-21.webp'),
  Olives: require('../../assets/onboarding/food-items-v2/staples/item-22.webp'),
  Basil: require('../../assets/onboarding/food-items-v2/flavors/item-0.webp'),
  Cilantro: require('../../assets/onboarding/food-items-v2/flavors/item-1.webp'),
  Parsley: require('../../assets/onboarding/food-items-v2/flavors/item-2.webp'),
  Rosemary: require('../../assets/onboarding/food-items-v2/flavors/item-3.webp'),
  Thyme: require('../../assets/onboarding/food-items-v2/flavors/item-4.webp'),
  Dill: require('../../assets/onboarding/food-items-v2/flavors/item-5.webp'),
  Mint: require('../../assets/onboarding/food-items-v2/flavors/item-6.webp'),
  Oregano: require('../../assets/onboarding/food-items-v2/flavors/item-7.webp'),
  Ginger: require('../../assets/onboarding/food-items-v2/flavors/item-8.webp'),
  Turmeric: require('../../assets/onboarding/food-items-v2/flavors/item-9.webp'),
  Cumin: require('../../assets/onboarding/food-items-v2/flavors/item-10.webp'),
  Paprika: require('../../assets/onboarding/food-items-v2/flavors/item-11.webp'),
  Cinnamon: require('../../assets/onboarding/food-items-v2/flavors/item-12.webp'),
  'Chili powder': require('../../assets/onboarding/food-items-v2/flavors/item-13.webp'),
  'Soy sauce': require('../../assets/onboarding/food-items-v2/flavors/item-14.webp'),
  'Hot sauce': require('../../assets/onboarding/food-items-v2/flavors/item-15.webp'),
  Mustard: require('../../assets/onboarding/food-items-v2/flavors/item-16.webp'),
  Mayonnaise: require('../../assets/onboarding/food-items-v2/flavors/item-17.webp'),
  Honey: require('../../assets/onboarding/food-items-v2/flavors/item-18.webp'),
  'Maple syrup': require('../../assets/onboarding/food-items-v2/flavors/item-19.webp'),
};

export function FoodSelectionScreen({ preferenceKey, percent, title, accent, subtitle, continueLabel='Continue', onContinue }: Props) {
  const { profile, update } = useOnboardingStore(); const [query,setQuery]=useState('');
  const [apiResults,setApiResults]=useState<string[]>([]);
  const selected=profile[preferenceKey];
  const normalized=query.trim().toLowerCase();
  const visible=useMemo(()=>foodCategories.map(category=>({...category,items:category.items.filter(item=>!normalized||item.toLowerCase().includes(normalized)).slice(0,normalized?30:9)})).filter(category=>category.items.length),[normalized]);
  useEffect(()=>{
    if (normalized.length < 2) { setApiResults([]); return; }
    let cancelled=false;
    const timer=setTimeout(async()=>{
      try {
        const apiKey=process.env.EXPO_PUBLIC_FOODDATA_API_KEY || 'DEMO_KEY';
        const response=await fetch(`https://api.nal.usda.gov/fdc/v1/foods/search?api_key=${apiKey}&query=${encodeURIComponent(query.trim())}&pageSize=12&dataType=Foundation,SR%20Legacy`);
        if (!response.ok) throw new Error('Food search unavailable');
        const data=await response.json() as { foods?: Array<{ description?: string }> };
        const names=(data.foods ?? []).map(food=>food.description?.split(',')[0]?.split(' - ')[0]?.trim() ?? '').map(name=>name.toLowerCase().replace(/\b\w/g,letter=>letter.toUpperCase())).filter(Boolean);
        if (!cancelled) setApiResults([...new Set(names)].slice(0,9));
      } catch { if (!cancelled) setApiResults([]); }
    },300);
    return()=>{cancelled=true;clearTimeout(timer)};
  },[normalized,query]);
  const toggle=(item:string)=>{const next=selected.includes(item)?selected.filter(value=>value!==item):[...selected,item];void update(preferenceKey==='loves'?{loves:next}:{avoids:next})};
  return <OnboardingShell title={<>{title} <Text style={styles.accent}>{accent}</Text></>} percent={percent} footer={<Button label={continueLabel} onPress={onContinue}/>}>
    <Text style={styles.subtitle}>{subtitle}</Text>
    <View style={styles.search}><Ionicons color={colors.muted} name="search" size={18}/><TextInput autoCapitalize="none" autoCorrect={false} onChangeText={setQuery} placeholder="Search foods" placeholderTextColor={colors.muted} style={styles.searchInput} value={query}/>{query?<Pressable onPress={()=>setQuery('')}><Ionicons color={colors.muted} name="close-circle" size={19}/></Pressable>:null}</View>
    {apiResults.length?<View style={styles.section}><View style={styles.sectionHeader}><Text style={styles.sectionTitle}>Search results</Text><Text style={styles.count}>From food database</Text></View><View style={styles.grid}>{apiResults.map(item=>{const active=selected.includes(item);return <Pressable accessibilityRole="button" accessibilityState={{selected:active}} key={`api-${item}`} onPress={()=>toggle(item)} style={[styles.food,active&&styles.foodActive]}><View style={styles.apiFoodIcon}><Ionicons color={colors.herb} name="restaurant-outline" size={22}/></View><Text numberOfLines={2} style={styles.foodName}>{item}</Text>{active?<Ionicons color={colors.herb} name="checkmark-circle" size={18} style={styles.check}/>:null}</Pressable>})}</View></View>:null}
    {visible.map(category=><View key={category.title} style={styles.section}><View style={styles.sectionHeader}><Text style={styles.sectionTitle}>{category.title}</Text><Text style={styles.count}>{category.items.filter(item=>selected.includes(item)).length ? `${category.items.filter(item=>selected.includes(item)).length} selected` : ''}</Text></View><View style={styles.grid}>{category.items.map(item=>{const active=selected.includes(item);const photo=foodPhotos[item];return <Pressable accessibilityRole="button" accessibilityState={{selected:active}} key={item} onPress={()=>toggle(item)} style={[styles.food,active&&styles.foodActive,preferenceKey==='avoids'&&active&&styles.avoidActive]}>{photo?<Image accessibilityLabel={item} resizeMode="contain" source={photo} style={styles.foodPhoto}/>:null}<Text numberOfLines={1} style={styles.foodName}>{item}</Text>{active?<Ionicons color={preferenceKey==='loves'?colors.herb:colors.coral} name="checkmark-circle" size={18} style={styles.check}/>:null}</Pressable>})}</View></View>)}
    {!visible.length?<Text style={styles.empty}>No foods match that search.</Text>:null}
    {preferenceKey==='avoids'?<Pressable onPress={()=>void update({avoids:[]})} style={[styles.nothing,!selected.length&&styles.nothingActive]}><Ionicons color={!selected.length?colors.herb:colors.muted} name={!selected.length?'checkmark-circle':'ellipse-outline'} size={22}/><Text style={styles.nothingText}>Nothing to avoid</Text></Pressable>:null}
    <View style={styles.mascotStage}><Image accessibilityLabel={preferenceKey==='loves'?'CraveKeep mascot presenting favorite foods':'CraveKeep mascot helping set aside foods to avoid'} resizeMode="contain" source={preferenceKey==='loves'?foodsLoveMascot:foodsAvoidMascot} style={styles.mascot}/></View>
  </OnboardingShell>;
}
const styles=StyleSheet.create({accent:{color:colors.coral},subtitle:{marginTop:-spacing.sm,color:colors.muted,fontSize:14,lineHeight:19},search:{minHeight:46,paddingHorizontal:12,flexDirection:'row',alignItems:'center',gap:8,borderWidth:1,borderColor:colors.line,borderRadius:radii.small,backgroundColor:'#FFFFFF'},searchInput:{flex:1,color:colors.charcoal,fontSize:14},section:{gap:7},sectionHeader:{flexDirection:'row',alignItems:'center',justifyContent:'space-between'},sectionTitle:{color:colors.charcoal,...typography.label,fontSize:14},count:{color:colors.coralDark,fontSize:10,fontWeight:'700'},grid:{flexDirection:'row',flexWrap:'wrap',gap:7},food:{width:'31.8%',height:104,padding:6,alignItems:'center',justifyContent:'flex-end',overflow:'hidden',borderWidth:1,borderColor:colors.line,borderRadius:12,backgroundColor:'#FFFFFF'},foodActive:{borderColor:colors.herb,backgroundColor:colors.herbSoft},avoidActive:{borderColor:colors.coral,backgroundColor:'#FFF0ED'},foodPhoto:{width:76,height:66,marginBottom:4,alignSelf:'center'},apiFoodIcon:{height:66,alignItems:'center',justifyContent:'center'},foodName:{maxWidth:'100%',color:colors.charcoal,fontSize:10,fontWeight:'700',textAlign:'center'},check:{position:'absolute',right:4,top:4,backgroundColor:'#FFFFFF',borderRadius:9},nothing:{minHeight:52,paddingHorizontal:13,flexDirection:'row',alignItems:'center',gap:9,borderWidth:1,borderColor:colors.line,borderRadius:radii.small,backgroundColor:'#FFFFFF'},nothingActive:{borderColor:colors.herb,backgroundColor:colors.herbSoft},nothingText:{color:colors.charcoal,fontWeight:'700'},mascotStage:{height:210,marginTop:4,alignItems:'center',justifyContent:'flex-end'},mascot:{width:172,height:208},empty:{color:colors.muted,textAlign:'center'}});
