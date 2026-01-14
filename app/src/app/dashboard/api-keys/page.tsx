/**
 * API Keys Management Page
 *
 * Admin dashboard for creating, viewing, and revoking API keys
 * for custom GPT integration and external access.
 */

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import ApiKeysManager from '@/components/dashboard/ApiKeysManager';

export default async function ApiKeysPage() {
  const supabase = await createClient();

  // Check authentication
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Fetch user's profile to verify admin role
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'admin') {
    redirect('/dashboard');
  }

  // Fetch existing API keys
  const { data: apiKeys } = await supabase
    .from('api_keys')
    .select('id, key_prefix, name, scope, rate_limit, last_used_at, created_at, expires_at, revoked')
    .order('created_at', { ascending: false });

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">API Keys</h1>
        <p className="text-muted">
          Manage API keys for custom GPT integration and external access to trail data.
        </p>
      </div>

      <div className="bg-card border border-border rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">About API Keys</h2>
        <div className="space-y-3 text-sm text-muted">
          <p>
            API keys allow custom GPTs (like ChatGPT) and other AI assistants to access your trail
            data programmatically via api.justkeephiking.com.
          </p>
          <p>
            <strong>Scopes:</strong>
          </p>
          <ul className="list-disc list-inside ml-4 space-y-1">
            <li>
              <strong>Read</strong> - Access public trail data (status, updates, stats, gear)
            </li>
            <li>
              <strong>Write</strong> - Create trail updates (for automated posting)
            </li>
            <li>
              <strong>Admin</strong> - Full access (manage site config, protected content)
            </li>
          </ul>
          <p className="text-accent">
            ⚠️ Keep your API keys secret! They provide access to your account.
          </p>
        </div>
      </div>

      <ApiKeysManager apiKeys={apiKeys || []} userId={user.id} />

      <div className="mt-8 bg-card border border-border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Custom GPT Setup</h2>
        <div className="space-y-4 text-sm">
          <div>
            <h3 className="font-medium mb-2">1. Create an API key</h3>
            <p className="text-muted">
              Generate a new API key above with "Read" scope (recommended for GPTs).
            </p>
          </div>
          <div>
            <h3 className="font-medium mb-2">2. Configure your custom GPT</h3>
            <div className="bg-background border border-border rounded p-3 space-y-2">
              <p className="text-muted">In ChatGPT custom GPT settings:</p>
              <ul className="list-disc list-inside ml-4 space-y-1 text-muted">
                <li>
                  <strong>Actions</strong> → Import from URL
                </li>
                <li>
                  <strong>URL</strong>:{' '}
                  <code className="text-accent">https://justkeephiking.com/api/v1/openapi</code>
                </li>
                <li>
                  <strong>Authentication</strong> → Bearer token
                </li>
                <li>
                  <strong>Token</strong> → Paste your API key (sk_live_...)
                </li>
              </ul>
            </div>
          </div>
          <div>
            <h3 className="font-medium mb-2">3. Test the integration</h3>
            <p className="text-muted">
              Ask your custom GPT: "Where is George right now?" or "What were his last 5 trail
              updates?"
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8 bg-card border border-border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">API Documentation</h2>
        <p className="text-sm text-muted mb-4">
          View the complete API documentation and test endpoints:
        </p>
        <div className="space-y-2">
          <a
            href="https://justkeephiking.com/api/v1/openapi"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block text-accent hover:opacity-80 text-sm"
          >
            OpenAPI Specification →
          </a>
          <br />
          <a
            href="/dashboard/api-keys/docs"
            className="inline-block text-accent hover:opacity-80 text-sm"
          >
            Interactive API Explorer →
          </a>
        </div>
      </div>
    </div>
  );
}
