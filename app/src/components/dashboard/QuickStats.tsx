import type { SiteConfig } from '@/types';

export default function QuickStats({ config }: { config: SiteConfig }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="text-sm text-muted mb-1">Current Mode</div>
        <div className="text-2xl font-bold capitalize">{config.mode}</div>
      </div>

      {config.mode === 'start' && (
        <>
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="text-sm text-muted mb-1">Miles Completed</div>
            <div className="text-2xl font-bold">{config.miles_done || 0}</div>
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            <div className="text-sm text-muted mb-1">Current Section</div>
            <div className="text-2xl font-bold">{config.section_now || 'N/A'}</div>
          </div>
        </>
      )}
    </div>
  );
}
