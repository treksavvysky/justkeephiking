/**
 * GET /api/v1/gear
 *
 * Returns the gear list with weights and categories.
 * Public endpoint - gear list is always public for community reference.
 *
 * Query params:
 * - category (optional) - Filter by category
 *
 * Auth: Public (no API key required)
 */

import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  const startTime = Date.now();

  try {
    const { searchParams } = new URL(request.url);
    const categoryFilter = searchParams.get('category');

    // Fetch gear items
    let query = supabase
      .from('gear_items')
      .select('*')
      .order('category', { ascending: true })
      .order('name', { ascending: true });

    if (categoryFilter) {
      query = query.eq('category', categoryFilter);
    }

    const { data: items, error } = await query;

    if (error) {
      return NextResponse.json(
        {
          status: 'error',
          error: {
            code: 'DATABASE_ERROR',
            message: 'Failed to fetch gear items',
            details: error.message,
          },
        },
        { status: 500 }
      );
    }

    // Calculate total weights
    let baseWeightOz = 0;
    let wornWeightOz = 0;
    let consumableWeightOz = 0;

    (items || []).forEach((item) => {
      const weight = (item.weight_grams || 0) * 0.03527396; // Convert grams to oz
      const totalWeight = weight * (item.quantity || 1);

      if (item.is_consumable) {
        consumableWeightOz += totalWeight;
      } else if (item.is_worn) {
        wornWeightOz += totalWeight;
      } else {
        baseWeightOz += totalWeight;
      }
    });

    // Convert to pounds
    const baseWeightLbs = (baseWeightOz / 16).toFixed(1);
    const wornWeightLbs = (wornWeightOz / 16).toFixed(1);
    const consumableWeightLbs = (consumableWeightOz / 16).toFixed(1);
    const totalWeightLbs = ((baseWeightOz + wornWeightOz + consumableWeightOz) / 16).toFixed(1);

    // Get unique categories
    const categorySet = new Set((items || []).map((item) => item.category));
    const categories = Array.from(categorySet).sort();

    // Transform items for API response
    const gearItems = (items || []).map((item) => ({
      id: item.id,
      name: item.name,
      category: item.category,
      weightOz: item.weight_grams ? Math.round(item.weight_grams * 0.03527396) : null,
      weightGrams: item.weight_grams,
      quantity: item.quantity,
      worn: item.is_worn,
      consumable: item.is_consumable,
      notes: item.notes,
      url: item.url,
    }));

    // Build AI-friendly context
    const itemCount = gearItems.length;
    const categoryCount = categories.length;
    const context =
      `George's base weight is ${baseWeightLbs} lbs, with a total pack weight around ${totalWeightLbs} lbs including food and water. ` +
      `The gear list includes ${itemCount} items across ${categoryCount} categories. ` +
      `This is a typical ultralight backpacking setup for long-distance hiking.`;

    const response = {
      status: 'success',
      data: {
        totalWeight: {
          base: parseFloat(baseWeightLbs),
          worn: parseFloat(wornWeightLbs),
          consumable: parseFloat(consumableWeightLbs),
          total: parseFloat(totalWeightLbs),
          unit: 'lbs',
        },
        items: gearItems,
        categories,
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
