'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/dashboard', label: 'Home' },
  { href: '/dashboard/update', label: 'Update' },
  { href: '/dashboard/config', label: 'Config' },
  { href: '/dashboard/api-keys', label: 'API Keys' },
];

export default function DashboardNav() {
  const pathname = usePathname();

  return (
    <nav className="hidden md:flex items-center gap-6">
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={`text-sm font-medium transition-colors ${
            pathname === item.href
              ? 'text-accent'
              : 'text-muted hover:text-text'
          }`}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
