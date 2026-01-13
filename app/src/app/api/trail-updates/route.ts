import { NextRequest, NextResponse } from 'next/server';
import { supabase, supabaseAdmin } from '@/lib/supabase';

/**
 * GET /api/trail-updates
 * Returns trail updates (micro-posts)
 * Filters based on visibility and authentication (to be implemented)
 *
 * Query params:
 * - limit: number of updates to return (default 20)
 * - offset: pagination offset (default 0)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    // TODO: Add authentication check to determine visibility level
    // For MVP, only return public updates
    const { data, error, count } = await supabase
      .from('trail_updates')
      .select('*', { count: 'exact' })
      .eq('visibility', 'public')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch trail updates', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      data,
      count,
      limit,
      offset,
    });
  } catch (err) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/trail-updates
 * Creates a new trail update
 * Protected endpoint - requires admin auth (to be implemented)
 *
 * Body:
 * - milesHiked: number (optional)
 * - currentMile: number (optional)
 * - locationName: string (required)
 * - locationLat: number (optional)
 * - locationLon: number (optional)
 * - note: string (optional)
 * - photoUrl: string (optional)
 * - visibility: 'public' | 'friends' | 'sponsors' (default 'public')
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // TODO: Add authentication check here
    // const authHeader = request.headers.get('authorization');
    // Verify JWT and get user ID

    // Validate required fields
    if (!body.locationName) {
      return NextResponse.json(
        { error: 'locationName is required' },
        { status: 400 }
      );
    }

    // Create the trail update
    const { data, error } = await supabaseAdmin
      .from('trail_updates')
      .insert({
        miles_hiked: body.milesHiked || null,
        current_mile: body.currentMile || null,
        location_name: body.locationName,
        location_lat: body.locationLat || null,
        location_lon: body.locationLon || null,
        note: body.note || null,
        photo_url: body.photoUrl || null,
        visibility: body.visibility || 'public',
        // author_id: userId, // TODO: Set from authenticated user
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: 'Failed to create trail update', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
