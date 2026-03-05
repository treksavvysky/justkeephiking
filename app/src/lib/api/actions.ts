/**
 * Server Actions for API Key Management
 */

'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { generateApiKey, revokeApiKey } from '@/lib/api/auth';

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

  // Calculate expiration date
  let expiresAt: Date | undefined = undefined;
  if (expiresInDays && parseInt(expiresInDays) > 0) {
    const expDate = new Date();
    expDate.setDate(expDate.getDate() + parseInt(expiresInDays));
    expiresAt = expDate;
  }

  const generated = await generateApiKey(name, scope, user.id, expiresAt);
  if (!generated) {
    return { success: false, error: 'Failed to create API key' };
  }

  revalidatePath('/dashboard/api-keys');

  // Return the full key (this is the ONLY time we return it!)
  return { success: true, key: generated.key, keyPrefix: generated.keyPrefix };
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

  const success = await revokeApiKey(keyId);
  if (!success) {
    return { success: false, error: 'Failed to revoke API key' };
  }

  revalidatePath('/dashboard/api-keys');
  return { success: true };
}
