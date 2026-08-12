import { describe, expect, it } from 'vitest';
import { generateGroceryItems } from './groceries';
import type { Recipe } from './recipe';

const recipe = { id: 'r1', title: 'Toast', description: '', servings: 2, prepMinutes: 1, cookMinutes: 1, ingredients: [{ id: 'i1', quantity: '2', name: 'Eggs' }, { id: 'i2', quantity: 'to taste', name: 'Salt' }], steps: ['Cook'], source: { kind: 'manual', label: 'You', capturedAt: '2026-08-11T00:00:00Z' }, privacy: 'private', favorite: false, cookbookIds: [], createdAt: '2026-08-11T00:00:00Z', updatedAt: '2026-08-11T00:00:00Z', version: 1 } satisfies Recipe;
describe('grocery generation', () => { it('scales numeric quantities and preserves uncertain text', () => { const items = generateGroceryItems([{ id: 'm1', date: '2026-08-11', slot: 'dinner', recipeId: 'r1', servings: 1, status: 'planned', createdAt: '2026-08-11T00:00:00Z' }], [recipe]); expect(items.find((item) => item.key === 'eggs')?.quantity).toBe('1'); expect(items.find((item) => item.key === 'salt')?.uncertain).toBe(true); }); });
