import { describe, expect, it } from 'vitest';
import { createSourcePreview, extractDeterministically, normalizeRecipeUrl } from './import';

describe('link capture rules', () => {
  it('normalizes a public recipe URL and removes fragments', () => {
    expect(normalizeRecipeUrl('example.com/recipe#ingredients')).toBe('https://example.com/recipe');
  });

  it('rejects local network targets', () => {
    expect(() => normalizeRecipeUrl('http://localhost:3000/secret')).toThrow('Local and private network');
    expect(() => normalizeRecipeUrl('http://192.168.1.5/secret')).toThrow('Local and private network');
  });

  it('identifies social video post IDs for embeddable sources', () => {
    expect(createSourcePreview('https://www.tiktok.com/@cook/video/123456789').externalId).toBe('123456789');
    expect(createSourcePreview('https://www.instagram.com/reel/ABC123/').externalId).toBe('ABC123');
    expect(createSourcePreview('https://www.facebook.com/reel/987654321').externalId).toBe('987654321');
    expect(createSourcePreview('https://pin.it/abc123').platform).toBe('pinterest');
    expect(createSourcePreview('https://pin.it/abc123').mediaType).toBe('social');
  });

  it('returns honest recovery instead of inventing recipe data', () => {
    const result = extractDeterministically(createSourcePreview('https://example.com/dinner'));
    expect(result.status).toBe('needs_review');
    expect(result.draft?.ingredients).toEqual([]);
    expect(result.recoveryCode).toBe('missing_recipe_data');
  });

  it('extracts the deterministic acceptance-test fixture', () => {
    const result = extractDeterministically(createSourcePreview('https://cravekeep.com/samples/lemon-herb-chicken'));
    expect(result.draft?.ingredients).toHaveLength(3);
    expect(result.warnings).toHaveLength(1);
  });
});

describe('photo capture rules', () => {
  it('routes images to honest manual review without inventing extraction results', () => {
    const result = extractDeterministically({ host: 'Photo import', title: 'recipe-card.jpg', mediaType: 'image', localUri: 'file:///recipe-card.jpg' });
    expect(result.status).toBe('needs_review');
    expect(result.draft?.ingredients).toEqual([]);
    expect(result.recoveryCode).toBe('missing_recipe_data');
  });
});
