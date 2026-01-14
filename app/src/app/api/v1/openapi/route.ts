/**
 * GET /api/v1/openapi
 *
 * Serves the OpenAPI specification for the API.
 * Used by custom GPTs and API documentation tools.
 *
 * Auth: Public
 */

import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    // Read the OpenAPI spec from public directory
    const specPath = path.join(process.cwd(), 'public', 'openapi.json');
    const spec = JSON.parse(fs.readFileSync(specPath, 'utf-8'));

    return NextResponse.json(spec, {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*', // Allow CORS for API documentation tools
      },
    });
  } catch (err) {
    return NextResponse.json(
      {
        status: 'error',
        error: {
          code: 'SPEC_NOT_FOUND',
          message: 'OpenAPI specification not found',
          details: err instanceof Error ? err.message : 'Unknown error',
        },
      },
      { status: 500 }
    );
  }
}
