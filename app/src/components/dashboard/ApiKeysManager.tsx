'use client';

import { useState } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { createApiKey, revokeApiKeyAction } from '@/lib/api/actions';

interface ApiKey {
  id: string;
  key_prefix: string;
  name: string;
  scope: 'read' | 'write' | 'admin';
  rate_limit: number;
  last_used_at: string | null;
  created_at: string;
  expires_at: string | null;
  revoked: boolean;
}

interface Props {
  apiKeys: ApiKey[];
  userId: string;
}

function CreateButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="flex-1 bg-accent text-background py-2 px-4 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
    >
      {pending ? 'Creating...' : 'Create API Key'}
    </button>
  );
}

export default function ApiKeysManager({ apiKeys: initialKeys, userId }: Props) {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>(initialKeys);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newKeyData, setNewKeyData] = useState<{ key: string; keyPrefix: string } | null>(null);

  const [createState, createFormAction] = useFormState(
    async (prevState: any, formData: FormData) => {
      const result = await createApiKey(prevState, formData);
      if (result.success && result.key && result.keyPrefix) {
        setNewKeyData({ key: result.key, keyPrefix: result.keyPrefix });
        setShowCreateForm(false);
        // Refresh will happen via revalidatePath
        setTimeout(() => window.location.reload(), 100);
      }
      return result;
    },
    { success: false, error: '' }
  );

  const handleRevoke = async (keyId: string) => {
    if (!confirm('Are you sure you want to revoke this API key? This action cannot be undone.')) {
      return;
    }

    const result = await revokeApiKeyAction(keyId);
    if (result.success) {
      setApiKeys((keys) => keys.map((k) => (k.id === keyId ? { ...k, revoked: true } : k)));
    } else {
      alert(result.error || 'Failed to revoke API key');
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString();
  };

  const formatTimeAgo = (dateString: string | null) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  return (
    <div>
      {/* Show new key modal */}
      {newKeyData && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card border border-border rounded-lg p-6 max-w-lg mx-4">
            <h2 className="text-xl font-semibold mb-4">API Key Created!</h2>
            <p className="text-sm text-muted mb-4">
              Copy this key now. For security reasons, it will not be shown again.
            </p>
            <div className="bg-background border border-border rounded p-3 mb-4 font-mono text-sm break-all">
              {newKeyData.key}
            </div>
            <button
              onClick={() => {
                navigator.clipboard.writeText(newKeyData.key);
                alert('API key copied to clipboard!');
              }}
              className="w-full bg-accent text-background py-2 px-4 rounded-lg hover:opacity-90 transition-opacity mb-2"
            >
              Copy to Clipboard
            </button>
            <button
              onClick={() => setNewKeyData(null)}
              className="w-full bg-background border border-border py-2 px-4 rounded-lg hover:bg-card transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Create button */}
      <div className="mb-6">
        {!showCreateForm && (
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-accent text-background py-2 px-4 rounded-lg hover:opacity-90 transition-opacity"
          >
            + Create New API Key
          </button>
        )}
      </div>

      {/* Create form */}
      {showCreateForm && (
        <div className="bg-card border border-border rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Create New API Key</h2>
          <form action={createFormAction} className="space-y-4">
            {createState?.error && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-lg text-sm">
                {createState.error}
              </div>
            )}

            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-2">
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                placeholder="ChatGPT Custom GPT"
                className="w-full bg-background border border-border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>

            <div>
              <label htmlFor="scope" className="block text-sm font-medium mb-2">
                Scope
              </label>
              <select
                id="scope"
                name="scope"
                defaultValue="read"
                className="w-full bg-background border border-border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
              >
                <option value="read">Read - Access public trail data</option>
                <option value="write">Write - Create trail updates</option>
                <option value="admin">Admin - Full access (use with caution)</option>
              </select>
            </div>

            <div>
              <label htmlFor="expiresInDays" className="block text-sm font-medium mb-2">
                Expires In (optional)
              </label>
              <select
                id="expiresInDays"
                name="expiresInDays"
                defaultValue=""
                className="w-full bg-background border border-border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
              >
                <option value="">Never</option>
                <option value="30">30 days</option>
                <option value="90">90 days</option>
                <option value="365">1 year</option>
              </select>
            </div>

            <div className="flex gap-3">
              <CreateButton />
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="flex-1 bg-background border border-border py-2 px-4 rounded-lg hover:bg-card transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* API keys list */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-background border-b border-border">
            <tr>
              <th className="text-left py-3 px-4 text-sm font-medium">Name</th>
              <th className="text-left py-3 px-4 text-sm font-medium">Key</th>
              <th className="text-left py-3 px-4 text-sm font-medium">Scope</th>
              <th className="text-left py-3 px-4 text-sm font-medium">Last Used</th>
              <th className="text-left py-3 px-4 text-sm font-medium">Created</th>
              <th className="text-left py-3 px-4 text-sm font-medium">Status</th>
              <th className="text-right py-3 px-4 text-sm font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {apiKeys.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center py-8 text-muted">
                  No API keys yet. Create one to get started.
                </td>
              </tr>
            )}
            {apiKeys.map((key) => (
              <tr key={key.id} className="border-b border-border last:border-b-0">
                <td className="py-3 px-4 text-sm">{key.name}</td>
                <td className="py-3 px-4 text-sm font-mono">{key.key_prefix}...</td>
                <td className="py-3 px-4 text-sm">
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      key.scope === 'admin'
                        ? 'bg-red-500/20 text-red-500'
                        : key.scope === 'write'
                        ? 'bg-yellow-500/20 text-yellow-500'
                        : 'bg-green-500/20 text-green-500'
                    }`}
                  >
                    {key.scope}
                  </span>
                </td>
                <td className="py-3 px-4 text-sm text-muted">{formatTimeAgo(key.last_used_at)}</td>
                <td className="py-3 px-4 text-sm text-muted">{formatDate(key.created_at)}</td>
                <td className="py-3 px-4 text-sm">
                  {key.revoked ? (
                    <span className="text-red-500">Revoked</span>
                  ) : key.expires_at && new Date(key.expires_at) < new Date() ? (
                    <span className="text-yellow-500">Expired</span>
                  ) : (
                    <span className="text-green-500">Active</span>
                  )}
                </td>
                <td className="py-3 px-4 text-sm text-right">
                  {!key.revoked && (
                    <button
                      onClick={() => handleRevoke(key.id)}
                      className="text-red-500 hover:opacity-80 text-sm"
                    >
                      Revoke
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
