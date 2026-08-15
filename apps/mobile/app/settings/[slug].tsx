import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { useEffect, useState } from 'react';
import { Card, Screen, SectionTitle, Title } from '@/components/ui';
import { colors, radii, spacing, typography } from '@/theme';

const NOTIFICATION_SETTINGS_KEY = 'cravekeep.notifications.v1';

const pages = {
  notifications: { title: 'Notifications', eyebrow: 'ACCOUNT & APP', icon: 'notifications-outline', intro: 'Choose the reminders that help without creating noise.', groups: [['Recipe reminders', 'Get a reminder when saved recipes are ready to cook.'], ['Meal plan reminders', 'Stay on track with upcoming meals and prep.'], ['Grocery list updates', 'Know when your shared list changes.']] },
  sources: { title: 'Connected sources', eyebrow: 'ACCOUNT & APP', icon: 'link-outline', intro: 'Manage the places CraveKeep can import recipes from.', groups: [['YouTube', 'Import recipes from videos you save or share.'], ['Pinterest', 'Capture recipe pins into your collection.'], ['Websites and photos', 'Import from a recipe URL, image, or scan.']] },
  subscription: { title: 'Subscription', eyebrow: 'ACCOUNT & APP', icon: 'card-outline', intro: 'Your plan and billing details will live here.', groups: [['CraveKeep Premium', 'Unlock advanced imports, nutrition tools, and household planning.'], ['Billing', 'Manage payment method and renewal settings.'], ['Restore purchases', 'Restore access on a new device.']] },
  privacy: { title: 'Privacy & data', eyebrow: 'PRIVACY & SUPPORT', icon: 'lock-closed-outline', intro: 'Your recipes and preferences stay private by default.', groups: [['Export my data', 'Download your recipes, meal plans, and preferences.'], ['Sharing controls', 'Choose what household members and friends can see.'], ['Delete account', 'Permanently remove your CraveKeep account and data.']] },
  help: { title: 'Help & feedback', eyebrow: 'PRIVACY & SUPPORT', icon: 'help-circle-outline', intro: 'Find answers or tell us what would make CraveKeep better.', groups: [['Getting started', 'Learn how to save recipes, plan meals, and shop from your list.'], ['Send feedback', 'Share an idea, report a problem, or request a feature.'], ['Contact support', 'Get help with your account or imported recipes.']] },
  about: { title: 'About CraveKeep', eyebrow: 'PRIVACY & SUPPORT', icon: 'information-circle-outline', intro: 'A bright kitchen companion for every recipe you want to keep.', groups: [['Version', 'CraveKeep web preview · Rebrand foundation'], ['Terms of service', 'Review the terms that guide your use of CraveKeep.'], ['Acknowledgements', 'Built with care for home cooks and their households.']] },
} as const;

type Slug = keyof typeof pages;

export default function SettingsDetailScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const page = pages[(slug ?? 'about') as Slug] ?? pages.about;
  const interactive = slug === 'notifications';
  const [notificationState, setNotificationState] = useState([true, true, false]);
  const [notificationsLoaded, setNotificationsLoaded] = useState(false);
  useEffect(() => { if (!interactive) return; void AsyncStorage.getItem(NOTIFICATION_SETTINGS_KEY).then((value) => { if (!value) { setNotificationsLoaded(true); return; } try { const parsed = JSON.parse(value); if (Array.isArray(parsed) && parsed.every((item) => typeof item === 'boolean')) setNotificationState(parsed.slice(0, 3)); } catch { /* keep defaults */ } finally { setNotificationsLoaded(true); } }); }, [interactive]);
  useEffect(() => { if (interactive && notificationsLoaded) void AsyncStorage.setItem(NOTIFICATION_SETTINGS_KEY, JSON.stringify(notificationState)); }, [interactive, notificationState, notificationsLoaded]);
  return <Screen><ScrollView contentContainerStyle={styles.content}>
    <Pressable accessibilityLabel="Go back" accessibilityRole="button" onPress={() => router.back()} style={styles.back}><Ionicons color={colors.charcoal} name="arrow-back" size={22} /></Pressable>
    <View style={styles.heading}><View style={styles.icon}><Ionicons color={colors.white} name={page.icon} size={25} /></View><Text style={styles.eyebrow}>{page.eyebrow}</Text><Title>{page.title}</Title><Text style={styles.intro}>{page.intro}</Text></View>
    {page.groups.map(([title, detail], index) => <View key={title}><SectionTitle>{title}</SectionTitle><Card style={styles.row}><View style={styles.flex}><Text style={styles.rowTitle}>{title}</Text><Text style={styles.detail}>{detail}</Text></View>{interactive ? <Switch accessibilityLabel={title} onValueChange={(value) => setNotificationState((current) => current.map((item, itemIndex) => itemIndex === index ? value : item))} trackColor={{ false: colors.line, true: colors.coral }} thumbColor={colors.white} value={notificationState[index] ?? false} /> : <Ionicons color={colors.muted} name="chevron-forward" size={19} />}</Card></View>)}
    <Card style={styles.note}><Ionicons color={colors.herb} name="shield-checkmark-outline" size={24} /><Text style={styles.noteText}>You can change these choices anytime from Settings.</Text></Card>
  </ScrollView></Screen>;
}

const styles = StyleSheet.create({
  content: { padding: spacing.lg, gap: spacing.lg, paddingBottom: 110 }, back: { width: 42, height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.paperRaised, borderWidth: 1, borderColor: colors.line }, heading: { gap: spacing.sm }, icon: { width: 54, height: 54, borderRadius: 18, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.coral }, eyebrow: { color: colors.coralDark, ...typography.label, fontSize: 11, letterSpacing: 1 }, intro: { color: colors.muted, fontSize: 15, lineHeight: 22 }, row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md }, flex: { flex: 1, gap: 4 }, rowTitle: { color: colors.charcoal, fontSize: 16, fontWeight: '900' }, detail: { color: colors.muted, lineHeight: 19 }, note: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, backgroundColor: colors.herbSoft }, noteText: { flex: 1, color: colors.herb, fontWeight: '700', lineHeight: 19 }
});
