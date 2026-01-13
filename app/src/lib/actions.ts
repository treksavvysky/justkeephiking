import { supabase } from './supabase';
import type { SiteConfig } from '@/types';

/**
 * Fetches the current site configuration from Supabase
 * This is a server-side function (Server Action) that can be called from Server Components
 */
export async function getSiteConfig(): Promise<SiteConfig | null> {
  try {
    const { data, error } = await supabase
      .from('site_config')
      .select('*')
      .order('updated_at', { ascending: false })
      .limit(1)
      .single();

    if (error) {
      console.error('Error fetching site config:', error);
      return null;
    }

    if (!data) {
      return null;
    }

    // Transform database schema to SiteConfig interface
    const config: SiteConfig = {
      mode: data.mode as 'permit' | 'start',
      permitReleaseUTC: data.permit_release_utc || '',
      myPermitSlotUTC: data.my_permit_slot_utc || '',
      startDateISO: data.start_date_iso || '',
      stats: {
        milesDone: Number(data.miles_done) || 0,
        sectionNow: data.section_now || '',
        lastCheckin: data.last_checkin || '',
        nextTown: data.next_town || '',
      },
      liveStatus: {
        state: data.status_state || '',
        area: data.status_area || '',
        blurb: data.status_blurb || '',
        next: data.status_next || '',
      },
    };

    return config;
  } catch (err) {
    console.error('Unexpected error fetching site config:', err);
    return null;
  }
}
