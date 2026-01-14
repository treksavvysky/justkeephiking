'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from './supabase/server';
import type { SiteConfig } from '@/types';

/**
 * Fetches the current site configuration from Supabase
 * This is a server-side function (Server Action) that can be called from Server Components
 */
export async function getSiteConfig(): Promise<SiteConfig | null> {
  try {
    const supabase = await createClient();
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

/**
 * Updates site configuration
 */
export async function updateSiteConfig(prevState: any, formData: FormData) {
  try {
    const supabase = await createClient();

    const updates = {
      mode: formData.get('mode') as string,
      permit_release_utc: formData.get('permitReleaseUTC') as string,
      my_permit_slot_utc: formData.get('myPermitSlotUTC') as string,
      start_date_iso: formData.get('startDateISO') as string,
      miles_done: parseInt(formData.get('milesDone') as string) || 0,
      section_now: formData.get('sectionNow') as string,
      last_checkin: formData.get('lastCheckin') as string,
      miles_total: parseInt(formData.get('milesTotal') as string) || 2650,
      status_state: formData.get('statusState') as string,
      status_area: formData.get('statusArea') as string,
      status_blurb: formData.get('statusBlurb') as string,
      status_next: formData.get('statusNext') as string,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase
      .from('site_config')
      .update(updates)
      .eq('id', (await supabase.from('site_config').select('id').single()).data?.id);

    if (error) {
      return { error: error.message, success: false };
    }

    revalidatePath('/', 'layout');
    return { error: null, success: true };
  } catch (err) {
    return { error: 'Failed to update configuration', success: false };
  }
}

/**
 * Creates a new trail update
 */
export async function createTrailUpdate(prevState: any, formData: FormData) {
  try {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { error: 'You must be logged in to create updates', success: false };
    }

    const update = {
      miles_hiked: parseFloat(formData.get('milesHiked') as string) || null,
      current_mile: parseFloat(formData.get('currentMile') as string) || null,
      location_name: formData.get('locationName') as string,
      location_lat: parseFloat(formData.get('locationLat') as string) || null,
      location_lon: parseFloat(formData.get('locationLon') as string) || null,
      note: formData.get('note') as string,
      photo_url: formData.get('photoUrl') as string || null,
      visibility: formData.get('visibility') as string || 'public',
      author_id: user.id,
    };

    const { error } = await supabase
      .from('trail_updates')
      .insert([update]);

    if (error) {
      return { error: error.message, success: false };
    }

    revalidatePath('/dashboard');
    return { error: null, success: true };
  } catch (err) {
    return { error: 'Failed to create trail update', success: false };
  }
}

/**
 * Quick update for trail stats (used by quick action buttons)
 */
export async function updateQuickStat(prevState: any, formData: FormData) {
  try {
    const supabase = await createClient();

    const milesDone = parseInt(formData.get('milesDone') as string) || 0;

    const { error } = await supabase
      .from('site_config')
      .update({
        miles_done: milesDone,
        last_checkin: 'just now',
        updated_at: new Date().toISOString(),
      })
      .eq('id', (await supabase.from('site_config').select('id').single()).data?.id);

    if (error) {
      return { error: error.message, success: false };
    }

    revalidatePath('/', 'layout');
    return { error: null, success: true };
  } catch (err) {
    return { error: 'Failed to update stats', success: false };
  }
}
