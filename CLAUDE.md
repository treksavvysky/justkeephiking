# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**justkeephiking.com** is a comprehensive Pacific Crest Trail (PCT) tracking and content platform for documenting a 2026 NOBO (northbound) thru-hike. The platform features:

- **Public landing page** with live countdown, trail stats, and status updates
- **Tiered content access system** (public, friends, sponsors, admin)
- **Multiple content types**: micro-updates, long-form blog posts, photo galleries, gear tracking
- **Real-time features**: GPS tracking, live status, email notifications
- **API-first design**: Enables AI assistants (Claude, ChatGPT) to interact with trail data
- **Admin dashboard**: Easy content management from trail or pre-planning phases

### Vision & Purpose

This platform serves multiple goals:
1. **Primary**: Track and share the 2026 PCT thru-hike journey with different audiences
2. **Secondary**: Build reusable tools (gear calculator, resupply planner) for future hikes
3. **Future**: Create knowledge base and planning resources for 2027+ hiking projects

## Architecture

### Current Stack (v1 - Production)

The project uses a **modern full-stack architecture** with strategic separation of concerns:

#### Technology Stack

- **Frontend**: Next.js 14 (App Router) with TypeScript and Tailwind CSS
- **Backend**: Next.js API routes (serverless functions)
- **Database**: Supabase (PostgreSQL with Row-Level Security)
- **Authentication**: Supabase Auth (email, OAuth providers)
- **File Storage**: Supabase Storage (photos, attachments)
- **Deployment**: Docker + Docker Compose on VPS via Dokploy
- **Domain Strategy**:
  - `justkeephiking.com` - Public landing page and main app
  - `api.justkeephiking.com` - Backend API for AI/GPT integration (also accessible via /api/v1/*)
  - `app.justkeephiking.com` - Admin dashboard (future subdomain)

#### Directory Structure

```
justkeephiking/
├── site/                      # Legacy static site (pre-v1, GitHub Pages)
│   ├── index.html
│   ├── styles.css
│   ├── script.js
│   └── data/
│       ├── site.json          # Deprecated: Use Supabase instead
│       └── README.md
│
├── app/                       # v1 Next.js Application (Production)
│   ├── src/
│   │   ├── app/
│   │   │   ├── (public)/      # Public routes (landing page)
│   │   │   │   └── page.tsx
│   │   │   ├── api/           # API routes
│   │   │   │   ├── config/
│   │   │   │   ├── trail-updates/
│   │   │   │   └── v1/        # AI/GPT API endpoints
│   │   │   ├── layout.tsx
│   │   │   └── globals.css
│   │   ├── components/
│   │   │   ├── countdown/
│   │   │   └── ui/
│   │   ├── lib/
│   │   │   ├── supabase.ts    # Database clients
│   │   │   └── actions.ts     # Server actions
│   │   └── types/
│   │       └── index.ts       # TypeScript interfaces
│   ├── supabase/
│   │   ├── migrations/        # Database schema
│   │   └── README.md
│   ├── public/                # Static assets
│   ├── Dockerfile
│   ├── docker-compose.yml
│   ├── next.config.js
│   ├── tailwind.config.ts
│   ├── package.json
│   ├── .env.local             # Local development (gitignored)
│   ├── .env.example           # Template for environment variables
│   ├── DEPLOY.md              # Deployment instructions
│   └── SUPABASE_QUICKSTART.md # Database operations guide
│
├── docs/                      # Project documentation (see PRD.md, ROADMAP.md)
├── CLAUDE.md                  # This file
└── README.md                  # Project overview
```

### Data Architecture

#### Database Schema (Supabase PostgreSQL)

**Core Tables:**

1. **site_config** - Single-row configuration for landing page
   - Stores countdown dates, mode, stats, and live status
   - Replaces legacy `site/data/site.json`
   - RLS: Public read, admin write only

2. **profiles** - User profiles and roles
   - Links to Supabase auth users
   - Fields: `id`, `email`, `display_name`, `role`, `avatar_url`
   - Roles: `public`, `friend`, `sponsor`, `admin`

3. **trail_updates** - Micro-posts from the trail
   - Short updates with optional photo, location, mileage
   - Fields: `miles_hiked`, `current_mile`, `location_name`, `location_lat/lon`, `note`, `photo_url`, `visibility`
   - Visibility: `public`, `friends`, `sponsors`
   - RLS: Visibility-based access control

4. **blog_posts** - Long-form narratives
   - Detailed stories, town stops, section recaps
   - Fields: `title`, `slug`, `content`, `cover_image`, `visibility`, `published`
   - Same visibility tiers as trail_updates

5. **galleries** - Photo collections
   - Albums organized by section, town, or theme
   - Fields: `title`, `description`, `visibility`

6. **gallery_photos** - Individual photos
   - Links to galleries, stored in Supabase Storage
   - Fields: `gallery_id`, `file_url`, `caption`, `location_lat/lon`, `sort_order`

7. **gear_items** - Gear list with weight tracking
   - Complete gear inventory with weights, categories
   - Fields: `category`, `item_name`, `weight_oz`, `worn`, `consumable`
   - Public visibility for community reference

8. **email_subscribers** - Email notification preferences
   - Subscribe to updates via email digest
   - Fields: `email`, `frequency` (daily, weekly), `confirmed`
   - RLS: Users can only see their own subscription

9. **chat_rooms** - Secure live chat (future)
   - Private communication channels
   - Fields: `name`, `room_type` (direct, group), `visibility`

10. **chat_messages** - Chat messages (future)
    - Real-time messaging for friends/family
    - Fields: `room_id`, `author_id`, `content`, `sent_at`

11. **api_keys** - API keys for external integrations
    - Authentication for custom GPTs and AI assistants
    - Fields: `key_hash`, `key_prefix`, `name`, `scope`, `rate_limit`, `revoked`, `expires_at`
    - Scopes: `read` (for GPTs), `write` (for automation), `admin` (full access)
    - RLS: Admin-only access

12. **api_usage** - API usage analytics
    - Tracks API calls for monitoring and rate limiting
    - Fields: `api_key_id`, `endpoint`, `method`, `status_code`, `response_time_ms`, `ip_address`
    - Automatic cleanup after 30 days

#### Row-Level Security (RLS)

All tables use RLS policies to enforce tiered content access:

- **Public**: Anyone can view (no auth required)
- **Friends**: Authenticated users with `friend` role or higher
- **Sponsors**: Authenticated users with `sponsor` role or higher
- **Admin**: Only admin users can modify content

### Key Design Decisions

#### 1. Database-Driven Configuration

**Why**: The original `site/data/site.json` approach worked well for the static countdown site but doesn't scale for a full platform. Moving to Supabase enables:
- Real-time updates without redeployment
- API-first architecture for AI integration
- Admin dashboard for easy content management
- Tiered access control via RLS
- Scalability for future features (chat, GPS tracking, etc.)

**Migration Path**: The landing page still supports a fallback config in code if database is unavailable.

#### 2. Next.js App Router (Server Components)

**Why**: App Router with Server Components enables:
- Server-side data fetching (faster initial load, better SEO)
- Reduced client-side JavaScript bundle
- Simplified data flow (fetch in Server Components, pass to Client Components)
- API routes colocated with frontend code

**Pattern**: Server Components by default, Client Components (`'use client'`) only for interactivity (countdown timer, forms, buttons).

#### 3. Supabase for Backend

**Why**: Supabase provides:
- PostgreSQL database with full SQL power
- Built-in authentication (email, OAuth)
- Row-Level Security for content tiers
- Real-time subscriptions (for future chat, GPS tracking)
- File storage (for photos)
- Auto-generated REST API
- Lower operational overhead than custom backend

**Trade-off**: Vendor lock-in, but migration path exists (export PostgreSQL dump).

#### 4. Docker Deployment on VPS

**Why**: Self-hosted on VPS (via Dokploy) instead of Vercel/Netlify because:
- Full control over deployment
- Custom email server (hosting provider blocks SMTP)
- Cost savings for hobby project
- Flexibility for future services

**Trade-off**: More operational work, but acceptable for single-user admin.

#### 5. Subdomain Strategy

**Why**: Separate subdomains for public vs. admin:
- `justkeephiking.com` - Fast, cacheable public landing page
- `app.justkeephiking.com` - Protected admin dashboard with auth
- Clear separation of concerns
- Independent scaling/caching strategies

### Color Palette: Sierra Sunset

Theme inspired by alpenglow on Sierra Nevada peaks:

```css
:root {
  --background: #2a2038;     /* Deep twilight purple */
  --card: #3a3048;           /* Elevated card background */
  --text: #f5e6d3;           /* Sun-bleached cream */
  --accent: #ff7b5f;         /* Warm coral-orange */
  --muted: #a09199;          /* Muted text */
  --border: #4a4058;         /* Subtle borders */
  --good: rgba(255,123,95,0.15); /* Success state background */
}
```

**Design Principles**:
- Mobile-first responsive layout
- Prominent countdown on small screens (order: -1)
- High contrast for outdoor readability
- Minimal, clean aesthetic
- Consistent use of CSS variables

### Countdown System

The countdown has **automatic multi-stage logic**:

#### Permit Phase (`mode: "permit"`)

1. **Stage 1**: Before Round 2 release
   - Shows: "Round 2 permit applications open in..."
   - Counts down to: `permitReleaseUTC`

2. **Stage 2**: After Round 2 opens, before personal slot
   - Shows: "My permit slot opens at 12:48:07 PM PT in..."
   - Counts down to: `myPermitSlotUTC`

3. **Stage 3**: After personal slot expires
   - Shows: "Decision time!"
   - Static display

#### Trail Phase (`mode: "start"`)

- Shows: "Trail start at Campo in..."
- Counts down to: `startDateISO`
- Activated when user switches mode and sets start date

**Implementation**: Client Component updates every 250ms, determines stage based on current time vs. configured timestamps.

## Deployment Workflow

### Local Development

```bash
cd app
npm install
npm run dev  # Runs on http://localhost:3000
```

**Environment**: Requires `.env.local` with Supabase credentials (see `.env.example`).

### Production Deployment (VPS + Dokploy)

```bash
# On VPS
cd /path/to/justkeephiking
git pull
cd app
nano .env  # Set production environment variables
docker-compose down
docker-compose up --build -d
```

**Requirements**:
- Docker and Docker Compose installed
- `.env` file with Supabase credentials
- Domain DNS pointing to VPS
- Supabase database migration executed

See `app/DEPLOY.md` for full deployment guide.

### Database Updates

**From Supabase SQL Editor**:
```sql
-- Switch to trail mode
UPDATE site_config
SET mode = 'start',
    start_date_iso = '2026-04-17T07:00:00-07:00',
    section_now = 'Southern California'
WHERE id = (SELECT id FROM site_config LIMIT 1);
```

**From API** (future admin dashboard):
```bash
curl -X PUT https://justkeephiking.com/api/config \
  -H "Content-Type: application/json" \
  -d '{"mode": "start", "startDateISO": "2026-04-17T07:00:00-07:00"}'
```

See `app/SUPABASE_QUICKSTART.md` for database operations.

## API Endpoints

All API routes follow REST conventions:

### Site Configuration

- `GET /api/config` - Get current site config
- `PUT /api/config` - Update site config (admin only, auth TBD)

### Trail Updates

- `GET /api/trail-updates?limit=20&offset=0` - List trail updates
- `POST /api/trail-updates` - Create new update (admin only, auth TBD)

### Future Endpoints

- `GET /api/blog-posts`
- `GET /api/galleries/:id/photos`
- `GET /api/gear`
- `POST /api/subscribe` - Email subscription
- `GET /api/gps/latest` - Latest GPS ping (with privacy controls)

## Code Modification Guidelines

### General Principles

- **Mobile-first**: Always test responsive design on small screens
- **Type safety**: Use TypeScript strictly, define interfaces in `src/types/`
- **Server Components default**: Only use `'use client'` when necessary (interactivity, hooks)
- **Color consistency**: Use Tailwind theme or CSS variables (no hardcoded colors)
- **Privacy-conscious**: GPS data, chat, and friend/sponsor content must respect visibility tiers
- **Simplicity**: Avoid over-engineering, optimize for single admin user

### Adding New Features

1. **Database-first**: Define schema in `supabase/migrations/` with RLS policies
2. **Types**: Add TypeScript interfaces to `src/types/index.ts`
3. **API route**: Create server endpoint in `src/app/api/`
4. **Server action** (optional): Add reusable logic to `src/lib/actions.ts`
5. **UI components**: Build in `src/components/`, use Server Components when possible
6. **Test**: Verify in local dev, test with Supabase dashboard

### Testing Checklist

- [ ] Mobile responsiveness (320px to 1440px)
- [ ] Color theme consistency (no hardcoded colors)
- [ ] Server Component vs Client Component usage
- [ ] RLS policies enforced (test with anonymous user)
- [ ] TypeScript builds without errors
- [ ] Docker build succeeds (`docker-compose up --build`)

## Current State (as of 2026-01-13)

### ✅ Completed

- [x] Static landing page with countdown (legacy `site/`)
- [x] Next.js 14 application with TypeScript
- [x] Supabase database schema and RLS policies
- [x] Landing page fetching from Supabase
- [x] API routes for site config and trail updates
- [x] Docker deployment configuration
- [x] Documentation (DEPLOY.md, SUPABASE_QUICKSTART.md)
- [x] Admin authentication (Supabase Auth with email + OAuth)
- [x] Admin dashboard for content management
- [x] Site config editor
- [x] Trail update form
- [x] Quick action buttons
- [x] Backend API for AI/GPT integration (api.justkeephiking.com)
- [x] API key authentication system
- [x] Core API endpoints (status, updates, stats, gear)
- [x] OpenAPI specification for custom GPT setup
- [x] API keys management dashboard

### 🔄 In Progress

- [ ] Photo upload functionality (bucket created, testing needed)
- [ ] Email notification system

### ⏳ Planned (See ROADMAP.md)

- [ ] Blog post editor with markdown
- [ ] Gallery management with bulk upload
- [ ] Gear list page (public)
- [ ] GPS tracking with privacy controls
- [ ] Live chat for friends/family
- [ ] Email digest (daily/weekly summaries)
- [ ] Resupply planner tool
- [ ] Training log (pre-hike)

## Key Files Reference

| File | Purpose |
|------|---------|
| `app/src/app/(public)/page.tsx` | Landing page (Server Component) |
| `app/src/components/countdown/Countdown.tsx` | Countdown timer (Client Component) |
| `app/src/lib/supabase.ts` | Supabase client initialization |
| `app/src/lib/actions.ts` | Server actions (data fetching) |
| `app/src/types/index.ts` | TypeScript interfaces |
| `app/supabase/migrations/001_initial_schema.sql` | Initial database schema |
| `app/supabase/migrations/002_api_keys.sql` | API keys schema |
| `app/src/app/api/v1/status/route.ts` | API: Current trail status |
| `app/src/app/api/v1/updates/route.ts` | API: Trail updates feed |
| `app/src/app/api/v1/stats/route.ts` | API: Trail statistics |
| `app/src/app/api/v1/gear/route.ts` | API: Gear list |
| `app/src/lib/api/auth.ts` | API key authentication utilities |
| `app/public/openapi.json` | OpenAPI specification |
| `app/DEPLOY.md` | Deployment instructions |
| `app/SUPABASE_QUICKSTART.md` | Database operations guide |
| `app/API_DESIGN.md` | API architecture documentation |
| `app/API_SUBDOMAIN_SETUP.md` | API subdomain setup guide |
| `app/API_IMPLEMENTATION_COMPLETE.md` | API implementation summary |
| `app/ADMIN_SETUP.md` | Admin dashboard setup guide |
| `app/PHASE2_COMPLETE.md` | Phase 2 completion report |
| `AGENTS.md` | AI agent integration guide |
| `PRD.md` | Product Requirements Document |
| `ROADMAP.md` | Project roadmap and priorities |

## Common Tasks

### Update Site Config from Trail

**Option 1: Supabase SQL Editor**
```sql
UPDATE site_config
SET miles_done = 150,
    section_now = 'Sierra',
    last_checkin = '2 hours ago',
    status_blurb = 'Just crossed Forester Pass!'
WHERE id = (SELECT id FROM site_config LIMIT 1);
```

**Option 2: Admin Dashboard**
- Log in to `/login`
- Navigate to `/dashboard/config`
- Update values and click "Save Changes"

### Create Trail Update

**Option 1: Supabase SQL Editor**
```sql
INSERT INTO trail_updates (miles_hiked, current_mile, location_name, note, visibility)
VALUES (14.2, 150.5, 'Forester Pass', 'Highest point on the PCT!', 'public');
```

**Option 2: Admin Dashboard**
- Log in to `/login`
- Navigate to `/dashboard/update`
- Fill in location, miles, note, and photo
- Click "Post Update"

**Option 3: API (with API key)**
```bash
curl -X POST https://justkeephiking.com/api/trail-updates \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer sk_live_..." \
  -d '{
    "milesHiked": 14.2,
    "currentMile": 150.5,
    "locationName": "Forester Pass",
    "note": "Highest point on the PCT!",
    "visibility": "public"
  }'
```

### Query Trail Data via API (for AI assistants)

**Current Status**:
```bash
curl https://api.justkeephiking.com/v1/status
```

**Recent Updates**:
```bash
curl https://api.justkeephiking.com/v1/updates?limit=5
```

**Trail Statistics**:
```bash
curl https://api.justkeephiking.com/v1/stats
```

**Gear List**:
```bash
curl https://api.justkeephiking.com/v1/gear
```

### Manage API Keys

- Navigate to `/dashboard/api-keys`
- Click "+ Create New API Key"
- Choose scope (`read` for GPTs, `write` for automation, `admin` for full access)
- Copy the key (only shown once!)
- Use key in custom GPT configuration

## Privacy & Security Notes

- **GPS tracking**: Must include granularity controls (hide exact location, delay updates)
- **Chat**: Only visible to room members, RLS enforced
- **Email subscribers**: Can only see/modify their own subscription
- **Service role key**: Never expose in client code, use only in API routes
- **Authentication**: Add before allowing public trail update submissions

## Future Architectural Considerations

### Phase 2 (2027+)

- **Multi-hike support**: Track multiple trails (CDT, AT, JMT)
- **Public knowledge base**: Share gear lists, resupply strategies, lessons learned
- **Community features**: Comments on blog posts, gear reviews
- **Advanced AI integration**: Natural language queries ("How many miles did I hike in the Sierra?")

### Scaling Considerations

- Current architecture supports ~1000 concurrent users (sufficient for personal project)
- Supabase free tier: 500MB database, 1GB file storage, 50k monthly active users
- If traffic grows: Upgrade Supabase tier, add CDN (Cloudflare), optimize images
- If backend complexity grows: Consider splitting API into microservices

## Questions & Troubleshooting

### "Landing page not fetching from Supabase"

- Check `.env.local` has correct Supabase URL and anon key
- Verify migration was executed (check `site_config` table in Supabase dashboard)
- Check browser console for errors
- Fallback config should still work (hardcoded in `page.tsx`)

### "RLS policy denying access"

- Verify user role in `profiles` table
- Check RLS policy in Supabase dashboard (Table Editor → Policies tab)
- Use service role key for admin operations (API routes)

### "Docker build failing"

- Ensure all dependencies in `package.json`
- Check `next.config.js` has `output: 'standalone'`
- Verify `.env` file exists in `app/` directory
- Check Docker logs: `docker-compose logs -f`

## Additional Resources

- **Product Requirements**: See `docs/PRD.md`
- **Project Roadmap**: See `docs/ROADMAP.md`
- **AI Agent Integration**: See `AGENTS.md`
- **Deployment Guide**: See `app/DEPLOY.md`
- **Database Guide**: See `app/SUPABASE_QUICKSTART.md`
- **Admin Setup Guide**: See `app/ADMIN_SETUP.md`
- **API Documentation**: See `app/API_DESIGN.md`
- **API Subdomain Setup**: See `app/API_SUBDOMAIN_SETUP.md`
- **Phase 2 Completion Report**: See `app/PHASE2_COMPLETE.md`
- **Supabase Dashboard**: https://uoopfkziigqnyssdwenz.supabase.co
- **GitHub Repository**: https://github.com/treksavvysky/justkeephiking

---

**Last Updated**: 2026-01-13
**Current Version**: v1.1 (Next.js + Supabase + Admin Dashboard + API)
**Next Milestone**: Deploy API subdomain and configure custom GPT
