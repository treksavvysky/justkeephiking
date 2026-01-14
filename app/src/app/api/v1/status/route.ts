/**
 * GET /api/v1/status
 *
 * Returns current trail status, location, and live stats.
 * This is the primary endpoint for "Where is George now?" queries from GPTs.
 *
 * Auth: Public (no API key required)
 */

import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  const startTime = Date.now();

  try {
    // Fetch current site config
    const { data: config, error } = await supabase
      .from('site_config')
      .select('*')
      .order('updated_at', { ascending: false })
      .limit(1)
      .single();

    if (error || !config) {
      return NextResponse.json(
        {
          status: 'error',
          error: {
            code: 'CONFIG_NOT_FOUND',
            message: 'Site configuration not found',
            details: error?.message || 'No config data available',
          },
        },
        { status: 404 }
      );
    }

    // Calculate statistics
    const milesDone = config.miles_done || 0;
    const milesTotal = config.miles_total || 2650;
    const percentComplete = ((milesDone / milesTotal) * 100).toFixed(1);
    const milesRemaining = milesTotal - milesDone;

    // Calculate days on trail if in trail mode
    let daysOnTrail = 0;
    let averageMilesPerDay = 0;
    if (config.mode === 'start' && config.start_date_iso) {
      const startDate = new Date(config.start_date_iso);
      const now = new Date();
      daysOnTrail = Math.floor((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
      if (daysOnTrail > 0) {
        averageMilesPerDay = parseFloat((milesDone / daysOnTrail).toFixed(1));
      }
    }

    // Build AI-friendly context string
    let context = '';
    if (config.mode === 'permit') {
      context = `George is in the permit phase, planning for a 2026 PCT NOBO thru-hike. `;
      if (config.my_permit_slot_utc) {
        const slotDate = new Date(config.my_permit_slot_utc);
        context += `His permit slot opens on ${slotDate.toLocaleDateString()}. `;
      }
    } else if (config.mode === 'start') {
      context = `George is currently hiking the Pacific Crest Trail northbound (NOBO), `;
      context += `having completed ${percentComplete}% of the trail (${milesDone.toFixed(1)} miles out of ${milesTotal}). `;
      if (config.section_now) {
        context += `He is currently in the ${config.section_now} section. `;
      }
      if (config.last_checkin) {
        context += `Last check-in was ${config.last_checkin}. `;
      }
      if (config.status_blurb) {
        context += config.status_blurb;
      }
    }

    // Response format optimized for AI consumption
    const response = {
      status: 'success',
      data: {
        mode: config.mode,
        status: {
          state: config.status_state || 'Unknown',
          area: config.status_area || 'Unknown',
          blurb: config.status_blurb || 'No recent update',
          next: config.status_next || 'TBD',
        },
        location: {
          currentMile: milesDone,
          totalMiles: milesTotal,
          percentComplete: parseFloat(percentComplete),
          section: config.section_now || 'Unknown',
          lastCheckin: config.last_checkin || 'Unknown',
          nextTown: config.next_town || 'Unknown',
        },
        stats: {
          milesDone,
          milesRemaining,
          ...(config.mode === 'start' && {
            startDate: config.start_date_iso,
            daysOnTrail,
            averageMilesPerDay,
          }),
        },
        updatedAt: config.updated_at,
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
