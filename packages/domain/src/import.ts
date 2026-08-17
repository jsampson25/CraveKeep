import type { RecipeDraft } from './recipe';

export const IMPORT_STAGES = ['reading_source', 'finding_ingredients', 'building_steps', 'checking_details', 'preparing_recipe'] as const;
export type ImportStage = (typeof IMPORT_STAGES)[number];
export type ImportStatus = 'queued' | 'processing' | 'needs_review' | 'completed' | 'failed';

export type SourcePreview = {
  url?: string;
  platform?: 'website' | 'pinterest' | 'youtube' | 'tiktok' | 'instagram' | 'facebook' | 'vimeo';
  externalId?: string;
  imageUrl?: string;
  localUri?: string;
  storagePath?: string;
  host: string;
  title: string;
  creator?: string;
  mediaType: 'webpage' | 'video' | 'social' | 'image' | 'document';
};

export type CaptureJob = {
  id: string;
  source: SourcePreview;
  status: ImportStatus;
  stage?: ImportStage;
  stageIndex: number;
  draft?: RecipeDraft;
  warnings: string[];
  recoveryCode?: 'source_blocked' | 'missing_recipe_data' | 'invalid_source';
  recipeId?: string;
  createdAt: string;
  updatedAt: string;
};

const blockedHosts = new Set(['localhost', '127.0.0.1', '0.0.0.0', '::1']);

function isPrivateIpv4(host: string): boolean {
  const parts = host.split('.').map(Number);
  if (parts.length !== 4 || parts.some((part) => !Number.isInteger(part) || part < 0 || part > 255)) return false;
  return parts[0] === 10 || parts[0] === 127 || (parts[0] === 169 && parts[1] === 254) || (parts[0] === 192 && parts[1] === 168) || (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31);
}

export function normalizeRecipeUrl(value: string): string {
  const withProtocol = /^https?:\/\//i.test(value.trim()) ? value.trim() : `https://${value.trim()}`;
  const parsed = new URL(withProtocol);
  if (!['http:', 'https:'].includes(parsed.protocol)) throw new Error('Use an http or https recipe link.');
  const hostname = parsed.hostname.toLowerCase().replace(/^\[|\]$/g, '');
  if (blockedHosts.has(hostname) || hostname.endsWith('.local') || isPrivateIpv4(hostname)) throw new Error('Local and private network addresses cannot be imported.');
  parsed.hash = '';
  return parsed.toString();
}

export function createSourcePreview(value: string): SourcePreview {
  const url = normalizeRecipeUrl(value);
  const parsed = new URL(url);
  const host = parsed.hostname.replace(/^www\./, '');
  const socialHosts = ['instagram.com', 'tiktok.com', 'pinterest.com', 'pin.it', 'facebook.com'];
  const videoHosts = ['youtube.com', 'youtu.be', 'vimeo.com'];
  const platform = (host === 'pinterest.com' || host === 'pin.it') ? 'pinterest' : host === 'youtube.com' || host === 'youtu.be' ? 'youtube' : host === 'tiktok.com' ? 'tiktok' : host === 'instagram.com' ? 'instagram' : host === 'facebook.com' ? 'facebook' : host === 'vimeo.com' ? 'vimeo' : 'website';
  const externalId = platform === 'youtube'
    ? parsed.searchParams.get('v') ?? (parsed.pathname.startsWith('/shorts/') ? parsed.pathname.split('/')[2] : parsed.pathname.split('/').filter(Boolean).pop())
    : platform === 'pinterest' ? parsed.pathname.match(/(?:pin|pin\.it)\/([0-9]+)/)?.[1]
      : platform === 'vimeo' ? parsed.pathname.split('/').filter(Boolean).pop()
      : platform === 'tiktok' ? parsed.pathname.match(/(?:video|v)\/(\d+)/)?.[1]
      : platform === 'instagram' ? parsed.pathname.match(/(?:reel|p|tv)\/([^/]+)/)?.[1]
      : platform === 'facebook' ? parsed.searchParams.get('v') ?? parsed.pathname.match(/(?:reel|videos)\/(\d+)/)?.[1]
      : undefined;
  return {
    url,
    host,
    platform,
    externalId,
    title: host === 'cravekeep.com' ? 'Lemon Herb Chicken' : `Recipe from ${host}`,
    creator: host === 'cravekeep.com' ? 'CraveKeep Kitchen' : undefined,
    mediaType: videoHosts.some((item) => host.endsWith(item)) ? 'video' : socialHosts.some((item) => host.endsWith(item)) ? 'social' : 'webpage'
  };
}

export function createCaptureJob(source: SourcePreview, now = new Date()): CaptureJob {
  const timestamp = now.toISOString();
  return { id: `import_${timestamp}_${Math.random().toString(36).slice(2, 9)}`, source, status: 'queued', stageIndex: 0, warnings: [], createdAt: timestamp, updatedAt: timestamp };
}

export function extractDeterministically(source: SourcePreview): Pick<CaptureJob, 'status' | 'draft' | 'warnings' | 'recoveryCode'> {
  if (source.mediaType === 'image' || source.mediaType === 'document') {
    return {
      status: 'needs_review',
      draft: { title: source.title.replace(/\.[^.]+$/, ''), description: '', servings: 1, prepMinutes: 0, cookMinutes: 0, ingredients: [], steps: [] },
      warnings: ['Text extraction is not connected yet. Use the image as your reference while completing the recipe details.'],
      recoveryCode: 'missing_recipe_data'
    };
  }
  if (source.host === 'cravekeep.com' && source.url && new URL(source.url).pathname === '/samples/lemon-herb-chicken') {
    return {
      status: 'needs_review',
      draft: {
        title: 'Lemon Herb Chicken', description: 'A bright weeknight chicken recipe imported from the CraveKeep sample source.', servings: 4, prepMinutes: 10, cookMinutes: 25,
        ingredients: [{ id: 'import_i1', quantity: '2', name: 'chicken breasts' }, { id: 'import_i2', quantity: '1 tbsp', name: 'olive oil' }, { id: 'import_i3', quantity: '2', name: 'lemons' }],
        steps: ['Season the chicken.', 'Sear the chicken until golden and cooked to 165°F.', 'Rest for five minutes and finish with lemon.']
      }, warnings: ['Confirm the ingredient quantities against the source before saving.']
    };
  }
  return {
    status: 'needs_review',
    draft: { title: source.title, description: '', servings: 1, prepMinutes: 0, cookMinutes: 0, ingredients: [], steps: [] },
    warnings: ['This source needs a connected extraction provider. Add ingredients and directions manually without losing the original link.'],
    recoveryCode: 'missing_recipe_data'
  };
}
