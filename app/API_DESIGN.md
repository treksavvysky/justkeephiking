# API Architecture for api.justkeephiking.com

**Purpose**: Backend API for AI integration (custom GPTs, Claude, etc.) to access trail data programmatically.

**Target Launch**: Before May 11, 2026 (trail start)

---

## Overview

The API subdomain `api.justkeephiking.com` provides a RESTful JSON API for querying trail status, updates, blog posts, and gear information. It's designed specifically for AI assistants (custom GPTs) to access current trail data and answer questions about the hike.

### Key Design Principles

1. **AI-First**: Responses include context and metadata that help LLMs provide better answers
2. **Read-Only**: GPTs can only read data, not write (security)
3. **Public + Authenticated**: Some endpoints are public, others require API keys
4. **Versioned**: API versioning (/v1/) for future compatibility
5. **Well-Documented**: OpenAPI spec for easy custom GPT integration

---

## Authentication

### API Key System

**For Custom GPTs and AI agents:**
- API keys stored in `api_keys` table with scopes and rate limits
- Include in request header: `Authorization: Bearer sk_live_...`
- Keys can be scoped to specific operations (read-only, admin, etc.)
- Rate limiting: 100 requests/minute per key

**For Admin Operations:**
- Use Supabase JWT tokens (from dashboard authentication)
- Include in request header: `Authorization: Bearer eyJhbGc...`

### Public Endpoints (No Auth Required)

- `GET /v1/status` - Current trail status
- `GET /v1/updates` - Public trail updates (paginated)
- `GET /v1/stats` - Trail statistics
- `GET /v1/gear` - Gear list

### Protected Endpoints (API Key Required)

- `GET /v1/updates/friends` - Friends-only updates
- `GET /v1/blog` - Blog posts (including drafts for admin)
- `GET /v1/timeline` - Complete trail timeline

---

## API Endpoints

### Base URL

```
https://api.justkeephiking.com/v1
```

### 1. Current Status

**Endpoint**: `GET /v1/status`

**Description**: Get current trail status, location, and live stats. This is the primary endpoint for "Where is George now?" queries.

**Auth**: Public (no key required)

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

**Context Field**: Provides a plain-English summary for LLMs to include in responses.

---

### 2. Trail Updates Feed

**Endpoint**: `GET /v1/updates`

**Description**: Get trail updates (micro-posts) with pagination. Returns public updates by default.

**Auth**: Public (no key required for public updates)

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
    "limit": 20,
    "offset": 0,
    "total": 45,
    "hasMore": true
  },
  "context": "These are George's recent trail updates, posted from the trail. The most recent update was 2 hours ago from Forester Pass."
}
```

---

### 3. Timeline

**Endpoint**: `GET /v1/timeline`

**Description**: Get a chronological timeline of major milestones, zero days, resupplies, and significant events.

**Auth**: API key optional (public data, but helps with rate limiting)

**Query Parameters**:
- `from` (ISO date) - Start date for timeline
- `to` (ISO date) - End date for timeline
- `type` (default: all) - Filter by event type (milestone, resupply, zero-day, incident)

**Response**:
```json
{
  "status": "success",
  "data": [
    {
      "date": "2026-05-11",
      "type": "start",
      "mile": 0,
      "title": "Trail Start - Campo",
      "description": "Started the PCT NOBO from the Mexican border."
    },
    {
      "date": "2026-05-18",
      "type": "resupply",
      "mile": 110,
      "title": "Warner Springs Resupply",
      "description": "First resupply stop."
    },
    {
      "date": "2026-06-25",
      "type": "milestone",
      "mile": 789.5,
      "title": "Forester Pass",
      "description": "Highest point on the PCT at 13,153 feet."
    }
  ],
  "context": "George started the PCT on May 11, 2026, and is currently 45 days into the hike."
}
```

---

### 4. Trail Statistics

**Endpoint**: `GET /v1/stats`

**Description**: Aggregated statistics about the hike (totals, averages, records).

**Auth**: Public

**Response**:
```json
{
  "status": "success",
  "data": {
    "totals": {
      "milesDone": 789.5,
      "milesRemaining": 1860.5,
      "daysOnTrail": 45,
      "zerosDays": 3,
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

### 5. Gear List

**Endpoint**: `GET /v1/gear`

**Description**: Get the current gear list with weights and categories.

**Auth**: Public

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
        "quantity": 1,
        "worn": false,
        "consumable": false,
        "notes": "Freestanding with trekking poles",
        "url": "https://zpacks.com/products/duplex-tent"
      }
    ],
    "categories": ["shelter", "sleep", "clothing", "cooking", "electronics", "misc"]
  },
  "context": "George's base weight is 8.5 lbs, with a total pack weight around 13.8 lbs including food and water."
}
```

---

### 6. Blog Posts

**Endpoint**: `GET /v1/blog`

**Description**: Get published blog posts (long-form narratives).

**Auth**: Public for published posts, API key for drafts

**Query Parameters**:
- `limit` (default: 10)
- `offset` (default: 0)
- `slug` (optional) - Get specific post by slug

**Response**:
```json
{
  "status": "success",
  "data": [
    {
      "id": "post123",
      "title": "First Week: Desert Heat",
      "slug": "first-week-desert-heat",
      "excerpt": "The first 100 miles through the desert were brutal but beautiful.",
      "content": "Full markdown content here...",
      "coverImage": "https://...",
      "publishedAt": "2026-05-20T10:00:00Z",
      "visibility": "public",
      "readTime": 8
    }
  ],
  "pagination": {
    "limit": 10,
    "offset": 0,
    "total": 5
  }
}
```

---

### 7. Search

**Endpoint**: `GET /v1/search`

**Description**: Natural language search across all content types (updates, blog posts, timeline).

**Auth**: API key recommended for better rate limits

**Query Parameters**:
- `q` (required) - Search query
- `type` (optional) - Filter by content type (update, blog, timeline, all)
- `limit` (default: 20)

**Response**:
```json
{
  "status": "success",
  "query": "forester pass",
  "data": [
    {
      "type": "update",
      "relevance": 0.95,
      "item": {
        "id": "...",
        "snippet": "Highest point on the PCT! Views are incredible.",
        "date": "2026-06-25",
        "url": "/updates/123"
      }
    }
  ],
  "context": "Found 3 results related to 'forester pass', including trail updates and blog mentions."
}
```

---

## Custom GPT Integration

### OpenAPI Specification

The API provides an OpenAPI 3.0 specification at:

```
https://api.justkeephiking.com/openapi.json
```

### Custom GPT Configuration

**GPT Name**: "PCT Trail Tracker for justkeephiking.com"

**Description**:
```
Track George's Pacific Crest Trail thru-hike in real-time. Get current location, trail updates, statistics, gear information, and answer questions about the 2,650-mile journey from Mexico to Canada.
```

**Instructions**:
```
You are a trail assistant for George's 2026 PCT NOBO thru-hike. Use the justkeephiking.com API to answer questions about:

1. Current location and status (GET /v1/status)
2. Recent trail updates and photos (GET /v1/updates)
3. Trail statistics and pace (GET /v1/stats)
4. Gear list and weight (GET /v1/gear)
5. Blog posts and stories (GET /v1/blog)

When users ask "Where is George?", always fetch the latest status. Include relevant context from recent updates. Be encouraging and trail-enthusiast friendly.

Always cite the source of information with the update date/time.
```

**Authentication**: Configure API key in GPT settings

**Privacy**: Only access public data unless user provides friends/sponsor API key

---

## Rate Limiting

### Public Endpoints
- **Anonymous**: 60 requests/hour per IP
- **With API Key**: 100 requests/minute

### Protected Endpoints
- **API Key Required**: 100 requests/minute
- **Admin Key**: Unlimited

### Headers
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1625068800
```

---

## Error Handling

### Standard Error Response

```json
{
  "status": "error",
  "error": {
    "code": "RESOURCE_NOT_FOUND",
    "message": "Trail update not found",
    "details": "No update exists with ID abc123"
  }
}
```

### Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `INVALID_API_KEY` | 401 | API key is invalid or expired |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many requests |
| `RESOURCE_NOT_FOUND` | 404 | Requested resource doesn't exist |
| `VALIDATION_ERROR` | 400 | Request parameters are invalid |
| `INTERNAL_ERROR` | 500 | Server error |

---

## Deployment Architecture

### Subdomain Setup

**DNS Configuration**:
```
api.justkeephiking.com → CNAME → justkeephiking.com
```

**Next.js Configuration** (`next.config.js`):
```javascript
module.exports = {
  async rewrites() {
    return [
      {
        source: '/v1/:path*',
        destination: '/api/v1/:path*',
        has: [
          {
            type: 'host',
            value: 'api.justkeephiking.com',
          },
        ],
      },
    ];
  },
};
```

**Docker/Nginx**: Route api.justkeephiking.com to same container, different port or path prefix.

---

## Implementation Phases

### Phase 1 (Current Sprint) ✅
- [x] Design API architecture
- [ ] Create API key authentication system
- [ ] Implement v1 core endpoints (status, updates, stats)
- [ ] Generate OpenAPI specification
- [ ] Configure subdomain routing

### Phase 2 (Before Trail Start - May 11, 2026)
- [ ] Add search endpoint
- [ ] Create custom GPT integration
- [ ] Set up rate limiting
- [ ] Deploy to api.justkeephiking.com
- [ ] Test with ChatGPT custom GPT

### Phase 3 (During Hike)
- [ ] Monitor API usage and performance
- [ ] Add new endpoints based on GPT needs
- [ ] Optimize response times
- [ ] Add caching layer (Redis)

---

## Testing

### Manual Testing

```bash
# Get current status
curl https://api.justkeephiking.com/v1/status

# Get trail updates
curl https://api.justkeephiking.com/v1/updates?limit=5

# With API key
curl -H "Authorization: Bearer sk_live_..." \
  https://api.justkeephiking.com/v1/updates?visibility=friends
```

### Custom GPT Testing

1. Configure custom GPT with API key
2. Ask: "Where is George right now?"
3. Verify it calls GET /v1/status
4. Ask: "What were his last 5 trail updates?"
5. Verify it calls GET /v1/updates?limit=5

---

## Security Considerations

1. **API Keys**: Store hashed in database, never expose in responses
2. **Rate Limiting**: Prevent abuse and excessive usage
3. **CORS**: Allow requests from chatgpt.com and claude.ai domains
4. **Input Validation**: Sanitize all query parameters
5. **RLS Enforcement**: Supabase RLS policies still apply
6. **No Write Operations**: GPTs can only read data, not modify

---

## Future Enhancements

1. **Webhooks**: Notify GPTs of new trail updates
2. **GraphQL Endpoint**: More flexible queries for complex needs
3. **Real-Time WebSocket**: Live GPS tracking stream
4. **AI-Generated Summaries**: Daily/weekly summaries via API
5. **Multi-Hike Support**: API for future trails (CDT, AT)

---

**Last Updated**: 2026-01-13
**Status**: Design Phase
**Next Step**: Implement API key authentication system
