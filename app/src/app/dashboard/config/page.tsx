import { createClient } from '@/lib/supabase/server';
import ConfigForm from '@/components/dashboard/ConfigForm';

export default async function ConfigPage() {
  const supabase = await createClient();

  const { data: config } = await supabase
    .from('site_config')
    .select('*')
    .single();

  if (!config) {
    return (
      <div className="text-center py-12">
        <p className="text-muted">No configuration found.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2">Site Configuration</h2>
        <p className="text-muted">Update countdown, stats, and live status</p>
      </div>

      <ConfigForm config={config} />
    </div>
  );
}
