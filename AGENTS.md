# AI Agent Integration Guide

**Last Updated**: 2026-01-13
**Status**: Ready for deployment
**API Version**: v1

---

## Overview

This guide explains how to integrate AI agents (custom GPTs, Claude Projects, and other AI assistants) with justkeephiking.com to access real-time trail data for George's 2026 Pacific Crest Trail thru-hike.

### What AI Agents Can Do

- **Track current location**: "Where is George right now?"
- **Get trail updates**: "What were his last 5 trail updates?"
- **Check statistics**: "How many miles has he hiked? What's his average pace?"
- **View gear list**: "Show me his gear list and base weight"
- **Answer questions**: "When did he cross Forester Pass?" or "How far is he from Canada?"

### API Endpoint

```
https://api.justkeephiking.com/v1/
```

**Alternative**: `https://justkeephiking.com/api/v1/`

---

## Quick Start

### For Custom GPTs (ChatGPT)

1. **Create API Key**:
   - Go to https://justkeephiking.com/dashboard/api-keys
   - Click "+ Create New API Key"
   - Name: "ChatGPT Custom GPT"
   - Scope: "Read"
   - Copy the key (sk_live_...)

2. **Configure Custom GPT**:
   - Go to ChatGPT → Explore GPTs → Create
   - Name: "PCT Trail Tracker for justkeephiking.com"
   - Description: "Track George's Pacific Crest Trail thru-hike in real-time"
   - Instructions: (see below)
   - Actions → Import from URL: `https://api.justkeephiking.com/v1/openapi`
   - Authentication: Bearer token
   - Token: Paste your API key

3. **Test**:
   - Ask: "Where is George right now?"
   - Expected: GPT calls GET /v1/status and responds with current location

### For Claude Projects

1. **Create API Key**: (same as above)

2. **Add to Project Knowledge**:
   ```
   API Base URL: https://api.justkeephiking.com/v1
   Authentication: Bearer sk_live_[your_key_here]

   Available Endpoints:
   - GET /status - Current trail status
   - GET /updates?limit=N - Recent trail updates
   - GET /stats - Trail statistics
   - GET /gear - Gear list
   ```

3. **Project Instructions**:
   ```
   You have access to real-time data about George's PCT thru-hike via the justkeephiking.com API.

   When users ask about George's location, progress, or trail updates, fetch the latest data from the API.
   Always cite the timestamp of the data you're referencing.
   ```

### For Other AI Assistants

**Supported Formats**:
- OpenAPI 3.0 specification: `https://api.justkeephiking.com/v1/openapi`
- Manual integration: See "API Endpoints" section below

---

## Custom GPT Configuration

### Complete GPT Instructions

Use these instructions when configuring your custom GPT:

```
You are a trail assistant for George's 2026 Pacific Crest Trail NOBO (northbound) thru-hike.
Your primary function is to provide real-time information about his progress, location, and
trail experiences using the justkeephiking.com API.

## Your Capabilities

1. **Current Status** (GET /v1/status)
   - Current location and mile marker
   - Days on trail and average pace
   - Current section (e.g., "Sierra Nevada")
   - Live status updates (blurb, next milestone)

2. **Trail Updates** (GET /v1/updates)
   - Recent trail updates with photos and notes
   - Location-specific updates
   - Daily mileage and progress

3. **Statistics** (GET /v1/stats)
   - Total miles hiked and remaining
   - Average miles per day
   - Longest day record
   - Projected finish date

4. **Gear List** (GET /v1/gear)
   - Complete gear list with weights
   - Base weight and total pack weight
   - Gear categories and items

## Response Guidelines

1. **Always fetch fresh data**: Don't rely on cached information for "current" questions
2. **Cite timestamps**: Always mention when the data was last updated
3. **Be encouraging**: Use trail-enthusiast friendly language
4. **Provide context**: Explain PCT terms (NOBO, resupply, zero day, etc.) if relevant
5. **Include details**: When showing updates, include photos, notes, and location context

## Example Interactions

User: "Where is George right now?"
→ Call GET /v1/status
→ Response: "As of 2 hours ago, George is at mile 789.5 in the Sierra Nevada section,
   having hiked 14.2 miles today. He's currently crossing Forester Pass (13,153 ft),
   the highest point on the PCT. Next milestone: Resupply in Bishop in 3 days."

User: "What were his last 3 trail updates?"
→ Call GET /v1/updates?limit=3
→ Response: [Summarize each update with location, miles, note, and photo if available]

User: "How's his pace?"
→ Call GET /v1/stats
→ Response: "George is averaging 17.5 miles per day over 45 days on trail. At this pace,
   he's projected to finish around September 15, 2026. His longest day so far was 28.3 miles."

## Important Notes

- The PCT is 2,650 miles from Mexico to Canada
- NOBO = Northbound (Mexico → Canada)
- Zero day = Rest day with no hiking
- Resupply = Stopping in town to restock food/supplies
- Trail magic = Unexpected acts of kindness from strangers

Always be supportive and celebrate milestones!
```

### Conversation Starters

Add these to your custom GPT:

```
- "Where is George right now?"
- "What were his last 5 trail updates?"
- "How many miles has he hiked so far?"
- "Show me his gear list and base weight"
- "What's his average pace?"
- "When is he projected to finish?"
```

---

## API Endpoints

### Authentication

All API requests (except public endpoints) require a Bearer token:

```bash
Authorization: Bearer sk_live_[your_api_key]
```

**Public Endpoints** (no auth required):
- GET /v1/status
- GET /v1/updates (public updates only)
- GET /v1/stats
- GET /v1/gear

**Protected Endpoints** (API key required):
- GET /v1/updates?visibility=friends
- GET /v1/updates?visibility=sponsors

---

### GET /v1/status

Returns current trail status, location, and live stats.

**Request**:
```bash
curl https://api.justkeephiking.com/v1/status
```

**Response**:
```json
{
  "status": "success",
  "data": {
    "mode": "start",
    "status": {
      "state": "On Trail",
      "area": "Sierra Nevada",
      "blurb": "Crossing Forester Pass today!",
      "next": "Resupply in Bishop (3 days)"
    },
    "location": {
      "currentMile": 789.5,
      "totalMiles": 2650,
      "percentComplete": 29.8,
      "section": "Sierra Nevada",
      "lastCheckin": "2 hours ago",
      "nextTown": "Bishop"
    },
    "stats": {
      "milesDone": 789.5,
      "milesRemaining": 1860.5,
      "startDate": "2026-05-11T07:00:00-07:00",
      "daysOnTrail": 45,
      "averageMilesPerDay": 17.5
    },
    "updatedAt": "2026-06-25T14:30:00Z"
  },
  "context": "George is currently hiking through the Sierra Nevada, having completed 30% of the PCT. He last checked in 2 hours ago near mile 789.5."
}
```

**Context Field**: Plain-English summary perfect for LLMs to include in responses.

---

### GET /v1/updates

Returns trail updates (micro-posts) with pagination.

**Request**:
```bash
curl "https://api.justkeephiking.com/v1/updates?limit=5&offset=0"
```

**Query Parameters**:
- `limit` (default: 20, max: 100) - Number of updates to return
- `offset` (default: 0) - Pagination offset
- `visibility` (default: public) - Filter by visibility (requires API key for friends/sponsors)

**Response**:
```json
{
  "status": "success",
  "data": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "createdAt": "2026-06-25T12:00:00Z",
      "milesHiked": 14.2,
      "currentMile": 789.5,
      "location": {
        "name": "Forester Pass",
        "lat": 36.8945,
        "lon": -118.2985
      },
      "note": "Highest point on the PCT! Views are incredible.",
      "photoUrl": "https://uoopfkziigqnyssdwenz.supabase.co/storage/v1/object/public/photos/forester-pass.jpg",
      "visibility": "public"
    }
  ],
  "pagination": {
    "limit": 5,
    "offset": 0,
    "total": 45,
    "hasMore": true
  },
  "context": "These are George's recent trail updates, posted from the trail. The most recent update was 2 hours ago from Forester Pass."
}
```

---

### GET /v1/stats

Returns aggregated trail statistics.

**Request**:
```bash
curl https://api.justkeephiking.com/v1/stats
```

**Response**:
```json
{
  "status": "success",
  "data": {
    "totals": {
      "milesDone": 789.5,
      "milesRemaining": 1860.5,
      "daysOnTrail": 45,
      "zeroDays": 3,
      "resupplyStops": 8
    },
    "averages": {
      "milesPerDay": 17.5,
      "milesPerDayExcludingZeros": 18.8
    },
    "records": {
      "longestDay": {
        "miles": 28.3,
        "date": "2026-06-10",
        "section": "Southern California"
      },
      "highestElevation": {
        "feet": 13153,
        "location": "Forester Pass",
        "date": "2026-06-25"
      }
    },
    "pace": {
      "projectedFinishDate": "2026-09-15",
      "daysRemaining": 82,
      "onPaceFor": "4-month finish"
    }
  },
  "context": "George is averaging 17.5 miles per day and is on pace to finish around September 15, 2026."
}
```

---

### GET /v1/gear

Returns the gear list with weights and categories.

**Request**:
```bash
curl https://api.justkeephiking.com/v1/gear
```

**Query Parameters**:
- `category` (optional) - Filter by category (shelter, sleep, clothing, etc.)

**Response**:
```json
{
  "status": "success",
  "data": {
    "totalWeight": {
      "base": 8.5,
      "worn": 2.1,
      "consumable": 3.2,
      "total": 13.8,
      "unit": "lbs"
    },
    "items": [
      {
        "id": "abc123",
        "name": "Zpacks Duplex Tent",
        "category": "shelter",
        "weightOz": 19,
        "weightGrams": 538,
        "quantity": 1,
        "worn": false,
        "consumable": false,
        "notes": "Freestanding with trekking poles",
        "url": "https://zpacks.com/products/duplex-tent"
      }
    ],
    "categories": ["shelter", "sleep", "clothing", "cooking", "electronics", "misc"]
  },
  "context": "George's base weight is 8.5 lbs, with a total pack weight around 13.8 lbs including food and water. The gear list includes 45 items across 6 categories. This is a typical ultralight backpacking setup for long-distance hiking."
}
```

---

## Error Handling

All errors follow this format:

```json
{
  "status": "error",
  "error": {
    "code": "RESOURCE_NOT_FOUND",
    "message": "Resource not found",
    "details": "Additional error details"
  }
}
```

### Common Error Codes

| Code | HTTP Status | Meaning |
|------|-------------|---------|
| `INVALID_API_KEY` | 401 | API key is invalid or expired |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many requests (100/min limit) |
| `RESOURCE_NOT_FOUND` | 404 | Requested resource doesn't exist |
| `VALIDATION_ERROR` | 400 | Request parameters are invalid |
| `INTERNAL_ERROR` | 500 | Server error |

---

## Rate Limiting

### Current Limits

- **Public endpoints (no key)**: 60 requests/hour per IP
- **With API key (read scope)**: 100 requests/minute
- **Admin key**: Unlimited

### Rate Limit Headers (Coming Soon)

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1625068800
```

---

## Best Practices

### 1. Cache Intelligently

Don't fetch the same data repeatedly within a short time window:

```
✅ Good: Cache /v1/status for 5-10 minutes
❌ Bad: Call /v1/status on every user message
```

### 2. Use the Context Field

Every API response includes a `context` field with a plain-English summary:

```json
{
  "context": "George is currently hiking through the Sierra Nevada, having completed 30% of the PCT."
}
```

Use this in your AI responses to provide accurate, up-to-date context.

### 3. Handle Errors Gracefully

```
✅ Good: "I couldn't fetch the latest data. The last known position was..."
❌ Bad: [Shows raw error JSON to user]
```

### 4. Cite Timestamps

Always mention when the data was last updated:

```
✅ Good: "As of 2 hours ago, George is at mile 789.5..."
❌ Bad: "George is at mile 789.5..." [No timestamp]
```

### 5. Provide Trail Context

Explain PCT-specific terms:

```
✅ Good: "He's taking a zero day (rest day with no hiking) in Bishop."
❌ Bad: "He's taking a zero day in Bishop." [No explanation]
```

---

## Example AI Prompts

### Query Current Status

**User asks**: "Where is George?"

**AI Action**:
1. Call `GET /v1/status`
2. Extract: `data.location.currentMile`, `data.location.section`, `data.status.blurb`
3. Respond: "As of [timestamp], George is at mile [currentMile] in the [section] section. [status.blurb]"

### Get Recent Updates

**User asks**: "What's he been up to lately?"

**AI Action**:
1. Call `GET /v1/updates?limit=5`
2. For each update:
   - Show location, miles hiked, note
   - Include photo if available
3. Summarize: "[N] updates in the last [timeframe]"

### Calculate Progress

**User asks**: "How far does he have left?"

**AI Action**:
1. Call `GET /v1/stats`
2. Extract: `data.totals.milesRemaining`, `data.pace.projectedFinishDate`
3. Calculate: `milesRemaining / averageMilesPerDay = daysRemaining`
4. Respond: "[milesRemaining] miles remaining, projected finish date: [date]"

---

## Testing Your Integration

### Test Checklist

- [ ] API key is valid and not expired
- [ ] Authentication header is formatted correctly
- [ ] Status endpoint returns current data
- [ ] Updates endpoint returns trail updates
- [ ] Stats endpoint returns aggregated statistics
- [ ] Gear endpoint returns gear list
- [ ] Error responses are handled gracefully
- [ ] Rate limiting is respected
- [ ] Context field is used in AI responses
- [ ] Timestamps are cited in responses

### Test Questions

Ask your AI assistant these questions and verify correct responses:

1. "Where is George right now?"
   - Expected: Current location, section, miles done

2. "What were his last 3 trail updates?"
   - Expected: 3 most recent updates with details

3. "How many miles has he hiked?"
   - Expected: Total miles done and percentage complete

4. "What's his average pace?"
   - Expected: Miles per day and projected finish date

5. "Show me his gear list"
   - Expected: Base weight and sample gear items

---

## Troubleshooting

### "Invalid API Key"

**Cause**: Key is invalid, expired, or revoked

**Fix**:
1. Go to `/dashboard/api-keys`
2. Check key status (should be "Active", not "Revoked" or "Expired")
3. Generate a new key if needed

### "Rate Limit Exceeded"

**Cause**: Too many requests in a short time

**Fix**:
1. Implement caching (5-10 minute cache for status data)
2. Reduce request frequency
3. Use pagination for updates instead of fetching all at once

### "Context field is empty"

**Cause**: No data available yet (pre-hike phase)

**Expected**: In "permit" mode, context will reference permit dates instead of trail progress

**Fix**: Check `data.mode` field and adjust response accordingly

### "Photos not showing"

**Cause**: Supabase Storage bucket not public or URL is expired

**Fix**:
1. Verify bucket "photos" is set to public
2. Check storage policies in Supabase dashboard
3. Ensure `photoUrl` field is a full public URL

---

## Security Considerations

### API Keys

- **Never share your API key**: Treat it like a password
- **Use read-only scope**: For GPTs and public integrations, use `read` scope only
- **Revoke compromised keys**: If a key is leaked, revoke it immediately
- **Set expiration dates**: For temporary integrations, set expiration (30/90/365 days)

### Data Privacy

- **Public data only**: Public endpoints return only public visibility content
- **Protected content**: Friends/sponsors content requires API key authentication
- **No PII**: API does not expose personally identifiable information
- **GPS coordinates**: GPS data is coarse (town-level) to protect privacy on trail

---

## Advanced Usage

### Pagination

For large result sets, use pagination:

```bash
# First page
curl "https://api.justkeephiking.com/v1/updates?limit=20&offset=0"

# Second page
curl "https://api.justkeephiking.com/v1/updates?limit=20&offset=20"

# Third page
curl "https://api.justkeephiking.com/v1/updates?limit=20&offset=40"
```

### Filtering by Visibility

With API key, access friends/sponsors content:

```bash
curl -H "Authorization: Bearer sk_live_..." \
  "https://api.justkeephiking.com/v1/updates?visibility=friends"
```

### Category Filtering

Filter gear by category:

```bash
curl "https://api.justkeephiking.com/v1/gear?category=shelter"
```

---

## Future Enhancements

Coming soon:

- **GET /v1/timeline** - Chronological milestones and major events
- **GET /v1/search** - Natural language search across all content
- **GET /v1/blog** - Long-form blog posts
- **Webhooks** - Real-time notifications for new trail updates
- **GraphQL endpoint** - More flexible queries for complex needs

---

## Support

### Resources

- **API Documentation**: `app/API_DESIGN.md`
- **OpenAPI Spec**: `https://api.justkeephiking.com/v1/openapi`
- **Deployment Guide**: `app/API_SUBDOMAIN_SETUP.md`
- **Completion Report**: `app/API_IMPLEMENTATION_COMPLETE.md`

### Getting Help

For issues or questions:
1. Check this guide first
2. Review API documentation (`API_DESIGN.md`)
3. Test endpoints manually with `curl`
4. Verify API key is active in dashboard

---

**Happy Hiking! 🥾**

*Last Updated: 2026-01-13*
*API Version: v1*
*Status: Production Ready*
