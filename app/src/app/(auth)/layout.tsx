import Link from 'next/link';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <Link href="/" className="text-xl font-bold text-accent hover:opacity-80">
            justkeephiking
          </Link>
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
}
