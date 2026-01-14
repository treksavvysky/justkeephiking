import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import QuickStats from '@/components/dashboard/QuickStats';
import QuickActions from '@/components/dashboard/QuickActions';

export default async function DashboardPage() {
  const supabase = await createClient();

  // Get site config
  const { data: config } = await supabase
    .from('site_config')
    .select('*')
    .single();

  // Get recent trail updates
  const { data: updates } = await supabase
    .from('trail_updates')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-2">Welcome back</h2>
        <p className="text-muted">Manage your trail journey</p>
      </div>

      {config && <QuickStats config={config} />}

      {config && config.mode === 'start' && (
        <QuickActions currentMiles={config.miles_done || 0} />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Link
          href="/dashboard/update"
          className="bg-card border border-border rounded-lg p-6 hover:border-accent transition-colors"
        >
          <div className="text-3xl mb-2">📍</div>
          <h3 className="font-semibold mb-1">Quick Update</h3>
          <p className="text-sm text-muted">Post a trail update</p>
        </Link>

        <Link
          href="/dashboard/config"
          className="bg-card border border-border rounded-lg p-6 hover:border-accent transition-colors"
        >
          <div className="text-3xl mb-2">⚙️</div>
          <h3 className="font-semibold mb-1">Site Config</h3>
          <p className="text-sm text-muted">Update countdown and stats</p>
        </Link>

        <Link
          href="/dashboard/blog"
          className="bg-card border border-border rounded-lg p-6 hover:border-accent transition-colors"
        >
          <div className="text-3xl mb-2">📝</div>
          <h3 className="font-semibold mb-1">Blog Posts</h3>
          <p className="text-sm text-muted">Write long-form content</p>
        </Link>

        <Link
          href="/dashboard/galleries"
          className="bg-card border border-border rounded-lg p-6 hover:border-accent transition-colors"
        >
          <div className="text-3xl mb-2">📸</div>
          <h3 className="font-semibold mb-1">Galleries</h3>
          <p className="text-sm text-muted">Manage photo collections</p>
        </Link>

        <Link
          href="/dashboard/gear"
          className="bg-card border border-border rounded-lg p-6 hover:border-accent transition-colors"
        >
          <div className="text-3xl mb-2">⚖️</div>
          <h3 className="font-semibold mb-1">Gear List</h3>
          <p className="text-sm text-muted">Track your equipment</p>
        </Link>

        <Link
          href="/dashboard/subscribers"
          className="bg-card border border-border rounded-lg p-6 hover:border-accent transition-colors"
        >
          <div className="text-3xl mb-2">📧</div>
          <h3 className="font-semibold mb-1">Subscribers</h3>
          <p className="text-sm text-muted">Manage email list</p>
        </Link>
      </div>

      {updates && updates.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold mb-4">Recent Updates</h3>
          <div className="space-y-2">
            {updates.map((update) => (
              <div
                key={update.id}
                className="bg-card border border-border rounded-lg p-4 flex items-center justify-between"
              >
                <div>
                  <p className="font-medium">{update.location_name || 'Trail Update'}</p>
                  <p className="text-sm text-muted">
                    {update.current_mile ? `Mile ${update.current_mile}` : ''} • {update.visibility}
                  </p>
                </div>
                <Link
                  href={`/dashboard/update/${update.id}`}
                  className="text-sm text-accent hover:opacity-80"
                >
                  Edit
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
