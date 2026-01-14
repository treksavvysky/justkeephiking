'use client';

import { useFormState, useFormStatus } from 'react-dom';
import Link from 'next/link';
import { signup } from '@/lib/auth/actions';

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full bg-accent text-background py-3 px-4 rounded-lg font-medium hover:opacity-90 disabled:opacity-50 transition-opacity"
    >
      {pending ? 'Creating account...' : 'Create account'}
    </button>
  );
}

export default function SignupForm() {
  const [state, formAction] = useFormState(signup, { error: '' });

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <form action={formAction} className="space-y-4">
        {state?.error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-lg text-sm">
            {state.error}
          </div>
        )}

        <div>
          <label htmlFor="displayName" className="block text-sm font-medium mb-2">
            Display Name
          </label>
          <input
            id="displayName"
            name="displayName"
            type="text"
            required
            className="w-full bg-background border border-border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent"
            placeholder="Your name"
          />
        </div>

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

        <div>
          <label htmlFor="password" className="block text-sm font-medium mb-2">
            Password
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
          <p className="text-xs text-muted mt-1">Minimum 8 characters</p>
        </div>

        <SubmitButton />
      </form>

      <p className="mt-6 text-center text-sm text-muted">
        Already have an account?{' '}
        <Link href="/login" className="text-accent hover:opacity-80">
          Sign in
        </Link>
      </p>
    </div>
  );
}
