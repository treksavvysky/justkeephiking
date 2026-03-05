import { describe, expect, it, vi } from 'vitest';

const { createAdminClientMock } = vi.hoisted(() => ({
  createAdminClientMock: vi.fn(),
}));

vi.mock('@/lib/supabase/server', () => ({
  createAdminClient: createAdminClientMock,
}));

import { GET } from './route';

describe('GET /api/v1/stats', () => {
  it('filters trail updates to public visibility', async () => {
    const siteConfigChain: any = {};
    siteConfigChain.select = vi.fn(() => siteConfigChain);
    siteConfigChain.order = vi.fn(() => siteConfigChain);
    siteConfigChain.limit = vi.fn(() => siteConfigChain);
    siteConfigChain.single = vi.fn().mockResolvedValue({
      data: {
        mode: 'permit',
        miles_done: 0,
        miles_total: 2650,
        updated_at: '2026-03-01T00:00:00.000Z',
      },
      error: null,
    });

    const updatesChain: any = {};
    updatesChain.select = vi.fn(() => updatesChain);
    updatesChain.eq = vi.fn(() => updatesChain);
    updatesChain.order = vi.fn().mockResolvedValue({
      data: [],
      error: null,
    });

    const from = vi.fn((table: string) => {
      if (table === 'site_config') return siteConfigChain;
      if (table === 'trail_updates') return updatesChain;
      throw new Error(`Unexpected table: ${table}`);
    });

    createAdminClientMock.mockReturnValue({ from });

    const response = await GET();
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(updatesChain.eq).toHaveBeenCalledWith('visibility', 'public');
    expect(body.status).toBe('success');
  });
});
