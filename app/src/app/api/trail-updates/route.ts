import { NextRequest, NextResponse } from 'next/server';
import { createClient, createAdminClient } from '@/lib/supabase/server';

/**
 * GET /api/trail-updates
 * Returns trail updates (micro-posts)
 * Public endpoint - returns only public updates
 *
 * Query params:
 * - limit: number of updates to return (default 20)
 * - offset: pagination offset (default 0)
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = createAdminClient();
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

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
 * Protected endpoint - requires authenticated user
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
    // Verify the user is authenticated
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Only admins can create trail updates
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profileError || !profile || profile.role !== 'admin') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    const body = await request.json();

    // Validate required fields
    if (!body.locationName) {
      return NextResponse.json(
        { error: 'locationName is required' },
        { status: 400 }
      );
    }

    const admin = createAdminClient();

    // Create the trail update
    const { data, error } = await admin
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
        author_id: user.id,
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
