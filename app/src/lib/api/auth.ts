/**
 * API Authentication Utilities
 *
 * Handles API key validation and rate limiting for api.justkeephiking.com
 */

import { createClient } from '@/lib/supabase/server';
import crypto from 'crypto';

export interface ApiKeyData {
  id: string;
  keyPrefix: string;
  name: string;
  scope: 'read' | 'write' | 'admin';
  rateLimit: number;
  revoked: boolean;
  expiresAt: string | null;
}

export interface AuthResult {
  success: boolean;
  apiKey?: ApiKeyData;
  error?: string;
}

/**
 * Validate API key from Authorization header
 *
 * @param authHeader - Authorization header value (e.g., "Bearer sk_live_...")
 * @returns Authentication result with API key data or error
 */
export async function validateApiKey(authHeader: string | null): Promise<AuthResult> {
  if (!authHeader) {
    return { success: false, error: 'Missing Authorization header' };
  }

  // Extract token from "Bearer <token>" format
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return { success: false, error: 'Invalid Authorization header format. Use: Bearer <api_key>' };
  }

  const apiKey = parts[1];

  // Validate key format (should start with sk_live_ or sk_test_)
  if (!apiKey.startsWith('sk_live_') && !apiKey.startsWith('sk_test_')) {
    return { success: false, error: 'Invalid API key format' };
  }

  // Hash the key to compare with stored hash
  const keyHash = crypto.createHash('sha256').update(apiKey).digest('hex');
  const keyPrefix = apiKey.substring(0, 12); // e.g., "sk_live_abc1"

  // Query database for matching key
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('api_keys')
    .select('id, key_prefix, name, scope, rate_limit, revoked, expires_at')
    .eq('key_hash', keyHash)
    .single();

  if (error || !data) {
    return { success: false, error: 'Invalid API key' };
  }

  // Check if key is revoked
  if (data.revoked) {
    return { success: false, error: 'API key has been revoked' };
  }

  // Check if key has expired
  if (data.expires_at && new Date(data.expires_at) < new Date()) {
    return { success: false, error: 'API key has expired' };
  }

  // Update last_used_at timestamp (fire and forget)
  supabase
    .from('api_keys')
    .update({ last_used_at: new Date().toISOString() })
    .eq('id', data.id)
    .then(() => {}, () => {});

  return {
    success: true,
    apiKey: {
      id: data.id,
      keyPrefix: data.key_prefix,
      name: data.name,
      scope: data.scope,
      rateLimit: data.rate_limit,
      revoked: data.revoked,
      expiresAt: data.expires_at,
    },
  };
}

/**
 * Check if API key has required scope
 *
 * @param apiKey - API key data
 * @param requiredScope - Required scope ('read', 'write', or 'admin')
 * @returns True if key has sufficient permissions
 */
export function hasScope(apiKey: ApiKeyData, requiredScope: 'read' | 'write' | 'admin'): boolean {
  const scopeHierarchy = { read: 0, write: 1, admin: 2 };
  return scopeHierarchy[apiKey.scope] >= scopeHierarchy[requiredScope];
}

/**
 * Log API usage for analytics
 *
 * @param apiKeyId - API key ID
 * @param endpoint - Endpoint path (e.g., "/v1/status")
 * @param method - HTTP method
 * @param statusCode - Response status code
 * @param responseTimeMs - Response time in milliseconds
 * @param ipAddress - Client IP address
 * @param userAgent - Client user agent
 */
export async function logApiUsage(
  apiKeyId: string,
  endpoint: string,
  method: string,
  statusCode: number,
  responseTimeMs: number,
  ipAddress?: string,
  userAgent?: string
): Promise<void> {
  try {
    const supabase = await createClient();
    await supabase.from('api_usage').insert({
      api_key_id: apiKeyId,
      endpoint,
      method,
      status_code: statusCode,
      response_time_ms: responseTimeMs,
      ip_address: ipAddress || null,
      user_agent: userAgent || null,
    });
  } catch (error) {
    // Don't fail the request if logging fails
    console.error('Failed to log API usage:', error);
  }
}

/**
 * Generate a new API key
 *
 * @param name - Friendly name for the key
 * @param scope - Permission scope
 * @param createdBy - User ID who created the key
 * @param expiresAt - Optional expiration date
 * @returns The generated API key (only returned once!)
 */
export async function generateApiKey(
  name: string,
  scope: 'read' | 'write' | 'admin' = 'read',
  createdBy: string,
  expiresAt?: Date
): Promise<{ key: string; keyPrefix: string } | null> {
  // Generate random key: sk_live_[32 random hex chars]
  const randomBytes = crypto.randomBytes(16);
  const keySecret = randomBytes.toString('hex');
  const key = `sk_live_${keySecret}`;
  const keyPrefix = key.substring(0, 12);

  // Hash the key for storage
  const keyHash = crypto.createHash('sha256').update(key).digest('hex');

  // Store in database
  const supabase = await createClient();
  const { error } = await supabase.from('api_keys').insert({
    key_hash: keyHash,
    key_prefix: keyPrefix,
    name,
    scope,
    created_by: createdBy,
    expires_at: expiresAt?.toISOString() || null,
  });

  if (error) {
    console.error('Failed to create API key:', error);
    return null;
  }

  // Return the full key (this is the ONLY time we return it!)
  return { key, keyPrefix };
}

/**
 * Revoke an API key
 *
 * @param keyId - API key ID to revoke
 */
export async function revokeApiKey(keyId: string): Promise<boolean> {
  const supabase = await createClient();
  const { error } = await supabase
    .from('api_keys')
    .update({ revoked: true })
    .eq('id', keyId);

  return !error;
}
