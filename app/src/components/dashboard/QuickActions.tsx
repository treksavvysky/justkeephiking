'use client';

import { useState } from 'react';
import { updateQuickStat } from '@/lib/actions';

interface QuickActionsProps {
  currentMiles: number;
}

export default function QuickActions({ currentMiles }: QuickActionsProps) {
  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleQuickUpdate = async (increment: number) => {
    setUpdating(true);
    setMessage(null);

    const formData = new FormData();
    formData.append('milesDone', (currentMiles + increment).toString());

    const result = await updateQuickStat(null, formData);

    if (result.success) {
      setMessage(`Added ${increment} miles!`);
      setTimeout(() => setMessage(null), 3000);
    } else {
      setMessage(result.error || 'Update failed');
    }

    setUpdating(false);
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <h3 className="font-semibold mb-4">Quick Mile Updates</h3>
      <p className="text-sm text-muted mb-4">Quickly add miles to your total</p>

      {message && (
        <div className={`mb-4 p-3 rounded-lg text-sm ${
          message.includes('failed') || message.includes('error')
            ? 'bg-red-500/10 border border-red-500/50 text-red-500'
            : 'bg-green-500/10 border border-green-500/50 text-green-500'
        }`}>
          {message}
        </div>
      )}

      <div className="grid grid-cols-3 gap-2">
        <button
          onClick={() => handleQuickUpdate(10)}
          disabled={updating}
          className="bg-background border border-border hover:border-accent py-3 rounded-lg font-medium transition-colors disabled:opacity-50"
        >
          +10 mi
        </button>
        <button
          onClick={() => handleQuickUpdate(15)}
          disabled={updating}
          className="bg-background border border-border hover:border-accent py-3 rounded-lg font-medium transition-colors disabled:opacity-50"
        >
          +15 mi
        </button>
        <button
          onClick={() => handleQuickUpdate(20)}
          disabled={updating}
          className="bg-background border border-border hover:border-accent py-3 rounded-lg font-medium transition-colors disabled:opacity-50"
        >
          +20 mi
        </button>
      </div>

      <div className="mt-4 pt-4 border-t border-border">
        <p className="text-sm text-muted text-center">
          Current total: <span className="font-semibold text-text">{currentMiles} miles</span>
        </p>
      </div>
    </div>
  );
}
