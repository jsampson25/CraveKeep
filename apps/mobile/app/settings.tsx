import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Card, Eyebrow, Screen, SectionTitle, Title } from '@/components/ui';
import { colors, radii, spacing } from '@/theme';

const groups = [
  { title: 'Your kitchen', items: [
    ['options-outline', 'Preferences', 'Foods, cuisines, dietary style', '/onboarding/food-profile'],
    ['nutrition-outline', 'Nutrition goals', 'Calories, macros, activity', '/onboarding/nutrition-goals'],
    ['people-outline', 'Household', 'Members and shared planning', '/onboarding/household'],
  ] },
  { title: 'Account & app', items: [
    ['person-circle-outline', 'Account', 'Profile and sign-in details', '/profile'],
    ['notifications-outline', 'Notifications', 'Meal, grocery, and import reminders', '/settings/notifications'],
    ['link-outline', 'Connected sources', 'Import sources and permissions', '/settings/sources'],
    ['card-outline', 'Subscription', 'Plan and billing', '/settings/subscription'],
  ] },
  { title: 'Privacy & support', items: [
    ['lock-closed-outline', 'Privacy & data', 'Export, sharing, and deletion', '/settings/privacy'],
    ['help-circle-outline', 'Help & feedback', 'Get help or send a suggestion', '/settings/help'],
    ['information-circle-outline', 'About CraveKeep', 'Version, terms, and acknowledgements', '/settings/about'],
  ] },
] as const;

export default function SettingsScreen() {
  return <Screen><ScrollView contentContainerStyle={styles.content}><View style={styles.header}><View><Eyebrow>CRAVEKEEP</Eyebrow><MotionSlot name="onboarding-preferences" size={76} accessibilityLabel="Animated account settings" /><Title>Settings</Title></View><View style={styles.icon}><Ionicons color={colors.white} name='settings-outline' size={24} /></View></View><Card style={styles.accountCard}><View style={styles.avatar}><Text style={styles.avatarText}>CK</Text></View><View style={styles.flex}><Text style={styles.accountTitle}>Make CraveKeep yours.</Text><Text style={styles.body}>Tune suggestions, goals, and household planning from one place.</Text></View></Card>{groups.map((group) => <View key={group.title}><SectionTitle>{group.title}</SectionTitle><Card style={styles.panel}>{group.items.map(([icon, title, detail, href]) => <Pressable accessibilityRole='button' key={title} onPress={() => href ? router.push(href as never) : undefined} style={styles.row}><View style={styles.rowIcon}><Ionicons color={colors.coral} name={icon as keyof typeof Ionicons.glyphMap} size={20} /></View><View style={styles.flex}><Text style={styles.rowTitle}>{title}</Text><Text style={styles.rowDetail}>{detail}</Text></View>{href ? <Ionicons color={colors.muted} name='chevron-forward' size={18} /> : <Text style={styles.coming}>Soon</Text>}</Pressable>)}</Card></View>)}<Text style={styles.footer}>CraveKeep keeps your recipes private by default.</Text></ScrollView></Screen>;
}

const styles=StyleSheet.create({ content:{padding:spacing.lg,gap:spacing.lg,paddingBottom:100},header:{flexDirection:'row',alignItems:'center',justifyContent:'space-between'},icon:{width:48,height:48,borderRadius:24,backgroundColor:colors.coral,alignItems:'center',justifyContent:'center'},accountCard:{flexDirection:'row',alignItems:'center',gap:spacing.md,backgroundColor:colors.lavenderSoft,borderWidth:0},avatar:{width:56,height:56,borderRadius:28,backgroundColor:colors.charcoal,alignItems:'center',justifyContent:'center'},avatarText:{color:colors.white,fontWeight:'900'},flex:{flex:1,gap:3},accountTitle:{color:colors.charcoal,fontSize:18,fontWeight:'900'},body:{color:colors.muted,lineHeight:20},panel:{padding:0,overflow:'hidden'},row:{minHeight:70,padding:spacing.md,flexDirection:'row',alignItems:'center',gap:spacing.md,borderBottomWidth:1,borderBottomColor:colors.line},rowIcon:{width:40,height:40,borderRadius:14,backgroundColor:colors.mintSoft,alignItems:'center',justifyContent:'center'},rowTitle:{color:colors.charcoal,fontSize:15,fontWeight:'900'},rowDetail:{color:colors.muted,fontSize:12},coming:{color:colors.coralDark,fontSize:11,fontWeight:'800'},footer:{color:colors.muted,textAlign:'center',fontSize:12}});
