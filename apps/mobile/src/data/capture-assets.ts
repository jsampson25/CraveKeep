import type { ImagePickerAsset } from 'expo-image-picker';
import { supabase } from './supabase';

const safeName = (value: string) => value.replace(/[^a-zA-Z0-9._-]/g, '_');

export async function uploadCaptureImage(asset: ImagePickerAsset, userId: string, jobId: string): Promise<string> {
  if (!supabase) throw new Error('Cloud storage is not configured.');
  const response = await fetch(asset.uri);
  if (!response.ok) throw new Error('The selected image could not be read.');
  const bytes = await response.arrayBuffer();
  const fileName = safeName(asset.fileName || `recipe-${Date.now()}.jpg`);
  const path = `${userId}/${jobId}/${fileName}`;
  const { error } = await supabase.storage.from('recipe-imports').upload(path, bytes, { contentType: asset.mimeType || 'image/jpeg', upsert: false });
  if (error) throw error;
  return path;
}
