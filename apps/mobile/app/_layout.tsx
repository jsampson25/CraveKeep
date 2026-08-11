import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RecipeStoreProvider } from '@/data/recipe-store';
import { colors } from '@/theme';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <RecipeStoreProvider>
        <StatusBar style="dark" />
        <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.paper } }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="capture" options={{ presentation: 'modal' }} />
          <Stack.Screen name="recipes/new" options={{ presentation: 'modal' }} />
          <Stack.Screen name="recipes/[id]" />
          <Stack.Screen name="cook/[id]" />
        </Stack>
      </RecipeStoreProvider>
    </SafeAreaProvider>
  );
}
