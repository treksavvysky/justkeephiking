import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { createAdminClientMock, validateApiKeyMock } = vi.hoisted(() => ({
  createAdminClientMock: vi.fn(),
  validateApiKeyMock: vi.fn(),
}));

vi.mock('@/lib/supabase/server', () => ({
  createAdminClient: createAdminClientMock,
}));

vi.mock('@/lib/api/auth', () => ({
  validateApiKey: validateApiKeyMock,
}));

import { GET } from './route';

function setupUpdatesQuery(result: { data: any[]; error: any; count: number }) {
  const chain: any = {};
  chain.select = vi.fn(() => chain);
  chain.order = vi.fn(() => chain);
  chain.range = vi.fn(() => chain);
  chain.eq = vi.fn().mockResolvedValue(result);
  chain.in = vi.fn().mockResolvedValue(result);

  const from = vi.fn(() => chain);
  createAdminClientMock.mockReturnValue({ from });

  return { chain, from };
}

describe('GET /api/v1/updates', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 400 for invalid pagination params', async () => {
    const request = new NextRequest('http://localhost/api/v1/updates?limit=0');
    const response = await GET(request);
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.error.code).toBe('VALIDATION_ERROR');
    expect(createAdminClientMock).not.toHaveBeenCalled();
  });

  it('returns 401 for non-public visibility with invalid API key', async () => {
    validateApiKeyMock.mockResolvedValue({ success: false, error: 'Invalid API key' });

    const request = new NextRequest('http://localhost/api/v1/updates?visibility=friends');
    const response = await GET(request);
    const body = await response.json();

    expect(response.status).toBe(401);
    expect(body.error.code).toBe('INVALID_API_KEY');
    expect(validateApiKeyMock).toHaveBeenCalled();
  });

  it('queries friends visibility with a valid API key', async () => {
    validateApiKeyMock.mockResolvedValue({
      success: true,
      apiKey: {
        id: 'key-1',
        keyPrefix: 'sk_live_test',
        name: 'test',
        scope: 'read',
        rateLimit: 100,
        revoked: false,
        expiresAt: null,
      },
    });

    const { chain } = setupUpdatesQuery({ data: [], error: null, count: 0 });

    const request = new NextRequest('http://localhost/api/v1/updates?visibility=friends');
    const response = await GET(request);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(chain.in).toHaveBeenCalledWith('visibility', ['public', 'friends']);
    expect(body.status).toBe('success');
  });
});
