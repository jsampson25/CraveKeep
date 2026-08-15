/** Named motion slots for the CraveKeep rebrand. */
export const motionNames = {
  launchReveal: 'launch-reveal', onboardingRecipeCard: 'onboarding-recipe-card',
  onboardingPreferences: 'onboarding-preferences', recipeImport: 'recipe-import',
  recipeImportSuccess: 'recipe-import-success', planMyWeek: 'plan-my-week',
  groceryProgress: 'grocery-progress', cookMode: 'cook-mode', savedSuccess: 'saved-success',
  mascotMorning: 'mascot-morning', mascotEvening: 'mascot-evening',
} as const;
export type MotionName = (typeof motionNames)[keyof typeof motionNames];