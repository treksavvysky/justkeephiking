import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import DashboardNav from '@/components/dashboard/DashboardNav';
import LogoutButton from '@/components/dashboard/LogoutButton';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Get user profile with role
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border sticky top-0 bg-background/95 backdrop-blur z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <h1 className="text-xl font-bold text-accent">Dashboard</h1>
              <DashboardNav />
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted hidden sm:inline">
                {profile?.display_name || user.email}
              </span>
              {profile?.role === 'admin' && (
                <span className="text-xs bg-accent/20 text-accent px-2 py-1 rounded">
                  Admin
                </span>
              )}
              <LogoutButton />
            </div>
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}
