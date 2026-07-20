import { supabase } from './supabase';

/**
 * Upload an image to the case-images bucket and return its public URL.
 * Used by the admin CMS when creating or editing a case.
 */
export async function uploadCaseImage(file: File): Promise<{ url: string; path: string } | { error: string }> {
  const ext = file.name.split('.').pop() ?? 'jpg';
  const path = `${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from('case-images').upload(path, file, {
    cacheControl: '3600',
    upsert: false,
  });
  if (error) return { error: error.message };
  const { data } = supabase.storage.from('case-images').getPublicUrl(path);
  return { url: data.publicUrl, path };
}

/**
 * Upload a payment screenshot to the payment-screenshots bucket.
 * Stored under a folder named after the user's uid so RLS can scope access.
 */
export async function uploadPaymentScreenshot(
  file: File,
  userId: string,
): Promise<{ path: string } | { error: string }> {
  const ext = file.name.split('.').pop() ?? 'jpg';
  const path = `${userId}/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from('payment-screenshots').upload(path, file, {
    cacheControl: '3600',
    upsert: false,
  });
  if (error) return { error: error.message };
  return { path };
}

/**
 * Get a signed URL for viewing a private payment screenshot.
 */
export async function getScreenshotUrl(path: string): Promise<string | null> {
  const { data } = await supabase.storage.from('payment-screenshots').createSignedUrl(path, 3600);
  return data?.signedUrl ?? null;
}
