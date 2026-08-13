import { Ionicons } from '@expo/vector-icons';
import { Redirect, Tabs, router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import { useAuthStore } from '@/data/auth-store';
import { useOnboardingStore } from '@/data/onboarding-store';
import { colors } from '@/theme';

const iconFor = (name: string, focused: boolean) => {
  const icons: Record<string, keyof typeof Ionicons.glyphMap> = {
    home: focused ? 'home' : 'home-outline',
    recipes: focused ? 'book' : 'book-outline',
    plan: focused ? 'calendar' : 'calendar-outline',
    groceries: focused ? 'basket' : 'basket-outline'
  };
  return icons[name] ?? 'ellipse-outline';
};

export default function TabLayout() {
  const { ready, user } = useAuthStore();
  const { ready: onboardingReady, profile } = useOnboardingStore();
  if (!ready || !onboardingReady) return <View style={styles.loading} />;
  if (!user) return <Redirect href="/onboarding/account" />;
  if (!profile.completed) return <Redirect href="/onboarding/profile" />;
  return (
    <Tabs screenOptions={({ route }) => ({
      headerShown: false,
      tabBarActiveTintColor: colors.coral,
      tabBarInactiveTintColor: colors.muted,
      tabBarStyle: styles.bar,
      tabBarLabelStyle: styles.label,
      tabBarIcon: ({ focused, color }) => <Ionicons color={color} name={iconFor(route.name, focused)} size={22} />
    })}>
      <Tabs.Screen name="home" options={{ title: 'Home' }} />
      <Tabs.Screen name="recipes" options={{ title: 'Recipes' }} />
      <Tabs.Screen name="capture-button" options={{
        title: '',
        tabBarButton: () => <View style={styles.captureWrap}><Pressable accessibilityLabel="Open Capture Studio" accessibilityRole="button" onPress={() => router.push('/capture')} style={styles.capture}><Ionicons color={colors.white} name="add" size={30} /></Pressable></View>
      }} />
      <Tabs.Screen name="plan" options={{ title: 'Plan' }} />
      <Tabs.Screen name="groceries" options={{ title: 'Groceries' }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  loading: { flex: 1, backgroundColor: colors.paper },
  bar: { height: 76, paddingBottom: 12, paddingTop: 8, backgroundColor: colors.paperRaised, borderTopColor: colors.line },
  label: { fontSize: 11, fontWeight: '700' },
  captureWrap: { width: 76, alignItems: 'center' },
  capture: { marginTop: -18, width: 58, height: 58, borderRadius: 29, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.coral, borderWidth: 4, borderColor: colors.paper, shadowColor: colors.charcoal, shadowOpacity: 0.18, shadowRadius: 8, shadowOffset: { width: 0, height: 4 } }
});
