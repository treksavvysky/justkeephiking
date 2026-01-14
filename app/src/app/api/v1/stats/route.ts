/**
 * GET /api/v1/stats
 *
 * Returns aggregated trail statistics (totals, averages, records).
 * Combines data from site_config and trail_updates for comprehensive stats.
 *
 * Auth: Public (no API key required)
 */

import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  const startTime = Date.now();

  try {
    // Fetch site config for overall stats
    const { data: config, error: configError } = await supabase
      .from('site_config')
      .select('*')
      .order('updated_at', { ascending: false })
      .limit(1)
      .single();

    if (configError || !config) {
      return NextResponse.json(
        {
          status: 'error',
          error: {
            code: 'CONFIG_NOT_FOUND',
            message: 'Site configuration not found',
            details: configError?.message || 'No config data available',
          },
        },
        { status: 404 }
      );
    }

    // Fetch trail updates for detailed statistics
    const { data: updates, error: updatesError } = await supabase
      .from('trail_updates')
      .select('*')
      .order('created_at', { ascending: false });

    if (updatesError) {
      return NextResponse.json(
        {
          status: 'error',
          error: {
            code: 'DATABASE_ERROR',
            message: 'Failed to fetch trail updates',
            details: updatesError.message,
          },
        },
        { status: 500 }
      );
    }

    // Calculate statistics
    const milesDone = config.miles_done || 0;
    const milesTotal = config.miles_total || 2650;
    const milesRemaining = milesTotal - milesDone;

    // Calculate days on trail
    let daysOnTrail = 0;
    let zeroDays = 0;
    let resupplyStops = 0;
    let averageMilesPerDay = 0;
    let averageMilesPerDayExcludingZeros = 0;
    let projectedFinishDate: string | null = null;
    let daysRemaining = 0;

    if (config.mode === 'start' && config.start_date_iso) {
      const startDate = new Date(config.start_date_iso);
      const now = new Date();
      daysOnTrail = Math.floor((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

      // Count zero days (days with no trail update or update with 0 miles)
      const updateDates = new Set(
        (updates || [])
          .filter((u) => (u.miles_hiked || 0) > 0)
          .map((u) => new Date(u.created_at).toDateString())
      );

      // Count days from start to now
      for (let i = 0; i <= daysOnTrail; i++) {
        const checkDate = new Date(startDate);
        checkDate.setDate(checkDate.getDate() + i);
        if (!updateDates.has(checkDate.toDateString())) {
          zeroDays++;
        }
      }

      // Estimate resupply stops (rough estimate: every ~150 miles)
      resupplyStops = Math.floor(milesDone / 150);

      // Calculate averages
      if (daysOnTrail > 0) {
        averageMilesPerDay = parseFloat((milesDone / daysOnTrail).toFixed(1));
        const hikingDays = daysOnTrail - zeroDays;
        if (hikingDays > 0) {
          averageMilesPerDayExcludingZeros = parseFloat((milesDone / hikingDays).toFixed(1));
        }
      }

      // Project finish date
      if (averageMilesPerDay > 0) {
        daysRemaining = Math.ceil(milesRemaining / averageMilesPerDay);
        const finishDate = new Date(now);
        finishDate.setDate(finishDate.getDate() + daysRemaining);
        projectedFinishDate = finishDate.toISOString();
      }
    }

    // Find records
    let longestDayMiles = 0;
    let longestDayDate: string | null = null;
    let longestDaySection: string | null = null;

    if (updates && updates.length > 0) {
      // Group updates by date and sum miles
      const dailyMiles = new Map<string, { miles: number; section: string }>();
      updates.forEach((update) => {
        const dateKey = new Date(update.created_at).toDateString();
        const miles = update.miles_hiked || 0;
        if (dailyMiles.has(dateKey)) {
          const existing = dailyMiles.get(dateKey)!;
          dailyMiles.set(dateKey, {
            miles: existing.miles + miles,
            section: update.location_name || existing.section,
          });
        } else {
          dailyMiles.set(dateKey, { miles, section: update.location_name || 'Unknown' });
        }
      });

      // Find longest day
      dailyMiles.forEach((data, date) => {
        if (data.miles > longestDayMiles) {
          longestDayMiles = data.miles;
          longestDayDate = date;
          longestDaySection = data.section;
        }
      });
    }

    // Build AI-friendly context
    let context = '';
    if (config.mode === 'start') {
      context = `George is averaging ${averageMilesPerDay} miles per day `;
      if (projectedFinishDate) {
        const finishDate = new Date(projectedFinishDate);
        context += `and is on pace to finish around ${finishDate.toLocaleDateString()}. `;
      }
      if (longestDayMiles > 0) {
        context += `His longest day so far was ${longestDayMiles.toFixed(1)} miles. `;
      }
      context += `He has completed ${((milesDone / milesTotal) * 100).toFixed(1)}% of the trail.`;
    } else {
      context = `George is in the permit phase, preparing for a ${milesTotal}-mile thru-hike.`;
    }

    const response = {
      status: 'success',
      data: {
        totals: {
          milesDone,
          milesRemaining,
          ...(config.mode === 'start' && {
            daysOnTrail,
            zeroDays,
            resupplyStops,
          }),
        },
        averages: {
          milesPerDay: averageMilesPerDay,
          ...(averageMilesPerDayExcludingZeros > 0 && {
            milesPerDayExcludingZeros: averageMilesPerDayExcludingZeros,
          }),
        },
        ...(longestDayMiles > 0 && {
          records: {
            longestDay: {
              miles: parseFloat(longestDayMiles.toFixed(1)),
              date: longestDayDate,
              section: longestDaySection,
            },
          },
        }),
        ...(config.mode === 'start' &&
          projectedFinishDate && {
            pace: {
              projectedFinishDate,
              daysRemaining,
              onPaceFor: `${Math.ceil((milesTotal / averageMilesPerDay) / 30)}-month finish`,
            },
          }),
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
