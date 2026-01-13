export interface SiteConfig {
  mode: 'permit' | 'start';
  permitReleaseUTC: string;
  myPermitSlotUTC: string;
  startDateISO: string;
  stats: {
    milesDone: number;
    sectionNow: string;
    lastCheckin: string;
    nextTown: string;
  };
  liveStatus: {
    state: string;
    area: string;
    blurb: string;
    next: string;
  };
}
