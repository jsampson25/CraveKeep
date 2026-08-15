import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Card, Screen, Title } from '@/components/ui';
import { colors, radii, spacing, typography } from '@/theme';

const picks = [
  { title: 'Creamy Tomato Burrata Pasta', detail: '25 min · Easy · Vegetarian', icon: 'restaurant-outline', color: colors.coral, soft: '#FFF0ED' },
  { title: 'Hot Honey Salmon Bowls', detail: '30 min · High protein', icon: 'flame-outline', color: colors.lemon, soft: colors.lemonSoft },
  { title: 'Green Goddess Chopped Salad', detail: '15 min · Fresh and quick', icon: 'leaf-outline', color: colors.herb, soft: colors.herbSoft },
  { title: 'One-Pan Lemon Orzo', detail: '20 min · Weeknight win', icon: 'sunny-outline', color: colors.mint, soft: colors.mintSoft },
];

export default function DiscoverScreen() {
  return <Screen><ScrollView contentContainerStyle={styles.content}>
    <View style={styles.header}><View><Text style={styles.eyebrow}>DISCOVER</Text><Title>Find your next favorite.</Title></View><View style={styles.icon}><Ionicons color={colors.white} name="sparkles" size={23} /></View></View>
    <Pressable accessibilityRole="button" onPress={() => router.push('/(tabs)/recipes')} style={styles.search}><Ionicons color={colors.muted} name="search" size={20} /><Text style={styles.searchText}>Search recipes, ingredients, cuisines…</Text></Pressable>
    <View style={styles.chips}>{['For you', 'High protein', 'Quick & easy', 'Low carb'].map((label, index) => <View key={label} style={[styles.chip, index === 0 && styles.chipActive]}><Text style={[styles.chipText, index === 0 && styles.chipTextActive]}>{label}</Text></View>)}</View>
    <Text style={styles.section}>Top picks for you</Text>{picks.map((item) => <Card key={item.title} style={styles.card}><View style={[styles.art, { backgroundColor: item.soft }]}><Ionicons color={item.color} name={item.icon as keyof typeof Ionicons.glyphMap} size={40} /></View><View style={styles.cardCopy}><Text style={styles.cardTitle}>{item.title}</Text><Text style={styles.detail}>{item.detail}</Text><Pressable accessibilityRole="button" onPress={() => router.push('/(tabs)/recipes')} style={styles.save}><Text style={styles.saveText}>Explore recipe</Text><Ionicons color={colors.coralDark} name="arrow-forward" size={16} /></Pressable></View></Card>)}
    <Text style={styles.section}>Build your collection</Text><Card style={styles.collection}><Ionicons color={colors.herb} name="book-outline" size={29} /><View style={styles.flex}><Text style={styles.cardTitle}>Save something you love.</Text><Text style={styles.detail}>Capture a recipe from a link, photo, or your own kitchen.</Text></View><Pressable accessibilityLabel="Open Capture Studio" onPress={() => router.push('/capture')}><Ionicons color={colors.coral} name="add-circle" size={29} /></Pressable></Card>
  </ScrollView></Screen>;
}

const styles=StyleSheet.create({content:{padding:spacing.lg,gap:spacing.md,paddingBottom:110},header:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',gap:spacing.md},eyebrow:{color:colors.coralDark,...typography.label,letterSpacing:1.1},icon:{width:48,height:48,borderRadius:24,alignItems:'center',justifyContent:'center',backgroundColor:colors.coral},search:{minHeight:52,flexDirection:'row',alignItems:'center',gap:spacing.sm,paddingHorizontal:spacing.md,borderWidth:1,borderColor:colors.line,borderRadius:radii.round,backgroundColor:colors.paperRaised},searchText:{color:colors.muted},chips:{flexDirection:'row',gap:spacing.sm,flexWrap:'wrap'},chip:{paddingHorizontal:12,paddingVertical:8,borderRadius:radii.round,borderWidth:1,borderColor:colors.line},chipActive:{backgroundColor:colors.coral,borderColor:colors.coral},chipText:{color:colors.charcoal,fontWeight:'800',fontSize:12},chipTextActive:{color:colors.white},section:{color:colors.charcoal,fontSize:18,fontWeight:'900',marginTop:spacing.sm},card:{flexDirection:'row',gap:spacing.md,alignItems:'center'},art:{width:82,height:82,borderRadius:radii.medium,alignItems:'center',justifyContent:'center'},cardCopy:{flex:1,gap:4},cardTitle:{color:colors.charcoal,fontSize:16,fontWeight:'900'},detail:{color:colors.muted,lineHeight:19},save:{alignSelf:'flex-start',flexDirection:'row',alignItems:'center',gap:5,marginTop:4},saveText:{color:colors.coralDark,fontWeight:'800'},collection:{flexDirection:'row',alignItems:'center',gap:spacing.md,backgroundColor:colors.herbSoft},flex:{flex:1,gap:3}});
