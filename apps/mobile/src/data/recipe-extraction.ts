import type { CaptureJob } from '@cravekeep/domain';
import { supabase } from './supabase';

export async function extractRecipeFromImage(storagePath: string, title: string): Promise<Pick<CaptureJob, 'status' | 'draft' | 'warnings' | 'recoveryCode'>> {
  if (!supabase) throw new Error('Cloud extraction is not configured.');
  const { data, error } = await supabase.functions.invoke('extract-recipe', { body: { storagePath, title } });
  if (error) throw error;
  if (!data || typeof data !== 'object' || !('status' in data) || !('draft' in data)) throw new Error('The extraction response was incomplete.');
  return data as Pick<CaptureJob, 'status' | 'draft' | 'warnings' | 'recoveryCode'>;
}

export async function extractRecipeFromLink(url: string, title: string): Promise<Pick<CaptureJob, 'status' | 'draft' | 'warnings' | 'recoveryCode'>> {
  if (!supabase) throw new Error('Cloud extraction is not configured.');
  const { data, error } = await supabase.functions.invoke('extract-link', { body: { url, title } });
  if (error) throw error;
  if (!data || typeof data !== 'object' || !('status' in data) || !('draft' in data)) throw new Error('The extraction response was incomplete.');
  return data as Pick<CaptureJob, 'status' | 'draft' | 'warnings' | 'recoveryCode'>;
}
