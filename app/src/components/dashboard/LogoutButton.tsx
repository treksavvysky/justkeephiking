'use client';

import { logout } from '@/lib/auth/actions';

export default function LogoutButton() {
  return (
    <button
      onClick={() => logout()}
      className="text-sm text-muted hover:text-text transition-colors"
    >
      Logout
    </button>
  );
}
