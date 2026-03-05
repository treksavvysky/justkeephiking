import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { createClientMock, createAdminClientMock } = vi.hoisted(() => ({
  createClientMock: vi.fn(),
  createAdminClientMock: vi.fn(),
}));

vi.mock('@/lib/supabase/server', () => ({
  createClient: createClientMock,
  createAdminClient: createAdminClientMock,
}));

import { GET, POST } from './route';

describe('Trail updates route', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 400 for invalid pagination params', async () => {
    const request = new NextRequest('http://localhost/api/trail-updates?offset=-5');
    const response = await GET(request);
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.error).toBe('Invalid pagination parameters');
    expect(createAdminClientMock).toHaveBeenCalledTimes(1);
  });

  it('returns 403 for authenticated non-admin users on POST', async () => {
    const profileSingle = vi.fn().mockResolvedValue({
      data: { role: 'public' },
      error: null,
    });

    const profileEq = vi.fn(() => ({ single: profileSingle }));
    const profileSelect = vi.fn(() => ({ eq: profileEq }));
    const from = vi.fn(() => ({ select: profileSelect }));

    createClientMock.mockResolvedValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: { user: { id: 'user-1' } },
        }),
      },
      from,
    });

    const request = new NextRequest('http://localhost/api/trail-updates', {
      method: 'POST',
      body: JSON.stringify({ locationName: 'Test Location' }),
      headers: { 'content-type': 'application/json' },
    });

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(403);
    expect(body.error).toBe('Admin access required');
    expect(createAdminClientMock).not.toHaveBeenCalled();
  });
});
