import Countdown from '@/components/countdown/Countdown';
import type { SiteConfig } from '@/types';

// This will be replaced with Supabase data fetch later
const defaultConfig: SiteConfig = {
  mode: 'permit',
  permitReleaseUTC: '2026-01-13T18:30:00Z',
  myPermitSlotUTC: '2026-01-13T20:48:07Z',
  startDateISO: '',
  stats: {
    milesDone: 0,
    sectionNow: 'Permitting',
    lastCheckin: 'Today',
    nextTown: 'Campo (soon)',
  },
  liveStatus: {
    state: 'Planning / Permit Day',
    area: 'Off-trail (ops planning)',
    blurb: 'Finalizing my NOBO start date today.',
    next: 'After permit is confirmed.',
  },
};

export default function Home() {
  const year = new Date().getFullYear();

  return (
    <div className="container">
      <header className="flex items-center justify-between gap-4 py-2.5 pb-5 sticky top-0 backdrop-blur-[10px] bg-gradient-to-b from-[rgba(26,20,40,0.85)] to-[rgba(26,20,40,0.55)] z-10">
        <div className="flex flex-col leading-tight">
          <b className="text-base tracking-wide">justkeephiking.com</b>
          <small className="text-[var(--muted)] text-xs">
            PCT mission control
          </small>
        </div>
        <nav className="hidden md:flex gap-3.5 flex-wrap justify-end">
          <a
            href="#status"
            className="text-[var(--text)] opacity-90 text-[13px] py-2 px-2.5 rounded-xl hover:bg-[rgba(255,255,255,0.06)] hover:no-underline"
          >
            Live Status
          </a>
          <a
            href="#log"
            className="text-[var(--text)] opacity-90 text-[13px] py-2 px-2.5 rounded-xl hover:bg-[rgba(255,255,255,0.06)] hover:no-underline"
          >
            Trail Log
          </a>
          <a
            href="#route"
            className="text-[var(--text)] opacity-90 text-[13px] py-2 px-2.5 rounded-xl hover:bg-[rgba(255,255,255,0.06)] hover:no-underline"
          >
            Route Map
          </a>
          <a
            href="#gear"
            className="text-[var(--text)] opacity-90 text-[13px] py-2 px-2.5 rounded-xl hover:bg-[rgba(255,255,255,0.06)] hover:no-underline"
          >
            Gear
          </a>
          <a
            href="#support"
            className="text-[var(--text)] opacity-90 text-[13px] py-2 px-2.5 rounded-xl hover:bg-[rgba(255,255,255,0.06)] hover:no-underline"
          >
            Support
          </a>
        </nav>
      </header>

      <section className="grid md:grid-cols-[1.2fr_0.8fr] gap-4 items-stretch mt-2.5">
        <div className="card">
          <h1 className="m-0 mb-2.5 text-4xl md:text-[36px] tracking-tight">
            Just Keep Hiking.
          </h1>
          <p className="text-[var(--muted)] text-[15px] leading-relaxed m-0 mb-4">
            This year I'm hiking the Pacific Crest Trail again — reliving the
            memories, rediscovering the trail. This page is the simple "where I
            am + what's next" hub.
          </p>
          <div className="flex gap-2.5 flex-wrap">
            <a href="#follow" className="btn btn-primary">
              Get updates
            </a>
            <a href="#status" className="btn">
              View Live Status
            </a>
          </div>

          <div
            className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-2.5"
            aria-label="quick stats"
          >
            <div className="border border-[var(--border)] rounded-[14px] p-3 bg-[rgba(255,255,255,0.02)]">
              <b className="block text-base font-[tabular-nums]">
                {defaultConfig.stats.milesDone.toLocaleString()}
              </b>
              <small className="text-[var(--muted)] text-[11px]">
                Miles completed
              </small>
            </div>
            <div className="border border-[var(--border)] rounded-[14px] p-3 bg-[rgba(255,255,255,0.02)]">
              <b className="block text-base font-[tabular-nums]">
                {defaultConfig.stats.sectionNow}
              </b>
              <small className="text-[var(--muted)] text-[11px]">
                Current section
              </small>
            </div>
            <div className="border border-[var(--border)] rounded-[14px] p-3 bg-[rgba(255,255,255,0.02)]">
              <b className="block text-base font-[tabular-nums]">
                {defaultConfig.stats.lastCheckin}
              </b>
              <small className="text-[var(--muted)] text-[11px]">
                Last check-in
              </small>
            </div>
            <div className="border border-[var(--border)] rounded-[14px] p-3 bg-[rgba(255,255,255,0.02)]">
              <b className="block text-base font-[tabular-nums]">
                {defaultConfig.stats.nextTown}
              </b>
              <small className="text-[var(--muted)] text-[11px]">
                Next town/resupply
              </small>
            </div>
          </div>
        </div>

        <Countdown config={defaultConfig} />
      </section>

      <section id="status" className="grid md:grid-cols-2 gap-3.5 mt-4">
        <div className="card">
          <div className="flex items-start justify-between gap-2.5 flex-wrap">
            <h2 className="m-0 mb-2 text-base">Right now</h2>
            <span className="inline-flex items-center gap-2 text-xs py-1.5 px-2.5 rounded-full bg-[var(--good)] border border-[rgba(255,123,95,0.40)] text-[var(--text)]">
              <span className="w-2 h-2 rounded-full bg-[var(--accent)]"></span>
              <span>{defaultConfig.liveStatus.state}</span>
            </span>
          </div>
          <div className="h-px bg-[var(--border)] my-4"></div>
          <p className="m-0 text-[var(--muted)] leading-relaxed text-sm">
            <b className="text-[var(--text)]">Area:</b>{' '}
            {defaultConfig.liveStatus.area}
          </p>
          <p className="m-0 mt-2 text-[var(--muted)] leading-relaxed text-sm">
            <b className="text-[var(--text)]">Latest:</b>{' '}
            {defaultConfig.liveStatus.blurb}
          </p>
          <p className="m-0 mt-2 text-[var(--muted)] leading-relaxed text-sm">
            <b className="text-[var(--text)]">Next update:</b>{' '}
            {defaultConfig.liveStatus.next}
          </p>
          <div className="flex gap-2.5 flex-wrap mt-3.5">
            <a href="#log" className="btn">
              Open today's log
            </a>
          </div>
        </div>

        <div className="card" id="follow">
          <h2 className="m-0 mb-2 text-base">Follow the journey</h2>
          <p className="m-0 text-[var(--muted)] leading-relaxed text-sm">
            Fast, low-drama updates. Weekly recaps once the trail begins.
          </p>
          <div className="h-px bg-[var(--border)] my-4"></div>
          <p className="text-xs text-[var(--muted)]">
            MVP note: this is a placeholder box. If you want instant signups
            today, use a Google Form / Mailchimp embed later.
          </p>
          <div className="flex gap-2.5 flex-wrap mt-3.5">
            <button
              className="btn btn-primary"
              onClick={() =>
                alert('MVP placeholder — add a signup form when ready.')
              }
            >
              Subscribe
            </button>
            <a href="#support" className="btn">
              Support
            </a>
          </div>
        </div>
      </section>

      <section className="grid md:grid-cols-2 gap-3.5 mt-3.5">
        <div className="card" id="log">
          <h2 className="m-0 mb-2 text-base">Trail log</h2>
          <p className="m-0 text-[var(--muted)] leading-relaxed text-sm">
            Coming online as short daily entries (miles, lesson, photo) once I'm
            moving.
          </p>
        </div>
        <div className="card" id="support">
          <h2 className="m-0 mb-2 text-base">Support</h2>
          <p className="m-0 text-[var(--muted)] leading-relaxed text-sm">
            Fuel for the journey: wishlist, sponsor page, or one-time support.
            (Links coming.)
          </p>
        </div>
      </section>

      <section className="card mt-3.5" id="route">
        <h2 className="m-0 mb-2 text-base">Route map</h2>
        <p className="m-0 text-[var(--muted)] leading-relaxed text-sm">
          MVP: map module later. For now, the site stays fast and
          signal-friendly.
        </p>
      </section>

      <section className="card mt-3.5" id="gear">
        <h2 className="m-0 mb-2 text-base">Gear</h2>
        <p className="m-0 text-[var(--muted)] leading-relaxed text-sm">
          A clean gear list + base weight, with a change log. (Later. After we
          win permitting day.)
        </p>
      </section>

      <div className="mt-5 text-[var(--muted)] text-xs opacity-95">
        Location is intentionally approximate. Updates may lag due to signal. ©{' '}
        {year} Just Keep Hiking.
      </div>
    </div>
  );
}
