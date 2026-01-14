'use client';

import { useEffect, useState } from 'react';
import type { SiteConfig } from '@/types';

interface CountdownProps {
  config: SiteConfig;
}

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function Countdown({ config }: CountdownProps) {
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [label, setLabel] = useState('');
  const [title, setTitle] = useState('');
  const [meta, setMeta] = useState('');
  const [note, setNote] = useState('');

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const releaseTime = new Date(config.permitReleaseUTC || '');
      const mySlotTime = new Date(config.myPermitSlotUTC || '');
      const startTime = config.startDateISO
        ? new Date(config.startDateISO)
        : null;

      let target: Date;
      let newLabel: string;
      let newTitle: string;
      let newMeta: string;
      let newNote: string;

      // Determine which countdown to show
      if (config.mode === 'start' && startTime) {
        // Final mode: counting down to trail start
        target = startTime;
        newLabel = 'Campo Start';
        newTitle = 'Start date locked';
        newMeta = 'Countdown to Campo';
        newNote = 'It begins.';
      } else if (now < releaseTime) {
        // Stage 1: Before Round 2 opens
        target = releaseTime;
        newLabel = 'NOBO Permit Release';
        newTitle = 'Round 2 opens';
        newMeta = 'Jan 13 · 10:30 AM PT';
        newNote =
          'Eagerly waiting for my permit slot at 12:48:07 PM PT to pick my start date. Big day for the hiking community!';
      } else if (now < mySlotTime) {
        // Stage 2: Round 2 is open, waiting for my slot
        target = mySlotTime;
        newLabel = 'MY PERMIT SLOT';
        newTitle = 'Time to pick my date';
        newMeta = 'Jan 13 · 12:48:07 PM PT';
        newNote = 'Round 2 portal is open. My turn is coming up!';
      } else {
        // After my slot time
        target = mySlotTime;
        newLabel = 'PERMIT SLOT';
        newTitle = 'Decision time';
        newMeta = 'Jan 13 · 12:48:07 PM PT';
        newNote = 'Portal time. Time to pick the date and commit.';
      }

      setLabel(newLabel);
      setTitle(newTitle);
      setMeta(newMeta);
      setNote(newNote);

      // Calculate time difference
      let diff = target.getTime() - now.getTime();
      if (diff <= 0) diff = 0;

      const s = Math.floor(diff / 1000);
      const days = Math.floor(s / 86400);
      const hours = Math.floor((s % 86400) / 3600);
      const minutes = Math.floor((s % 3600) / 60);
      const seconds = s % 60;

      setTimeRemaining({ days, hours, minutes, seconds });
    };

    tick();
    const interval = setInterval(tick, 250);

    return () => clearInterval(interval);
  }, [config]);

  const pad2 = (n: number) => String(n).padStart(2, '0');

  return (
    <div className="card flex flex-col gap-[10px]">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <div className="text-xs text-[var(--muted)]">{label}</div>
          <div className="font-bold text-base mt-0.5">{title}</div>
        </div>
        <span className="text-xs py-1.5 px-2.5 rounded-full border border-[var(--border)] text-[var(--muted)] bg-[rgba(255,255,255,0.02)] whitespace-nowrap">
          {meta}
        </span>
      </div>

      <div className="grid grid-cols-4 gap-2.5 font-[tabular-nums]">
        <div className="border border-[var(--border)] rounded-[14px] p-3 bg-[rgba(255,255,255,0.02)] text-center">
          <div className="block text-xl md:text-[28px] font-bold">
            {pad2(timeRemaining.days)}
          </div>
          <div className="block text-[var(--muted)] text-[11px] mt-0.5 tracking-wide">
            Days
          </div>
        </div>
        <div className="border border-[var(--border)] rounded-[14px] p-3 bg-[rgba(255,255,255,0.02)] text-center">
          <div className="block text-xl md:text-[28px] font-bold">
            {pad2(timeRemaining.hours)}
          </div>
          <div className="block text-[var(--muted)] text-[11px] mt-0.5 tracking-wide">
            Hours
          </div>
        </div>
        <div className="border border-[var(--border)] rounded-[14px] p-3 bg-[rgba(255,255,255,0.02)] text-center">
          <div className="block text-xl md:text-[28px] font-bold">
            {pad2(timeRemaining.minutes)}
          </div>
          <div className="block text-[var(--muted)] text-[11px] mt-0.5 tracking-wide">
            Mins
          </div>
        </div>
        <div className="border border-[var(--border)] rounded-[14px] p-3 bg-[rgba(255,255,255,0.02)] text-center">
          <div className="block text-xl md:text-[28px] font-bold">
            {pad2(timeRemaining.seconds)}
          </div>
          <div className="block text-[var(--muted)] text-[11px] mt-0.5 tracking-wide">
            Secs
          </div>
        </div>
      </div>

      <div className="text-[var(--muted)] text-xs leading-tight">{note}</div>
    </div>
  );
}
