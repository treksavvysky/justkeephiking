export interface SiteConfig {
  mode: 'permit' | 'start';
  permit_release_utc?: string;
  my_permit_slot_utc?: string;
  start_date_iso?: string;
  miles_done?: number;
  miles_total?: number;
  section_now?: string;
  last_checkin?: string;
  next_town?: string;
  status_state?: string;
  status_area?: string;
  status_blurb?: string;
  status_next?: string;
  permitReleaseUTC?: string;
  myPermitSlotUTC?: string;
  startDateISO?: string;
  stats?: {
    milesDone: number;
    sectionNow: string;
    lastCheckin: string;
    nextTown: string;
  };
  liveStatus?: {
    state: string;
    area: string;
    blurb: string;
    next: string;
  };
}
