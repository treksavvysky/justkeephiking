/**
 * GET /api/v1/updates
 *
 * Returns trail updates (micro-posts) with pagination.
 * Public endpoint returns only public updates.
 * With API key, can access friends/sponsors updates based on key scope.
 *
 * Query params:
 * - limit (default: 20, max: 100)
 * - offset (default: 0)
 * - visibility (default: public, requires API key for friends/sponsors)
 *
 * Auth: Optional (API key for non-public visibility)
 */

import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { validateApiKey } from '@/lib/api/auth';

export async function GET(request: NextRequest) {
  const startTime = Date.now();

  try {
    const { searchParams } = new URL(request.url);

    // Parse query parameters
    const limitParam = searchParams.get('limit');
    const offsetParam = searchParams.get('offset');
    const visibilityParam = searchParams.get('visibility') || 'public';

    const limit = Math.min(parseInt(limitParam || '20'), 100);
    const offset = parseInt(offsetParam || '0');

    // Validate visibility parameter
    const validVisibilities = ['public', 'friends', 'sponsors'];
    if (!validVisibilities.includes(visibilityParam)) {
      return NextResponse.json(
        {
          status: 'error',
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid visibility parameter',
            details: `Visibility must be one of: ${validVisibilities.join(', ')}`,
          },
        },
        { status: 400 }
      );
    }

    // Check authentication for non-public visibility
    if (visibilityParam !== 'public') {
      const authHeader = request.headers.get('authorization');
      const authResult = await validateApiKey(authHeader);

      if (!authResult.success) {
        return NextResponse.json(
          {
            status: 'error',
            error: {
              code: 'INVALID_API_KEY',
              message: authResult.error || 'Authentication required for non-public content',
              details: 'Provide a valid API key in Authorization header to access friends/sponsors content',
            },
          },
          { status: 401 }
        );
      }

      // TODO: Check if API key scope allows access to requested visibility tier
      // For now, any valid API key can access friends/sponsors content
    }

    // Fetch trail updates
    let query = supabase
      .from('trail_updates')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    // Filter by visibility
    if (visibilityParam === 'public') {
      query = query.eq('visibility', 'public');
    } else if (visibilityParam === 'friends') {
      query = query.in('visibility', ['public', 'friends']);
    } else if (visibilityParam === 'sponsors') {
      query = query.in('visibility', ['public', 'friends', 'sponsors']);
    }

    const { data, error, count } = await query;

    if (error) {
      return NextResponse.json(
        {
          status: 'error',
          error: {
            code: 'DATABASE_ERROR',
            message: 'Failed to fetch trail updates',
            details: error.message,
          },
        },
        { status: 500 }
      );
    }

    // Transform data for AI-friendly format
    const updates = (data || []).map((update) => ({
      id: update.id,
      createdAt: update.created_at,
      milesHiked: update.miles_hiked,
      currentMile: update.current_mile,
      location: {
        name: update.location_name,
        lat: update.location_lat,
        lon: update.location_lon,
      },
      note: update.note,
      photoUrl: update.photo_url,
      visibility: update.visibility,
    }));

    // Build AI-friendly context
    let context = '';
    if (updates.length > 0) {
      const mostRecent = updates[0];
      const timeAgo = getTimeAgo(new Date(mostRecent.createdAt));
      context = `These are George's recent trail updates, posted from the trail. `;
      context += `The most recent update was ${timeAgo} from ${mostRecent.location.name}. `;
      if (mostRecent.note) {
        context += `Latest note: "${mostRecent.note}"`;
      }
    } else {
      context = 'No trail updates available yet.';
    }

    const response = {
      status: 'success',
      data: updates,
      pagination: {
        limit,
        offset,
        total: count || 0,
        hasMore: (count || 0) > offset + limit,
      },
      context,
      _meta: {
        responseTime: Date.now() - startTime,
        timestamp: new Date().toISOString(),
      },
    };

    return NextResponse.json(response);
  } catch (err) {
    return NextResponse.json(
      {
        status: 'error',
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Internal server error',
          details: err instanceof Error ? err.message : 'Unknown error',
        },
      },
      { status: 500 }
    );
  }
}

/**
 * Helper function to calculate human-readable time ago
 */
function getTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) > 1 ? 's' : ''} ago`;
  return date.toLocaleDateString();
}
