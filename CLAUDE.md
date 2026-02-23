# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**justkeephiking.com** — A PCT (Pacific Crest Trail) tracking platform for a 2026 NOBO thru-hike. Features a public landing page with countdown, tiered content access (public/friends/sponsors/admin), trail updates, and an API for AI assistant integration.

**Stack**: Next.js 14 (App Router), TypeScript, Tailwind CSS, Supabase (PostgreSQL + Auth + Storage), Docker deployment on VPS via Dokploy.

## Commands

All commands run from `app/`:

```bash
npm install          # Install dependencies
npm run dev          # Dev server at localhost:3000
npm run build        # Production build (uses standalone output for Docker)
npm run lint         # ESLint (Next.js defaults, no custom config)
```

Docker (production, from `app/`):
```bash
docker-compose up --build -d    # Build and run (Dockerfile + docker-compose.yml are in app/)
docker-compose logs -f          # View logs
```

No test framework is configured. There is a manual `test-supabase.js` script for verifying database connectivity.

## Architecture

### Directory Layout

The Next.js app lives in `app/`. The `site/` directory is a deprecated static site — ignore it.

```
app/src/
├── app/
│   ├── (public)/          # Public route group (landing page)
│   ├── (auth)/            # Auth route group (login, signup, reset-password)
│   ├── dashboard/         # Protected admin routes (layout checks auth)
│   ├── api/               # Legacy API (config, trail-updates)
│   │   └── v1/            # AI/GPT API (status, updates, stats, gear, openapi)
│   └── auth/callback/     # OAuth callback
├── components/
│   ├── auth/              # Login/signup/reset forms
│   ├── countdown/         # Countdown timer (Client Component)
│   ├── dashboard/         # Admin dashboard components
│   └── ui/                # Shared UI (SubscribeButton)
├── lib/
│   ├── supabase.ts        # LEGACY client (simple createClient) — used by some API routes
│   ├── supabase/          # MODERN SSR clients — use these for new code
│   │   ├── client.ts      # Browser client (createBrowserClient)
│   │   ├── server.ts      # Server client (createServerClient with cookies)
│   │   └── middleware.ts   # Session refresh middleware
│   ├── actions.ts         # Server actions (getSiteConfig, updateSiteConfig, createTrailUpdate)
│   ├── auth/actions.ts    # Auth server actions (login, signup, logout)
│   └── api/
│       ├── auth.ts        # API key validation (SHA-256 hash, scopes, usage logging)
│       └── actions.ts     # API-specific server actions
├── middleware.ts           # Next.js middleware — delegates to supabase/middleware for session mgmt
└── types/index.ts          # All TypeScript interfaces
```

### Key Architecture Patterns

**Two Supabase client systems coexist** (technical debt):
- `lib/supabase.ts` — Legacy, simple `createClient()`. Still used in some API routes. Also exports an `adminClient` using the service role key.
- `lib/supabase/{client,server}.ts` — Modern `@supabase/ssr` pattern with cookie-based auth. **Use these for all new code.**

**Server Components by default**. Only use `'use client'` for interactivity (countdown timer, forms, dashboard components). The landing page is a Server Component that fetches config at render time with a hardcoded fallback if Supabase is unavailable.

**Route groups**: `(public)` for the landing page, `(auth)` for login/signup with a minimal layout, `dashboard/` for admin pages (auth-protected via layout).

**Dashboard auth**: `dashboard/layout.tsx` checks Supabase auth and redirects unauthenticated users. The user's role comes from the `profiles` table. Implemented dashboard sub-routes: `/dashboard/config` (site config editor), `/dashboard/update` (trail update creator), `/dashboard/api-keys` (API key management).

**API v1 routes** (`/api/v1/*`) are designed for AI/GPT consumption — responses include a `context` string and `_meta` with timing info. An OpenAPI spec is served at `/api/v1/openapi` and as a static file at `public/openapi.json`.

**API key auth** (`lib/api/auth.ts`): Keys are `sk_live_[32hex]`, stored as SHA-256 hashes in `api_keys` table. Scopes: `read`, `write`, `admin`. Usage tracked in `api_usage` table (auto-cleaned after 30 days).

### Database

Schema defined in `supabase/migrations/` (001 = core tables, 002 = API keys). All tables use Row-Level Security. Key tables: `site_config` (single-row landing page config), `profiles` (user roles), `trail_updates`, `blog_posts`, `galleries`, `gallery_photos`, `gear_items`, `email_subscribers`, `chat_rooms`, `chat_messages`, `room_members`, `api_keys`, `api_usage`.

Visibility tiers enforced via RLS: `public` (anyone), `friends` (friend role+), `sponsors` (sponsor role+), admin-only writes.

### Styling

"Sierra Sunset" theme. Tailwind custom colors defined in `tailwind.config.ts`: `background`, `card`, `text`, `muted`, `accent`. Additional CSS variables in `globals.css` (`--border`, `--good`). Use Tailwind theme classes or CSS variables — never hardcode hex colors.

## Environment Variables

Required in `app/.env.local` (dev) or `app/.env` (production):

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
```

Optional:
```
NEXT_PUBLIC_APP_URL=https://justkeephiking.com
NEXT_PUBLIC_ADMIN_URL=https://app.justkeephiking.com
SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM
```

## Code Conventions

- **Types** go in `src/types/index.ts`
- **Server actions** use `'use server'` directive; mutations go through server actions, not client-side API calls
- **New features workflow**: migration with RLS → types → API route or server action → UI component
- **Path alias**: `@/*` maps to `src/*`
- Use `next.config.js` `output: 'standalone'` — do not change this (required for Docker)
- The `images.domains` in `next.config.js` contains a placeholder (`your-project.supabase.co`) that needs updating for production image optimization

## Known Technical Debt

- Legacy `lib/supabase.ts` should be migrated to `lib/supabase/{client,server}.ts`
- API PUT endpoints (`/api/config`, `/api/trail-updates`) lack authentication guards
- `next.config.js` image domain is a placeholder
- Some dashboard nav links point to unimplemented pages (blog, galleries, gear, subscribers)
