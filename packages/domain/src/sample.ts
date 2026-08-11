import type { Recipe } from './recipe';

export const SAMPLE_RECIPE: Recipe = {
  id: 'sample_lemon_herb_chicken',
  title: 'Lemon Herb Chicken',
  description: 'A bright weeknight dinner with green beans and a quick pan sauce.',
  servings: 4,
  prepMinutes: 10,
  cookMinutes: 25,
  ingredients: [
    { id: 'sample_ingredient_1', quantity: '2', name: 'chicken breasts' },
    { id: 'sample_ingredient_2', quantity: '2', name: 'lemons' },
    { id: 'sample_ingredient_3', quantity: '3 cloves', name: 'garlic, minced' },
    { id: 'sample_ingredient_4', quantity: '1 tbsp', name: 'olive oil' },
    { id: 'sample_ingredient_5', quantity: '1 lb', name: 'green beans' }
  ],
  steps: [
    'Pat the chicken dry and season it with salt, pepper, and half of the herbs.',
    'Warm the olive oil in a skillet over medium-high heat.',
    'Cook the chicken for 5–6 minutes per side, until it reaches 165°F.',
    'Add garlic, lemon juice, and green beans. Cook until the beans are crisp-tender.',
    'Rest the chicken for 5 minutes, spoon the pan sauce over it, and serve.'
  ],
  source: {
    kind: 'sample',
    label: 'CraveKeep sample recipe',
    creator: 'CraveKeep Kitchen',
    capturedAt: '2026-08-10T00:00:00.000Z'
  },
  privacy: 'private',
  favorite: false,
  cookbookIds: [],
  createdAt: '2026-08-10T00:00:00.000Z',
  updatedAt: '2026-08-10T00:00:00.000Z',
  version: 1
};
