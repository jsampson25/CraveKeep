import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RecipeStoreProvider } from '@/data/recipe-store';
import { ImportStoreProvider } from '@/data/import-store';
import { AuthStoreProvider } from '@/data/auth-store';
import { NutritionStoreProvider } from '@/data/nutrition-store';
import { colors } from '@/theme';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AuthStoreProvider>
        <RecipeStoreProvider>
          <NutritionStoreProvider>
          <ImportStoreProvider>
        <StatusBar style="dark" />
        <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.paper } }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="capture" options={{ presentation: 'modal' }} />
          <Stack.Screen name="capture/link" />
          <Stack.Screen name="capture/media" />
          <Stack.Screen name="capture/preview" />
          <Stack.Screen name="capture/processing" />
          <Stack.Screen name="capture/review" />
          <Stack.Screen name="imports" />
          <Stack.Screen name="profile" options={{ presentation: 'modal' }} />
          <Stack.Screen name="recipes/new" options={{ presentation: 'modal' }} />
          <Stack.Screen name="recipes/[id]" />
          <Stack.Screen name="recipes/[id]/remix" />
          <Stack.Screen name="recipes/[id]/nutrition" />
          <Stack.Screen name="recipes/[id]/fit" />
          <Stack.Screen name="cook/[id]" />
        </Stack>
          </ImportStoreProvider>
          </NutritionStoreProvider>
        </RecipeStoreProvider>
      </AuthStoreProvider>
    </SafeAreaProvider>
  );
}
