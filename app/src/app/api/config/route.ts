import { NextRequest, NextResponse } from 'next/server';
import { supabase, supabaseAdmin } from '@/lib/supabase';

/**
 * GET /api/config
 * Returns the current site configuration
 * Public endpoint - no auth required
 */
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('site_config')
      .select('*')
      .order('updated_at', { ascending: false })
      .limit(1)
      .single();

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch config', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/config
 * Updates the site configuration
 * Protected endpoint - requires admin auth (to be implemented)
 *
 * For MVP, this is unprotected. Add auth headers when ready:
 * - Check Authorization header for JWT
 * - Verify user role is 'admin' in profiles table
 */
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();

    // TODO: Add authentication check here
    // const authHeader = request.headers.get('authorization');
    // Verify JWT and check user role === 'admin'

    // Validate required fields
    const { mode } = body;
    if (!mode || (mode !== 'permit' && mode !== 'start')) {
      return NextResponse.json(
        { error: 'Invalid mode. Must be "permit" or "start"' },
        { status: 400 }
      );
    }

    // Get the current config ID (we always update the first/only row)
    const { data: currentConfig } = await supabaseAdmin
      .from('site_config')
      .select('id')
      .limit(1)
      .single();

    if (!currentConfig) {
      return NextResponse.json(
        { error: 'No config found. Run database migration first.' },
        { status: 404 }
      );
    }

    // Update the config
    const { data, error } = await supabaseAdmin
      .from('site_config')
      .update({
        mode: body.mode,
        permit_release_utc: body.permitReleaseUTC || null,
        my_permit_slot_utc: body.myPermitSlotUTC || null,
        start_date_iso: body.startDateISO || null,
        miles_done: body.milesDone || 0,
        section_now: body.sectionNow || null,
        last_checkin: body.lastCheckin || null,
        next_town: body.nextTown || null,
        status_state: body.statusState || null,
        status_area: body.statusArea || null,
        status_blurb: body.statusBlurb || null,
        status_next: body.statusNext || null,
      })
      .eq('id', currentConfig.id)
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: 'Failed to update config', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
