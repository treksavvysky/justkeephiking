import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Just Keep Hiking — Pacific Crest Trail',
  description:
    'Just Keep Hiking — Pacific Crest Trail mission control: status, countdowns, and trail logs.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
