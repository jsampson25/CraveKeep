import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Button, Card, Screen, Title } from '@/components/ui';
import { colors, radii, spacing } from '@/theme';

const sections = {
  notifications: { title: 'Notifications', icon: 'notifications-outline', intro: 'Choose the moments when CraveKeep should reach out.', rows: ['Recipe reminders', 'Meal plan reminders', 'Grocery list updates', 'Import completion', 'Community activity'] },
  sources: { title: 'Connected sources', icon: 'link-outline', intro: 'Control where CraveKeep can capture recipes from.', rows: ['YouTube', 'Pinterest', 'Website links', 'Photo library', 'Camera'] },
  subscription: { title: 'Subscription', icon: 'card-outline', intro: 'Manage your CraveKeep plan and premium features.', rows: ['Current plan', 'Renewal date', 'Included features', 'Payment method', 'Cancel subscription'] },
  privacy: { title: 'Privacy & data', icon: 'lock-closed-outline', intro: 'Your recipes and preference data stay under your control.', rows: ['Private profile', 'Export my data', 'Data sharing', 'Delete account'] },
  help: { title: 'Help & feedback', icon: 'help-circle-outline', intro: 'Find answers or tell us how CraveKeep can be better.', rows: ['Getting started', 'Recipe importing help', 'Nutrition questions', 'Send feedback', 'Contact support'] },
  about: { title: 'About CraveKeep', icon: 'information-circle-outline', intro: 'The bright kitchen companion for recipes, planning, shopping, and cooking.', rows: ['Version 0.1.0', 'Terms of service', 'Privacy policy', 'Acknowledgements'] },
} as const;

export default function SettingsDetailScreen() {
  const { section } = useLocalSearchParams<{ section: keyof typeof sections }>();
  const data = sections[section ?? 'notifications'] ?? sections.notifications;
  return <Screen><ScrollView contentContainerStyle={styles.content}><Button label='Back to settings' variant='quiet' onPress={() => router.back()} /><View style={styles.hero}><View style={styles.icon}><Ionicons color={colors.white} name={data.icon as keyof typeof Ionicons.glyphMap} size={28} /></View><Title>{data.title}</Title><Text style={styles.intro}>{data.intro}</Text></View><Card style={styles.panel}>{data.rows.map((row, index) => <View key={row} style={styles.row}><View style={[styles.dot, index === 0 && styles.dotActive]} /><View style={styles.flex}><Text style={styles.rowTitle}>{row}</Text><Text style={styles.rowDetail}>{index === 0 ? 'Review and manage this setting' : 'Available in the next setup step'}</Text></View><Ionicons color={colors.muted} name='chevron-forward' size={18} /></View>)}</Card><Card style={styles.note}><Ionicons color={colors.coral} name='sparkles-outline' size={22} /><Text style={styles.noteText}>This area is part of the CraveKeep rebrand foundation and will continue expanding with the rest of the product.</Text></Card></ScrollView></Screen>;
}

const styles=StyleSheet.create({content:{padding:spacing.lg,gap:spacing.lg,paddingBottom:100},hero:{gap:spacing.sm},icon:{width:58,height:58,borderRadius:20,backgroundColor:colors.coral,alignItems:'center',justifyContent:'center'},intro:{color:colors.muted,fontSize:16,lineHeight:23},panel:{padding:0,overflow:'hidden'},row:{minHeight:68,padding:spacing.md,flexDirection:'row',alignItems:'center',gap:spacing.md,borderBottomWidth:1,borderBottomColor:colors.line},dot:{width:12,height:12,borderRadius:6,backgroundColor:colors.lavender},dotActive:{backgroundColor:colors.mint},flex:{flex:1,gap:3},rowTitle:{color:colors.charcoal,fontWeight:'900'},rowDetail:{color:colors.muted,fontSize:12},note:{flexDirection:'row',alignItems:'center',gap:spacing.sm,backgroundColor:colors.lavenderSoft,borderWidth:0},noteText:{flex:1,color:colors.charcoal,lineHeight:20}});
