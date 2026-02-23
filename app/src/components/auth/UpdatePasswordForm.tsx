'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { updatePassword } from '@/lib/auth/actions';

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full bg-accent text-background py-3 px-4 rounded-lg font-medium hover:opacity-90 disabled:opacity-50 transition-opacity"
    >
      {pending ? 'Updating...' : 'Update password'}
    </button>
  );
}

export default function UpdatePasswordForm() {
  const [state, formAction] = useFormState(updatePassword, { error: '' });

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <form action={formAction} className="space-y-4">
        {state?.error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-lg text-sm">
            {state.error}
          </div>
        )}

        <div>
          <label htmlFor="password" className="block text-sm font-medium mb-2">
            New password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            minLength={8}
            className="w-full bg-background border border-border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent"
            placeholder="••••••••"
          />
          <p className="mt-1 text-xs text-muted">Minimum 8 characters</p>
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2">
            Confirm new password
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            required
            minLength={8}
            className="w-full bg-background border border-border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent"
            placeholder="••••••••"
          />
        </div>

        <SubmitButton />
      </form>
    </div>
  );
}
