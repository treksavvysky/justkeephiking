# API Subdomain Setup Guide

This guide explains how to configure api.justkeephiking.com as a subdomain for the backend API, enabling custom GPT access.

## Overview

The API is designed to be accessible via both:
- `https://justkeephiking.com/api/v1/*` (main domain)
- `https://api.justkeephiking.com/v1/*` (subdomain - preferred for AI/GPT access)

## DNS Configuration

### Option 1: CNAME Record (Recommended)

Add a CNAME record in your DNS provider:

```
Type: CNAME
Name: api
Value: justkeephiking.com
TTL: Auto (or 3600)
```

This will route `api.justkeephiking.com` to the same server as `justkeephiking.com`.

### Option 2: A Record

If your hosting provider doesn't support CNAME for subdomains:

```
Type: A
Name: api
Value: <your VPS IP address>
TTL: Auto (or 3600)
```

## Deployment Configuration

### Docker + Dokploy Setup

Your current Docker setup should already support subdomain routing. Just add the subdomain to your Dokploy project:

1. Go to Dokploy dashboard
2. Select your justkeephiking project
3. Go to "Domains" tab
4. Add new domain: `api.justkeephiking.com`
5. Enable SSL/TLS (Let's Encrypt)
6. Save

Dokploy will automatically:
- Route api.justkeephiking.com to your Next.js container
- Generate SSL certificate via Let's Encrypt
- Configure Nginx reverse proxy

### Verify DNS Propagation

Check if DNS is working:

```bash
# Check DNS resolution
nslookup api.justkeephiking.com

# Test API endpoint (once deployed)
curl https://api.justkeephiking.com/v1/status
```

## Next.js Configuration (Already Done)

The API routes are already set up in `/src/app/api/v1/*` and will automatically work on both:
- `https://justkeephiking.com/api/v1/status`
- `https://api.justkeephiking.com/v1/status`

No additional Next.js configuration needed - subdomains are automatically routed to the same app.

## SSL Certificate

Let's Encrypt will automatically provision SSL certificates for both:
- `justkeephiking.com`
- `api.justkeephiking.com`

Dokploy handles this automatically when you add the domain.

## Testing the API Subdomain

### 1. Test Status Endpoint

```bash
curl https://api.justkeephiking.com/v1/status
```

Expected response:
```json
{
  "status": "success",
  "data": {
    "mode": "permit",
    "status": { ... },
    "location": { ... }
  },
  "context": "..."
}
```

### 2. Test OpenAPI Spec

```bash
curl https://api.justkeephiking.com/v1/openapi
```

Should return the OpenAPI JSON specification.

### 3. Test with API Key

```bash
# Replace with your actual API key
curl -H "Authorization: Bearer sk_live_..." \
  https://api.justkeephiking.com/v1/updates?visibility=friends
```

## Custom GPT Configuration

Once the subdomain is working, configure your custom GPT:

### In ChatGPT Custom GPT Settings:

1. **Name**: PCT Trail Tracker for justkeephiking.com
2. **Description**: Track George's Pacific Crest Trail thru-hike in real-time
3. **Instructions**:
   ```
   You are a trail assistant for George's 2026 PCT NOBO thru-hike. Use the justkeephiking.com API to answer questions about:

   1. Current location and status (GET /v1/status)
   2. Recent trail updates and photos (GET /v1/updates)
   3. Trail statistics and pace (GET /v1/stats)
   4. Gear list and weight (GET /v1/gear)

   When users ask "Where is George?", always fetch the latest status. Include relevant context from recent updates. Be encouraging and trail-enthusiast friendly.

   Always cite the source of information with the update date/time.
   ```

4. **Actions**:
   - Click "Create new action"
   - Import from URL: `https://api.justkeephiking.com/v1/openapi`
   - Authentication: Bearer token
   - Token: `sk_live_...` (your API key from dashboard)

5. **Conversation starters**:
   - "Where is George right now?"
   - "What were his last 5 trail updates?"
   - "How many miles has he hiked?"
   - "Show me his gear list"

## CORS Configuration (Optional)

If you want to enable browser-based API access (not needed for GPTs), add CORS headers.

Already configured in `/api/v1/openapi/route.ts`:
```typescript
headers: {
  'Access-Control-Allow-Origin': '*',
}
```

## Rate Limiting

API keys have rate limiting configured:
- **Public endpoints (no key)**: 60 requests/hour per IP
- **With API key**: 100 requests/minute
- **Admin key**: Unlimited

Rate limit headers are included in responses:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1625068800
```

## Monitoring API Usage

View API usage in the admin dashboard:

1. Go to `/dashboard/api-keys`
2. See "Last Used" timestamps for each key
3. View detailed usage analytics (coming soon)

## Troubleshooting

### "DNS not resolving"

- Wait 5-10 minutes for DNS propagation
- Clear local DNS cache: `sudo dscacheutil -flushcache` (macOS)
- Check DNS with: `dig api.justkeephiking.com`

### "SSL certificate error"

- Ensure domain is added to Dokploy
- Wait for Let's Encrypt certificate provisioning (5-10 minutes)
- Check certificate status in Dokploy dashboard

### "API returning 404"

- Verify Next.js is running: `docker ps`
- Check logs: `docker logs justkeephiking_app`
- Verify API routes exist in `/src/app/api/v1/`

### "Custom GPT can't access API"

- Verify API key is valid (not revoked)
- Check OpenAPI spec is accessible: `curl https://api.justkeephiking.com/v1/openapi`
- Ensure Bearer token format: `Bearer sk_live_...`
- Check API key scope (should be at least "read")

## Production Deployment Checklist

Before going live with custom GPT:

- [ ] DNS configured (CNAME or A record)
- [ ] Subdomain added to Dokploy
- [ ] SSL certificate provisioned
- [ ] API endpoints tested (status, updates, stats, gear)
- [ ] OpenAPI spec accessible
- [ ] API key created with "read" scope
- [ ] Custom GPT configured and tested
- [ ] Rate limiting working
- [ ] API usage logging enabled

## Next Steps

After subdomain is live:

1. **Create your first API key** in `/dashboard/api-keys`
2. **Configure custom GPT** with the API key
3. **Test the integration** by asking the GPT questions
4. **Share the custom GPT** (optional) with friends/family
5. **Monitor usage** via the dashboard

---

**Last Updated**: 2026-01-13
**Status**: Ready for deployment
**Deployment Time**: ~15 minutes (DNS + SSL provisioning)
