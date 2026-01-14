'use client';

import { useFormState, useFormStatus } from 'react-dom';
import Link from 'next/link';
import { resetPassword } from '@/lib/auth/actions';

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full bg-accent text-background py-3 px-4 rounded-lg font-medium hover:opacity-90 disabled:opacity-50 transition-opacity"
    >
      {pending ? 'Sending...' : 'Send reset link'}
    </button>
  );
}

export default function ResetPasswordForm() {
  const [state, formAction] = useFormState(resetPassword, { error: '', success: false });

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <form action={formAction} className="space-y-4">
        {state?.error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-lg text-sm">
            {state.error}
          </div>
        )}

        {state?.success && (
          <div className="bg-green-500/10 border border-green-500/50 text-green-500 p-3 rounded-lg text-sm">
            Check your email for a password reset link.
          </div>
        )}

        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-2">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="w-full bg-background border border-border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent"
            placeholder="you@example.com"
          />
        </div>

        <SubmitButton />
      </form>

      <p className="mt-6 text-center text-sm text-muted">
        Remember your password?{' '}
        <Link href="/login" className="text-accent hover:opacity-80">
          Sign in
        </Link>
      </p>
    </div>
  );
}
