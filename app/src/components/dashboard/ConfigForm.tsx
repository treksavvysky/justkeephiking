'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { updateSiteConfig } from '@/lib/actions';
import type { SiteConfig } from '@/types';

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="bg-accent text-background py-3 px-6 rounded-lg font-medium hover:opacity-90 disabled:opacity-50 transition-opacity"
    >
      {pending ? 'Saving...' : 'Save Changes'}
    </button>
  );
}

export default function ConfigForm({ config }: { config: SiteConfig }) {
  const [state, formAction] = useFormState(updateSiteConfig, { error: null, success: false });

  return (
    <form action={formAction} className="space-y-8">
      {state?.error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-lg text-sm">
          {state.error}
        </div>
      )}

      {state?.success && (
        <div className="bg-green-500/10 border border-green-500/50 text-green-500 p-3 rounded-lg text-sm">
          Configuration updated successfully!
        </div>
      )}

      {/* Mode Selection */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="font-semibold mb-4">Countdown Mode</h3>
        <div className="space-y-3">
          <label className="flex items-center gap-3">
            <input
              type="radio"
              name="mode"
              value="permit"
              defaultChecked={config.mode === 'permit'}
              className="w-4 h-4 text-accent"
            />
            <div>
              <div className="font-medium">Permit Mode</div>
              <div className="text-sm text-muted">Countdown to permit application</div>
            </div>
          </label>
          <label className="flex items-center gap-3">
            <input
              type="radio"
              name="mode"
              value="start"
              defaultChecked={config.mode === 'start'}
              className="w-4 h-4 text-accent"
            />
            <div>
              <div className="font-medium">Trail Mode</div>
              <div className="text-sm text-muted">Countdown to trail start date</div>
            </div>
          </label>
        </div>
      </div>

      {/* Permit Dates */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="font-semibold mb-4">Permit Dates</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Round 2 Release (UTC)
            </label>
            <input
              type="datetime-local"
              name="permitReleaseUTC"
              defaultValue={config.permit_release_utc}
              className="w-full bg-background border border-border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              My Permit Slot (UTC)
            </label>
            <input
              type="datetime-local"
              name="myPermitSlotUTC"
              defaultValue={config.my_permit_slot_utc}
              className="w-full bg-background border border-border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
        </div>
      </div>

      {/* Trail Start */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="font-semibold mb-4">Trail Start</h3>
        <div>
          <label className="block text-sm font-medium mb-2">
            Start Date (ISO 8601)
          </label>
          <input
            type="datetime-local"
            name="startDateISO"
            defaultValue={config.start_date_iso}
            className="w-full bg-background border border-border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
          />
          <p className="text-xs text-muted mt-1">Format: YYYY-MM-DDTHH:MM</p>
        </div>
      </div>

      {/* Trail Stats */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="font-semibold mb-4">Trail Stats</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Miles Done
            </label>
            <input
              type="number"
              name="milesDone"
              defaultValue={config.miles_done || 0}
              min="0"
              max="2650"
              className="w-full bg-background border border-border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Current Section
            </label>
            <input
              type="text"
              name="sectionNow"
              defaultValue={config.section_now || ''}
              placeholder="e.g., Southern California"
              className="w-full bg-background border border-border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Last Check-in
            </label>
            <input
              type="text"
              name="lastCheckin"
              defaultValue={config.last_checkin || ''}
              placeholder="e.g., 2 hours ago"
              className="w-full bg-background border border-border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Total Miles
            </label>
            <input
              type="number"
              name="milesTotal"
              defaultValue={config.miles_total || 2650}
              min="0"
              className="w-full bg-background border border-border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
        </div>
      </div>

      {/* Live Status */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="font-semibold mb-4">Live Status</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Status State
            </label>
            <select
              name="statusState"
              defaultValue={config.status_state || 'good'}
              className="w-full bg-background border border-border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
            >
              <option value="good">Good</option>
              <option value="warning">Warning</option>
              <option value="emergency">Emergency</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Current Area
            </label>
            <input
              type="text"
              name="statusArea"
              defaultValue={config.status_area || ''}
              placeholder="e.g., San Jacinto Mountains"
              className="w-full bg-background border border-border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Status Blurb
            </label>
            <textarea
              name="statusBlurb"
              defaultValue={config.status_blurb || ''}
              rows={3}
              placeholder="Brief status update..."
              className="w-full bg-background border border-border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-accent resize-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Next Milestone
            </label>
            <input
              type="text"
              name="statusNext"
              defaultValue={config.status_next || ''}
              placeholder="e.g., Arriving in Idyllwild tomorrow"
              className="w-full bg-background border border-border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <SubmitButton />
      </div>
    </form>
  );
}
