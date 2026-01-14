/**
 * Server Actions for API Key Management
 */

'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import crypto from 'crypto';

export async function createApiKey(
  prevState: any,
  formData: FormData
): Promise<{ success: boolean; key?: string; keyPrefix?: string; error?: string }> {
  const supabase = await createClient();

  // Verify admin user
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: 'Not authenticated' };
  }

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  if (profile?.role !== 'admin') {
    return { success: false, error: 'Unauthorized' };
  }

  const name = formData.get('name') as string;
  const scope = (formData.get('scope') as 'read' | 'write' | 'admin') || 'read';
  const expiresInDays = formData.get('expiresInDays') as string;

  if (!name?.trim()) {
    return { success: false, error: 'Name is required' };
  }

  // Generate random key: sk_live_[32 random hex chars]
  const randomBytes = crypto.randomBytes(16);
  const keySecret = randomBytes.toString('hex');
  const key = `sk_live_${keySecret}`;
  const keyPrefix = key.substring(0, 12);

  // Hash the key for storage
  const keyHash = crypto.createHash('sha256').update(key).digest('hex');

  // Calculate expiration date
  let expiresAt: string | null = null;
  if (expiresInDays && parseInt(expiresInDays) > 0) {
    const expDate = new Date();
    expDate.setDate(expDate.getDate() + parseInt(expiresInDays));
    expiresAt = expDate.toISOString();
  }

  // Store in database
  const { error } = await supabase.from('api_keys').insert({
    key_hash: keyHash,
    key_prefix: keyPrefix,
    name,
    scope,
    created_by: user.id,
    expires_at: expiresAt,
  });

  if (error) {
    return { success: false, error: 'Failed to create API key: ' + error.message };
  }

  revalidatePath('/dashboard/api-keys');

  // Return the full key (this is the ONLY time we return it!)
  return { success: true, key, keyPrefix };
}

export async function revokeApiKeyAction(keyId: string): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();

  // Verify admin user
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, error: 'Not authenticated' };
  }

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  if (profile?.role !== 'admin') {
    return { success: false, error: 'Unauthorized' };
  }

  const { error } = await supabase.from('api_keys').update({ revoked: true }).eq('id', keyId);

  if (error) {
    return { success: false, error: 'Failed to revoke API key: ' + error.message };
  }

  revalidatePath('/dashboard/api-keys');
  return { success: true };
}
