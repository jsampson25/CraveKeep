import { summarizePlannedDay, type DailyNutritionTargets, type Recipe } from '@cravekeep/domain';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { ActivityIndicator, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { MotionSlot } from '@/components/animations/MotionSlot';
import { RecipeArt } from '@/components/recipe-art';
import { Screen } from '@/components/ui';
import { useAuthStore } from '@/data/auth-store';
import { useGroceryStore } from '@/data/grocery-store';
import { useNutritionStore } from '@/data/nutrition-store';
import { useOnboardingStore } from '@/data/onboarding-store';
import { usePantryStore } from '@/data/pantry-store';
import { usePlanningStore } from '@/data/planning-store';
import { useRecipeStore } from '@/data/recipe-store';
import { colors, radii, spacing, typography } from '@/theme';
import brandLogo from '../../assets/brand/welcome-logo-lockup.png';
import morningBackground from '../../assets/brand/home-morning.jpg';
import afternoonBackground from '../../assets/brand/home-afternoon.jpg';
import eveningBackground from '../../assets/brand/home-evening.jpg';

const toLocalDate = (date: Date) => date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0') + '-' + String(date.getDate()).padStart(2, '0');
const numberFromTarget = (value: string) => Number.parseInt(value, 10) || 0;
const recipeTime = (recipe: Recipe) => recipe.prepMinutes + recipe.cookMinutes;

export default function HomeScreen() {
  const { recipes, ready, error, toggleFavorite } = useRecipeStore();
  const { user } = useAuthStore();
  const { profile } = useOnboardingStore();
  const { estimates } = useNutritionStore();
  const { meals, targets } = usePlanningStore();
  const { items: groceries } = useGroceryStore();
  const { items: pantry } = usePantryStore();
  const [nutritionMode, setNutritionMode] = useState<'consumed' | 'planned'>('consumed');

  const metadataName = (user?.user_metadata.display_name || user?.user_metadata.full_name || user?.user_metadata.name) as string | undefined;
  const emailName = user?.email?.split('@')[0]?.replace(/[._-]+/g, ' ');
  const displayName = profile.displayName.trim() || metadataName?.trim() || emailName?.trim() || 'Friend';
  const firstName = displayName.split(/\s+/)[0];
  const initials = displayName.split(/\s+/).map(part => part[0]).join('').slice(0, 2).toUpperCase();
  const hour = new Date().getHours();
  const timeOfDay = hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : 'evening';
  const greeting = timeOfDay === 'morning' ? 'Good morning' : timeOfDay === 'afternoon' ? 'Good afternoon' : 'Good evening';
  const heroMessage = timeOfDay === 'morning' ? 'Let’s make today delicious.' : timeOfDay === 'afternoon' ? 'Ready to plan something good?' : 'What sounds good for dinner?';
  const heroBackground = timeOfDay === 'morning' ? morningBackground : timeOfDay === 'afternoon' ? afternoonBackground : eveningBackground;

  const today = toLocalDate(new Date());
  const todayMeals = useMemo(() => meals.filter(meal => meal.date === today), [meals, today]);
  const dinnerMeal = todayMeals.find(meal => meal.slot === 'dinner');
  const dinnerRecipe = recipes.find(recipe => recipe.id === dinnerMeal?.recipeId);
  const nutritionTargets: DailyNutritionTargets = targets ?? {
    calories: profile.calories,
    proteinGrams: numberFromTarget(profile.protein),
    carbohydrateGrams: numberFromTarget(profile.carbs),
    fatGrams: numberFromTarget(profile.fat),
    sodiumMilligrams: 2300
  };
  const daySummary = useMemo(() => summarizePlannedDay(todayMeals, estimates, nutritionTargets), [estimates, nutritionTargets, todayMeals]);
  const nutritionValues = nutritionMode === 'consumed' ? daySummary.eaten : daySummary.planned;
  const isNewUser = recipes.length === 0 && meals.length === 0 && groceries.length === 0 && pantry.length === 0;
  const completedSetup = [recipes.length > 0, meals.length > 0, groceries.length > 0, pantry.length > 0].filter(Boolean).length;
  const recent = recipes.slice(0, 5);
  const recommendations = recipes.slice().sort((a, b) => recipeTime(a) - recipeTime(b)).slice(0, 4);
  const favorites = recipes.filter(recipe => recipe.favorite).slice(0, 5);
  const checkedGroceries = groceries.filter(item => item.checked);
  const activeGroceries = groceries.filter(item => !item.checked);
  const groceryProgress = groceries.length ? Math.round((checkedGroceries.length / groceries.length) * 100) : 0;
  const soonPantry = pantry.filter(item => item.expiresOn).sort((a, b) => (a.expiresOn || '').localeCompare(b.expiresOn || '')).slice(0, 4);
  const week = useMemo(() => Array.from({ length: 7 }, (_, offset) => {
    const date = new Date(); date.setDate(date.getDate() + offset);
    const dateValue = toLocalDate(date);
    const meal = meals.find(candidate => candidate.date === dateValue && candidate.slot === 'dinner');
    return { date: dateValue, label: date.toLocaleDateString(undefined, { weekday: 'short' }), meal, recipe: recipes.find(recipe => recipe.id === meal?.recipeId) };
  }), [meals, recipes]);
  const plannedDinnerCount = week.filter(day => day.meal).length;

  return <Screen><ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
    <View style={styles.header}><Image accessibilityLabel="CraveKeep" resizeMode="contain" source={brandLogo} style={styles.logo} /><View style={styles.headerActions}><Pressable accessibilityLabel="Open notifications" onPress={() => router.push('/notifications')} style={styles.iconButton}><Ionicons color={colors.charcoal} name="notifications-outline" size={20} /></Pressable><Pressable accessibilityLabel="Open profile and settings" onPress={() => router.push('/profile')} style={styles.avatar}><Text style={styles.avatarText}>{initials}</Text></Pressable></View></View>

    <View style={styles.hero}>
      <Image accessibilityIgnoresInvertColors resizeMode="cover" source={heroBackground} style={styles.heroBackground} />
      <View style={[styles.heroShade, timeOfDay === 'evening' && styles.eveningShade]} />
      <View style={styles.heroCopy}><Text style={[styles.greeting, timeOfDay === 'evening' && styles.lightText]}>{greeting},{'\n'}{firstName}</Text><Text style={[styles.heroMessage, timeOfDay === 'evening' && styles.lightSubtext]}>{heroMessage}</Text></View>
      <MotionSlot name={timeOfDay === 'morning' ? 'mascot-morning' : timeOfDay === 'evening' ? 'mascot-evening' : 'onboarding-recipe-card'} size={116} accessibilityLabel={'CraveKeep mascot in a ' + timeOfDay + ' cooking scene'} style={styles.heroMascot} />
    </View>

    {error ? <Text accessibilityRole="alert" style={styles.error}>{error}</Text> : null}
    {!ready ? <ActivityIndicator color={colors.coral} /> : null}

    {isNewUser ? <NewUserDashboard firstName={firstName} completed={completedSetup} /> : <>
      {profile.goal !== 'none' ? <NutritionCard mode={nutritionMode} onModeChange={setNutritionMode} values={nutritionValues} targets={nutritionTargets} hasMeals={todayMeals.length > 0} remaining={daySummary.remaining} /> : null}
      <QuickCapture />
      {dinnerRecipe && dinnerMeal ? <DinnerCard recipe={dinnerRecipe} servings={dinnerMeal.servings} /> : <EmptyDinner />}
      {recent.length ? <RecipeCarousel title="Recently Saved" recipes={recent} onFavorite={toggleFavorite} /> : null}
      {recommendations.length ? <RecipeCarousel title="Cook From Your Recipes" recipes={recommendations} labelRecipes onFavorite={toggleFavorite} /> : null}
      <WeekPlan days={week} count={plannedDinnerCount} />
      <GrocerySnapshot active={activeGroceries.map(item => item.name)} complete={checkedGroceries.length} total={groceries.length} progress={groceryProgress} />
      <PantrySnapshot items={soonPantry.map(item => ({ name: item.name, quantity: item.quantity, expiresOn: item.expiresOn }))} />
      {favorites.length ? <RecipeCarousel title="Favorites" recipes={favorites} onFavorite={toggleFavorite} /> : null}
    </>}
  </ScrollView></Screen>;
}

function SectionHeader({ title, action, onPress }: { title: string; action?: string; onPress?: () => void }) {
  return <View style={styles.sectionHeader}><Text style={styles.sectionTitle}>{title}</Text>{action && onPress ? <Pressable onPress={onPress}><Text style={styles.sectionAction}>{action}  ›</Text></Pressable> : null}</View>;
}

function NewUserDashboard({ firstName, completed }: { firstName: string; completed: number }) {
  const progress = Math.round(((completed + 1) / 5) * 100);
  return <>
    <View style={styles.setupCard}>
      <View style={styles.setupTop}><View><Text style={styles.setupTitle}>Your kitchen is <Text style={styles.setupAccent}>{progress}% ready</Text></Text><Text style={styles.setupSubtext}>Preferences complete—now bring your kitchen to life.</Text></View><MotionSlot name="onboarding-preferences" size={76} accessibilityLabel="CraveKeep mascot guiding setup" /></View>
      <View style={styles.setupTrack}><View style={[styles.setupFill, { width: (progress + '%') as never }]} /></View>
      <View style={styles.setupChecks}>{['Preferences complete', 'Save your first recipe', 'Plan your first meal', 'Create a grocery list', 'Set up your pantry'].map((label, index) => <View key={label} style={styles.setupCheck}><Ionicons color={index === 0 ? colors.herb : colors.muted} name={index === 0 ? 'checkmark-circle' : 'ellipse-outline'} size={17} /><Text style={styles.setupCheckText}>{label}</Text></View>)}</View>
      <Pressable onPress={() => router.push('/onboarding/kitchen-setup')} style={styles.primaryInline}><Text style={styles.primaryInlineText}>Continue setup</Text><Ionicons color={colors.white} name="arrow-forward" size={17} /></Pressable>
    </View>

    <View style={styles.emptyNutrition}><SectionHeader title="Today" /><View style={styles.emptyNutritionBody}><View style={styles.emptyRing}><Text style={styles.emptyDash}>—</Text><Text style={styles.emptyRingLabel}>calories</Text></View><View style={styles.emptyMacroLines}>{['Protein', 'Carbs', 'Fat', 'Fiber'].map((label, index) => <View key={label} style={styles.emptyMacro}><View style={[styles.macroDot, { backgroundColor: [colors.herb, '#2E91E5', colors.citrus, colors.lavender][index] }]} /><Text style={styles.emptyMacroLabel}>{label}</Text><View style={styles.emptyLine} /><Text style={styles.emptyMacroValue}>— / —g</Text></View>)}</View></View><Pressable onPress={() => router.push('/(tabs)/plan')} style={styles.planMealButton}><Text style={styles.planMealText}>Plan today’s meals to see your macro forecast</Text><Ionicons color={colors.coralDark} name="arrow-forward" size={18} /></Pressable></View>

    <View style={styles.firstRecipe}><View style={styles.firstRecipeMascot}><MotionSlot name="recipe-import" size={126} accessibilityLabel="CraveKeep mascot saving a first recipe" /></View><View style={styles.firstRecipeCopy}><Text style={styles.firstRecipeTitle}>Save Your First Recipe</Text><Text style={styles.firstRecipeBody}>Bring recipes in from anywhere.</Text><QuickCapture compact /></View></View>

    <EmptyAction number="4" title="Build Your First Meal Plan" detail="Turn saved recipes into an easier week." icon="calendar-outline" action="Start planning" route="/(tabs)/plan" tone="gold" />
    <EmptyAction number="5" title="Create Your Grocery List" detail="Add items yourself or generate a list from your meal plan." icon="basket-outline" action="Create list" route="/(tabs)/groceries" tone="green" />
    <EmptyAction number="6" title="Set Up Your Pantry" detail="Track what you have, find recipes, and reduce food waste." icon="file-tray-stacked-outline" action="Add pantry items" route="/pantry" tone="purple" />

    <View style={styles.emptyRecipes}><SectionHeader title="Your Recipes" /><View style={styles.placeholderRow}>{[0,1,2,3].map(index => <View key={index} style={styles.recipePlaceholder}><Ionicons color={colors.line} name="restaurant-outline" size={25} /></View>)}</View><Text style={styles.emptyCopy}>Your saved recipes will appear here.</Text><Pressable onPress={() => router.push('/capture')} style={styles.smallCoralButton}><Text style={styles.smallCoralText}>Save a recipe</Text></Pressable></View>

    <View style={styles.helpCard}><MotionSlot name="onboarding-preferences" size={78} accessibilityLabel="CraveKeep mascot offering help" /><View style={styles.helpCopy}><Text style={styles.helpTitle}>Need a little help, {firstName}?</Text><Text style={styles.helpBody}>We’re here to make cooking simple and fun.</Text><Pressable onPress={() => router.push('/capture')}><Text style={styles.helpLink}>See how importing works  ›</Text></Pressable></View></View>
  </>;
}

function NutritionCard({ mode, onModeChange, values, targets, hasMeals, remaining }: { mode: 'consumed' | 'planned'; onModeChange: (mode: 'consumed' | 'planned') => void; values: { calories: number; proteinGrams: number; carbohydrateGrams: number; fatGrams: number; sodiumMilligrams: number }; targets: DailyNutritionTargets; hasMeals: boolean; remaining: { calories: number; proteinGrams: number; carbohydrateGrams: number; fatGrams: number; sodiumMilligrams: number } }) {
  const nutrients = [
    { label: 'Protein', value: values.proteinGrams, target: targets.proteinGrams, color: colors.herb },
    { label: 'Carbs', value: values.carbohydrateGrams, target: targets.carbohydrateGrams, color: '#2E91E5' },
    { label: 'Fat', value: values.fatGrams, target: targets.fatGrams, color: colors.citrus },
  ];
  const caloriePercent = Math.min(100, Math.round((values.calories / Math.max(1, targets.calories)) * 100));
  return <Pressable onPress={() => router.push('/nutrition')} style={styles.nutritionCard}>
    <View style={styles.nutritionTop}><SectionHeader title="Today" /><View style={styles.toggle}><Pressable onPress={() => onModeChange('consumed')} style={[styles.toggleButton, mode === 'consumed' && styles.toggleActive]}><Text style={[styles.toggleText, mode === 'consumed' && styles.toggleTextActive]}>Consumed</Text></Pressable><Pressable onPress={() => onModeChange('planned')} style={[styles.toggleButton, mode === 'planned' && styles.toggleActive]}><Text style={[styles.toggleText, mode === 'planned' && styles.toggleTextActive]}>Planned</Text></Pressable></View></View>
    {hasMeals ? <View style={styles.nutritionBody}><View style={styles.calorieRing}><View style={[styles.calorieArc, { borderTopColor: caloriePercent > 25 ? colors.lemon : colors.line, borderRightColor: caloriePercent > 50 ? colors.coral : colors.line, borderBottomColor: caloriePercent > 75 ? colors.herb : colors.line }]} /><Text style={styles.calorieValue}>{values.calories.toLocaleString()}</Text><Text style={styles.calorieTarget}>of {targets.calories.toLocaleString()}{'\n'}calories</Text></View><View style={styles.macroList}>{nutrients.map(nutrient => { const percent = Math.min(100, Math.round((nutrient.value / Math.max(1, nutrient.target)) * 100)); return <View key={nutrient.label} style={styles.macroRow}><Text style={styles.macroLabel}>{nutrient.label}</Text><View style={styles.macroTrack}><View style={[styles.macroFill, { width: (percent + '%') as never, backgroundColor: nutrient.color }]} /></View><Text style={styles.macroNumbers}>{nutrient.value}/{nutrient.target}g</Text></View>; })}<View style={styles.remaining}><Ionicons color={colors.coralDark} name="flame" size={17} /><Text style={styles.remainingText}>{Math.max(0, remaining.calories)} calories and {Math.max(0, remaining.proteinGrams)}g protein remaining.</Text></View></View></View> : <View style={styles.noMeals}><Ionicons color={colors.herb} name="stats-chart-outline" size={28} /><Text style={styles.noMealsText}>Plan today’s meals to see your macro forecast.</Text><Pressable onPress={() => router.push('/(tabs)/plan')} style={styles.smallCoralButton}><Text style={styles.smallCoralText}>Plan a meal</Text></Pressable></View>}
  </Pressable>;
}

function QuickCapture({ compact = false }: { compact?: boolean }) {
  const actions = [
    { label: 'Link', icon: 'link-outline', route: '/capture/link' },
    { label: 'Social', icon: 'share-social-outline', route: '/capture/link?source=shared' },
    { label: 'Scan', icon: 'scan-outline', route: '/capture/media?mode=camera' },
    { label: 'Upload', icon: 'cloud-upload-outline', route: '/capture/media?mode=library' },
  ] as const;
  return <View style={[styles.quickCapture, compact && styles.quickCaptureCompact]}>{compact ? null : <Text style={styles.quickTitle}>Quick Capture</Text>}<View style={styles.quickActions}>{actions.map(action => <Pressable key={action.label} onPress={() => router.push(action.route)} style={styles.quickAction}><Ionicons color={colors.white} name={action.icon} size={compact ? 20 : 24} /><Text style={styles.quickLabel}>{action.label}</Text></Pressable>)}</View>{compact ? <Pressable onPress={() => router.push('/recipes/new')}><Text style={styles.manualLink}>Create manually  ›</Text></Pressable> : null}</View>;
}

function DinnerCard({ recipe, servings }: { recipe: Recipe; servings: number }) {
  return <View style={styles.dinnerCard}><SectionHeader title="Tonight’s Plan" action="Change" onPress={() => router.push('/(tabs)/plan')} /><View style={styles.dinnerBody}><RecipeArt imageUrl={recipe.source.imageUrl} storagePath={recipe.source.storagePath} /><View style={styles.dinnerCopy}><Text style={styles.dinnerTitle}>{recipe.title}</Text><Text style={styles.dinnerMeta}>{recipeTime(recipe)} min · {servings} serving{servings === 1 ? '' : 's'}</Text><Pressable onPress={() => router.push('/cook/' + recipe.id)} style={styles.cookButton}><Text style={styles.cookButtonText}>Start cooking</Text></Pressable></View></View></View>;
}

function EmptyDinner() {
  return <View style={styles.emptyDinner}><SectionHeader title="Tonight’s Plan" /><View style={styles.emptyDinnerBody}><View style={styles.emptyDinnerIcon}><Ionicons color={colors.citrus} name="moon-outline" size={29} /></View><View style={styles.emptyDinnerCopy}><Text style={styles.emptyDinnerTitle}>Nothing planned for tonight yet.</Text><Text style={styles.emptyDinnerText}>Choose from your recipes or let CraveKeep help.</Text></View></View><View style={styles.emptyDinnerActions}><Pressable onPress={() => router.push('/(tabs)/recipes')} style={styles.outlineButton}><Text style={styles.outlineText}>My Recipes</Text></Pressable><Pressable onPress={() => router.push('/(tabs)/plan')} style={styles.cookButton}><Text style={styles.cookButtonText}>Help Me Pick</Text></Pressable></View></View>;
}

function RecipeCarousel({ title, recipes, labelRecipes = false, onFavorite }: { title: string; recipes: Recipe[]; labelRecipes?: boolean; onFavorite: (id: string) => Promise<void> }) {
  return <View><SectionHeader title={title} action="View All" onPress={() => router.push('/(tabs)/recipes')} /><ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.recipeCarousel}>{recipes.map((recipe, index) => <Pressable key={recipe.id} onPress={() => router.push('/recipes/' + recipe.id)} style={styles.recipeCard}>{labelRecipes ? <Text style={[styles.recipeBadge, index % 2 ? styles.blueBadge : styles.greenBadge]}>{index % 2 ? 'Ready in ' + recipeTime(recipe) + ' min' : 'Fits Today’s Macros'}</Text> : null}<View style={styles.recipeImage}><RecipeArt compact imageUrl={recipe.source.imageUrl} storagePath={recipe.source.storagePath} /><Pressable accessibilityLabel={(recipe.favorite ? 'Remove ' : 'Add ') + recipe.title + ' favorite'} onPress={() => void onFavorite(recipe.id)} style={styles.favorite}><Ionicons color={recipe.favorite ? colors.coral : colors.white} name={recipe.favorite ? 'heart' : 'heart-outline'} size={18} /></Pressable></View><Text numberOfLines={2} style={styles.recipeName}>{recipe.title}</Text><Text style={styles.recipeMeta}>{recipeTime(recipe)} min · {recipe.source.label}</Text></Pressable>)}</ScrollView></View>;
}

function WeekPlan({ days, count }: { days: { date: string; label: string; recipe?: Recipe; meal?: unknown }[]; count: number }) {
  return <View style={styles.weekCard}><SectionHeader title="This Week’s Plan" action="View Full Plan" onPress={() => router.push('/(tabs)/plan')} /><Text style={styles.weekCount}>{count} of 7 dinners planned</Text><ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.weekDays}>{days.map(day => <Pressable key={day.date} onPress={() => router.push('/(tabs)/plan')} style={styles.weekDay}><Text style={styles.weekLabel}>{day.label}</Text>{day.recipe ? <><View style={styles.weekImage}><RecipeArt compact imageUrl={day.recipe.source.imageUrl} storagePath={day.recipe.source.storagePath} /></View><Ionicons color={colors.herb} name="checkmark-circle" size={18} style={styles.weekCheck} /></> : <View style={styles.openDay}><Ionicons color={colors.muted} name="add" size={22} /><Text style={styles.openLabel}>Plan</Text></View>}</Pressable>)}</ScrollView>{count === 0 ? <Pressable onPress={() => router.push('/(tabs)/plan')} style={styles.primaryInline}><Text style={styles.primaryInlineText}>Build My First Meal Plan</Text><Ionicons color={colors.white} name="arrow-forward" size={17} /></Pressable> : null}</View>;
}

function GrocerySnapshot({ active, complete, total, progress }: { active: string[]; complete: number; total: number; progress: number }) {
  return <View style={styles.groceryCard}><SectionHeader title="Grocery Snapshot" action="Open List" onPress={() => router.push('/(tabs)/groceries')} />{total ? <><Text style={styles.groceryCount}>{active.length} items remaining · {complete} of {total} complete</Text><View style={styles.groceryTrack}><View style={[styles.groceryFill, { width: (progress + '%') as never }]} /></View><View style={styles.groceryItems}>{active.slice(0, 6).map(name => <View key={name} style={styles.groceryItem}><Ionicons color={colors.muted} name="ellipse-outline" size={16} /><Text numberOfLines={1} style={styles.groceryName}>{name}</Text></View>)}</View></> : <View style={styles.emptyRow}><Ionicons color={colors.herb} name="basket-outline" size={34} /><View style={styles.emptyRowCopy}><Text style={styles.emptyDinnerTitle}>Turn your meal plan into a grocery list.</Text><Pressable onPress={() => router.push('/(tabs)/groceries')}><Text style={styles.sectionAction}>Create Grocery List  ›</Text></Pressable></View></View>}</View>;
}

function PantrySnapshot({ items }: { items: { name: string; quantity: string; expiresOn?: string }[] }) {
  const daysUntil = (date?: string) => { if (!date) return ''; const days = Math.ceil((new Date(date + 'T00:00:00').getTime() - Date.now()) / 86400000); return days <= 0 ? 'use today' : 'use within ' + days + ' day' + (days === 1 ? '' : 's'); };
  return <View style={styles.pantryCard}><SectionHeader title="Pantry · Use Soon" action="View Pantry" onPress={() => router.push('/pantry')} />{items.length ? <><ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.pantryItems}>{items.map(item => <View key={item.name} style={styles.pantryItem}><View style={styles.pantryIcon}><Ionicons color={colors.herb} name="leaf-outline" size={22} /></View><View><Text style={styles.pantryName}>{item.name}</Text><Text style={styles.pantryDate}>{daysUntil(item.expiresOn)}</Text><Text style={styles.pantryQuantity}>{item.quantity || 'Quantity not set'}</Text></View></View>)}</ScrollView><Pressable onPress={() => router.push('/(tabs)/recipes')} style={styles.findRecipes}><Text style={styles.findRecipesText}>Find Recipes</Text></Pressable></> : <View style={styles.emptyRow}><Ionicons color={colors.lavender} name="file-tray-stacked-outline" size={34} /><View style={styles.emptyRowCopy}><Text style={styles.emptyDinnerTitle}>Add pantry items to reduce food waste.</Text><Pressable onPress={() => router.push('/pantry')}><Text style={styles.sectionAction}>Set Up Pantry  ›</Text></Pressable></View></View>}</View>;
}

function EmptyAction({ number, title, detail, icon, action, route, tone }: { number: string; title: string; detail: string; icon: keyof typeof Ionicons.glyphMap; action: string; route: '/(tabs)/plan' | '/(tabs)/groceries' | '/pantry'; tone: 'gold' | 'green' | 'purple' }) {
  return <View style={[styles.emptyAction, styles[tone + 'Tone']]}><View style={styles.numberBadge}><Text style={styles.numberText}>{number}</Text></View><View style={styles.emptyActionCopy}><Text style={styles.emptyActionTitle}>{title}</Text><Text style={styles.emptyActionDetail}>{detail}</Text><Pressable onPress={() => router.push(route)} style={styles.emptyActionButton}><Text style={styles.emptyActionButtonText}>{action}</Text></Pressable></View><Ionicons color={tone === 'gold' ? colors.citrus : tone === 'green' ? colors.herb : colors.lavender} name={icon} size={58} /></View>;
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: spacing.md, paddingTop: spacing.sm, gap: spacing.md, paddingBottom: 118 },
  header: { minHeight: 52, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }, logo: { width: 142, height: 42 }, headerActions: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm }, iconButton: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.line, backgroundColor: colors.paperRaised }, avatar: { width: 42, height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.charcoal }, avatarText: { color: colors.white, fontWeight: '900' },
  hero: { minHeight: 178, overflow: 'hidden', borderRadius: radii.large, backgroundColor: '#EAF5EE' }, heroBackground: { ...StyleSheet.absoluteFillObject, width: '100%', height: '100%' }, heroShade: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(255,255,255,0.12)' }, eveningShade: { backgroundColor: 'rgba(5,18,35,0.12)' }, heroCopy: { position: 'absolute', zIndex: 3, left: spacing.md, top: spacing.lg, width: '58%' }, greeting: { color: colors.charcoal, ...typography.title, fontSize: 28, lineHeight: 30 }, lightText: { color: colors.white, textShadowColor: 'rgba(0,0,0,0.35)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 4 }, heroMessage: { marginTop: 10, color: '#41524B', fontSize: 14, lineHeight: 18, fontWeight: '700' }, lightSubtext: { color: '#F5F8FB' }, heroMascot: { position: 'absolute', zIndex: 4, right: 4, bottom: -4 },
  sectionHeader: { minHeight: 30, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }, sectionTitle: { color: colors.charcoal, ...typography.title, fontSize: 19 }, sectionAction: { color: colors.coralDark, fontSize: 11, fontWeight: '800' },
  setupCard: { padding: spacing.md, gap: 10, overflow: 'hidden', borderRadius: radii.large, backgroundColor: colors.coral }, setupTop: { height: 82, flexDirection: 'row', alignItems: 'center' }, setupTitle: { color: colors.white, fontSize: 20, fontWeight: '900' }, setupAccent: { color: colors.lemon }, setupSubtext: { marginTop: 4, maxWidth: 220, color: '#FFF5F1', fontSize: 11 }, setupTrack: { height: 9, overflow: 'hidden', borderRadius: radii.round, backgroundColor: 'rgba(255,255,255,0.45)' }, setupFill: { height: 9, borderRadius: radii.round, backgroundColor: colors.lemon }, setupChecks: { padding: 10, gap: 7, borderRadius: radii.medium, backgroundColor: colors.white }, setupCheck: { flexDirection: 'row', alignItems: 'center', gap: 8 }, setupCheckText: { color: colors.charcoal, fontSize: 12 }, primaryInline: { minHeight: 42, paddingHorizontal: spacing.md, alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: 7, borderRadius: radii.small, backgroundColor: colors.charcoal }, primaryInlineText: { color: colors.white, fontWeight: '900' },
  emptyNutrition: { padding: spacing.md, gap: spacing.sm, borderWidth: 1, borderColor: colors.line, borderRadius: radii.large, backgroundColor: colors.paperRaised }, emptyNutritionBody: { flexDirection: 'row', alignItems: 'center', gap: spacing.md }, emptyRing: { width: 96, height: 96, borderRadius: 48, alignItems: 'center', justifyContent: 'center', borderWidth: 10, borderColor: '#F0F0F2' }, emptyDash: { color: colors.charcoal, fontSize: 24, fontWeight: '900' }, emptyRingLabel: { color: colors.muted, fontSize: 10 }, emptyMacroLines: { flex: 1, gap: 8 }, emptyMacro: { flexDirection: 'row', alignItems: 'center', gap: 6 }, macroDot: { width: 7, height: 7, borderRadius: 4 }, emptyMacroLabel: { width: 48, color: colors.charcoal, fontSize: 10, fontWeight: '700' }, emptyLine: { flex: 1, height: 5, borderRadius: 3, backgroundColor: colors.line }, emptyMacroValue: { width: 43, color: colors.muted, fontSize: 9 }, planMealButton: { minHeight: 40, paddingHorizontal: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderRadius: radii.small, backgroundColor: '#FFF0ED' }, planMealText: { flex: 1, color: colors.coralDark, fontSize: 11, fontWeight: '800' },
  firstRecipe: { minHeight: 214, flexDirection: 'row', alignItems: 'flex-end', overflow: 'hidden', borderRadius: radii.large, backgroundColor: '#087E82' }, firstRecipeMascot: { width: 126 }, firstRecipeCopy: { flex: 1, paddingVertical: spacing.md, paddingRight: spacing.md }, firstRecipeTitle: { color: colors.white, ...typography.title, fontSize: 21 }, firstRecipeBody: { marginTop: 3, color: '#DDF9F8', fontSize: 12 },
  quickCapture: { minHeight: 92, padding: 10, gap: 8, borderRadius: radii.medium, backgroundColor: '#087E82' }, quickCaptureCompact: { paddingHorizontal: 0, minHeight: 126, backgroundColor: 'transparent' }, quickTitle: { color: colors.white, fontSize: 18, fontWeight: '900' }, quickActions: { flexDirection: 'row', justifyContent: 'space-around' }, quickAction: { minWidth: 60, minHeight: 58, alignItems: 'center', justifyContent: 'center', gap: 5, borderLeftWidth: StyleSheet.hairlineWidth, borderLeftColor: 'rgba(255,255,255,0.35)' }, quickLabel: { color: colors.white, fontSize: 10, fontWeight: '800' }, manualLink: { color: colors.white, fontSize: 11, fontWeight: '800', textAlign: 'center' },
  emptyAction: { minHeight: 150, padding: spacing.md, flexDirection: 'row', alignItems: 'center', gap: spacing.sm, overflow: 'hidden', borderRadius: radii.large }, goldTone: { backgroundColor: '#FFF3D6' }, greenTone: { backgroundColor: '#E8F8EF' }, purpleTone: { backgroundColor: colors.lavenderSoft }, numberBadge: { position: 'absolute', left: 10, top: 10, width: 25, height: 25, borderRadius: 13, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.coral }, numberText: { color: colors.white, fontWeight: '900' }, emptyActionCopy: { flex: 1, marginTop: 18 }, emptyActionTitle: { color: colors.charcoal, fontSize: 18, fontWeight: '900' }, emptyActionDetail: { marginTop: 4, color: colors.muted, fontSize: 11, lineHeight: 15 }, emptyActionButton: { alignSelf: 'flex-start', marginTop: 12, paddingHorizontal: 14, paddingVertical: 9, borderRadius: radii.small, backgroundColor: colors.coral }, emptyActionButtonText: { color: colors.white, fontSize: 11, fontWeight: '900' },
  emptyRecipes: { padding: spacing.md, gap: 10, borderWidth: 1, borderColor: colors.line, borderRadius: radii.large, backgroundColor: colors.paperRaised }, placeholderRow: { flexDirection: 'row', gap: 7 }, recipePlaceholder: { flex: 1, height: 64, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderStyle: 'dashed', borderColor: colors.line, borderRadius: radii.small }, emptyCopy: { color: colors.muted, fontSize: 12, textAlign: 'center' }, smallCoralButton: { alignSelf: 'center', paddingHorizontal: 16, paddingVertical: 9, borderRadius: radii.small, backgroundColor: colors.coral }, smallCoralText: { color: colors.white, fontSize: 11, fontWeight: '900' }, helpCard: { minHeight: 102, flexDirection: 'row', alignItems: 'center', overflow: 'hidden', borderWidth: 2, borderColor: '#C9DFFF', borderRadius: radii.large, backgroundColor: '#F8FBFF' }, helpCopy: { flex: 1, paddingRight: spacing.md }, helpTitle: { color: colors.charcoal, fontSize: 16, fontWeight: '900' }, helpBody: { color: colors.muted, fontSize: 10 }, helpLink: { marginTop: 6, color: '#3478C5', fontSize: 11, fontWeight: '800' },
  nutritionCard: { padding: spacing.md, borderWidth: 1, borderColor: colors.line, borderRadius: radii.large, backgroundColor: colors.paperRaised }, nutritionTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }, toggle: { padding: 3, flexDirection: 'row', borderRadius: radii.round, backgroundColor: '#F0F1F4' }, toggleButton: { paddingHorizontal: 12, paddingVertical: 7, borderRadius: radii.round }, toggleActive: { backgroundColor: colors.coral }, toggleText: { color: colors.muted, fontSize: 10, fontWeight: '800' }, toggleTextActive: { color: colors.white }, nutritionBody: { marginTop: spacing.sm, flexDirection: 'row', alignItems: 'center', gap: spacing.md }, calorieRing: { width: 112, height: 112, alignItems: 'center', justifyContent: 'center' }, calorieArc: { position: 'absolute', width: 108, height: 108, borderRadius: 54, borderWidth: 10, borderColor: '#EDEEF1', transform: [{ rotate: '-25deg' }] }, calorieValue: { color: colors.charcoal, fontSize: 22, fontWeight: '900' }, calorieTarget: { color: colors.muted, fontSize: 10, lineHeight: 13, textAlign: 'center' }, macroList: { flex: 1, gap: 8 }, macroRow: { flexDirection: 'row', alignItems: 'center', gap: 6 }, macroLabel: { width: 44, color: colors.charcoal, fontSize: 10, fontWeight: '800' }, macroTrack: { flex: 1, height: 6, overflow: 'hidden', borderRadius: 3, backgroundColor: colors.line }, macroFill: { height: 6, borderRadius: 3 }, macroNumbers: { width: 58, color: colors.muted, fontSize: 9 }, remaining: { padding: 8, flexDirection: 'row', alignItems: 'center', gap: 6, borderRadius: radii.small, backgroundColor: '#FFF0ED' }, remainingText: { flex: 1, color: colors.coralDark, fontSize: 9, fontWeight: '700' }, noMeals: { minHeight: 100, flexDirection: 'row', alignItems: 'center', gap: spacing.md }, noMealsText: { flex: 1, color: colors.muted, fontSize: 12, lineHeight: 17 },
  dinnerCard: { padding: spacing.md, gap: spacing.sm, overflow: 'hidden', borderRadius: radii.large, backgroundColor: '#FFF0C8' }, dinnerBody: { minHeight: 154, flexDirection: 'row', gap: spacing.md }, dinnerCopy: { flex: 1, justifyContent: 'center' }, dinnerTitle: { color: colors.charcoal, ...typography.title, fontSize: 21 }, dinnerMeta: { marginTop: 8, color: colors.muted, fontSize: 11 }, cookButton: { minHeight: 40, marginTop: 12, paddingHorizontal: 14, alignItems: 'center', justifyContent: 'center', borderRadius: radii.small, backgroundColor: colors.coral }, cookButtonText: { color: colors.white, fontWeight: '900' },
  emptyDinner: { padding: spacing.md, gap: spacing.sm, borderRadius: radii.large, backgroundColor: '#FFF3D6' }, emptyDinnerBody: { flexDirection: 'row', alignItems: 'center', gap: spacing.md }, emptyDinnerIcon: { width: 54, height: 54, borderRadius: 27, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.white }, emptyDinnerCopy: { flex: 1 }, emptyDinnerTitle: { color: colors.charcoal, fontWeight: '900' }, emptyDinnerText: { marginTop: 3, color: colors.muted, fontSize: 11 }, emptyDinnerActions: { flexDirection: 'row', gap: spacing.sm }, outlineButton: { flex: 1, minHeight: 40, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.coral, borderRadius: radii.small }, outlineText: { color: colors.coralDark, fontWeight: '900' },
  recipeCarousel: { gap: spacing.sm, paddingRight: spacing.md }, recipeCard: { width: 156, minHeight: 174, padding: 8, borderWidth: 1, borderColor: colors.line, borderRadius: radii.medium, backgroundColor: colors.paperRaised }, recipeImage: { height: 94, overflow: 'hidden', borderRadius: radii.small }, favorite: { position: 'absolute', right: 5, top: 5, width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(20,33,61,0.55)' }, recipeName: { minHeight: 34, marginTop: 7, color: colors.charcoal, fontSize: 12, fontWeight: '900' }, recipeMeta: { color: colors.muted, fontSize: 9 }, recipeBadge: { marginBottom: 6, paddingVertical: 4, borderRadius: 6, color: colors.white, fontSize: 9, fontWeight: '900', textAlign: 'center' }, greenBadge: { backgroundColor: colors.herb }, blueBadge: { backgroundColor: '#3478C5' },
  weekCard: { padding: spacing.md, gap: spacing.sm, borderWidth: 1, borderColor: colors.line, borderRadius: radii.large, backgroundColor: colors.paperRaised }, weekCount: { color: colors.muted, fontSize: 11 }, weekDays: { gap: 7 }, weekDay: { width: 66, alignItems: 'center', gap: 5 }, weekLabel: { color: colors.charcoal, fontSize: 10, fontWeight: '800' }, weekImage: { width: 62, height: 54, overflow: 'hidden', borderRadius: radii.small }, weekCheck: { position: 'absolute', right: -1, bottom: -2, backgroundColor: colors.white, borderRadius: 9 }, openDay: { width: 62, height: 54, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderStyle: 'dashed', borderColor: colors.line, borderRadius: radii.small }, openLabel: { color: colors.muted, fontSize: 9 },
  groceryCard: { padding: spacing.md, gap: spacing.sm, borderWidth: 1, borderColor: colors.line, borderRadius: radii.large, backgroundColor: '#F2FBF8' }, groceryCount: { color: colors.muted, fontSize: 10 }, groceryTrack: { height: 7, overflow: 'hidden', borderRadius: 4, backgroundColor: colors.white }, groceryFill: { height: 7, borderRadius: 4, backgroundColor: colors.herb }, groceryItems: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 }, groceryItem: { width: '48%', flexDirection: 'row', alignItems: 'center', gap: 5 }, groceryName: { flex: 1, color: colors.charcoal, fontSize: 10 }, emptyRow: { minHeight: 72, flexDirection: 'row', alignItems: 'center', gap: spacing.md }, emptyRowCopy: { flex: 1 },
  pantryCard: { padding: spacing.md, gap: spacing.sm, borderWidth: 1, borderColor: colors.line, borderRadius: radii.large, backgroundColor: '#FAF7FF' }, pantryItems: { gap: 8 }, pantryItem: { minWidth: 150, padding: 8, flexDirection: 'row', alignItems: 'center', gap: 8, borderRadius: radii.small, backgroundColor: colors.white }, pantryIcon: { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.herbSoft }, pantryName: { color: colors.charcoal, fontSize: 11, fontWeight: '900' }, pantryDate: { color: colors.coralDark, fontSize: 9 }, pantryQuantity: { color: colors.muted, fontSize: 8 }, findRecipes: { alignSelf: 'flex-end', paddingHorizontal: 16, paddingVertical: 9, borderRadius: radii.small, backgroundColor: '#087E82' }, findRecipesText: { color: colors.white, fontSize: 11, fontWeight: '900' },
  error: { padding: spacing.md, color: colors.coralDark, borderRadius: radii.medium, backgroundColor: '#FFF0ED' }
});
