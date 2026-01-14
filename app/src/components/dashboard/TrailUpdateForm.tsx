'use client';

import { useState } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { createTrailUpdate } from '@/lib/actions';
import PhotoUpload from './PhotoUpload';

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="bg-accent text-background py-3 px-6 rounded-lg font-medium hover:opacity-90 disabled:opacity-50 transition-opacity"
    >
      {pending ? 'Posting...' : 'Post Update'}
    </button>
  );
}

export default function TrailUpdateForm() {
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [state, formAction] = useFormState(createTrailUpdate, { error: null, success: false });

  return (
    <form action={formAction} className="space-y-6">
      {state?.error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-lg text-sm">
          {state.error}
        </div>
      )}

      {state?.success && (
        <div className="bg-green-500/10 border border-green-500/50 text-green-500 p-3 rounded-lg text-sm">
          Trail update posted successfully!
        </div>
      )}

      <div className="bg-card border border-border rounded-lg p-6 space-y-4">
        <h3 className="font-semibold">Location Details</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Location Name
            </label>
            <input
              type="text"
              name="locationName"
              placeholder="e.g., Forester Pass"
              className="w-full bg-background border border-border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Current Mile
            </label>
            <input
              type="number"
              name="currentMile"
              step="0.1"
              min="0"
              max="2650"
              placeholder="e.g., 150.5"
              className="w-full bg-background border border-border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Miles Hiked Today
            </label>
            <input
              type="number"
              name="milesHiked"
              step="0.1"
              min="0"
              placeholder="e.g., 14.2"
              className="w-full bg-background border border-border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Visibility
            </label>
            <select
              name="visibility"
              defaultValue="public"
              className="w-full bg-background border border-border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
            >
              <option value="public">Public</option>
              <option value="friends">Friends Only</option>
              <option value="sponsors">Sponsors Only</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Latitude (Optional)
            </label>
            <input
              type="number"
              name="locationLat"
              step="0.000001"
              min="-90"
              max="90"
              placeholder="e.g., 36.1234"
              className="w-full bg-background border border-border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Longitude (Optional)
            </label>
            <input
              type="number"
              name="locationLon"
              step="0.000001"
              min="-180"
              max="180"
              placeholder="e.g., -118.5678"
              className="w-full bg-background border border-border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg p-6 space-y-4">
        <h3 className="font-semibold">Update Content</h3>

        <div>
          <label className="block text-sm font-medium mb-2">
            Note
          </label>
          <textarea
            name="note"
            rows={6}
            placeholder="What's happening on the trail?"
            className="w-full bg-background border border-border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-accent resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Photo (Optional)
          </label>
          <PhotoUpload onUploadComplete={setPhotoUrl} />
          <input type="hidden" name="photoUrl" value={photoUrl || ''} />
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <button
          type="reset"
          className="bg-card border border-border text-text py-3 px-6 rounded-lg font-medium hover:bg-opacity-80 transition-opacity"
        >
          Clear
        </button>
        <SubmitButton />
      </div>
    </form>
  );
}
