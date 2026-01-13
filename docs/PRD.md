# Product Requirements Document (PRD)
# justkeephiking.com

**Version**: 1.0
**Last Updated**: 2026-01-13
**Author**: George Loudon
**Status**: Active Development

---

## Executive Summary

justkeephiking.com is a comprehensive platform for tracking and sharing a 2026 Pacific Crest Trail (PCT) thru-hike. The platform serves multiple audiences (public, friends, sponsors) with tiered content access, real-time trail updates, and tools for planning and executing long-distance hikes.

### Vision

Build a personal hiking platform that:
1. Documents the 2026 PCT thru-hike with real-time updates
2. Provides different content visibility levels for various audiences
3. Enables easy content management from trail (limited connectivity)
4. Creates reusable tools for future hiking projects (2027+)
5. Serves as a knowledge base for the hiking community

### Success Metrics

- **Primary**: Successfully document entire 2026 PCT thru-hike
- **Engagement**: 50+ email subscribers by trail start
- **Content**: 2-3 trail updates per week while on trail
- **Technical**: 99% uptime, <2s page load time
- **Community**: 10+ sponsor tier signups

---

## Target Users

### 1. Public Visitors (Primary)
**Who**: General hikers, PCT enthusiasts, strangers discovering the site
**Needs**:
- Inspiration and motivation for their own hikes
- Trail conditions and updates
- Gear recommendations
- High-level progress tracking

**Content Access**: Public posts, gear list, general blog posts

### 2. Friends & Family (Secondary)
**Who**: Close friends, family members, hiking buddies
**Needs**:
- More frequent updates and personal stories
- Safety check-ins and location info
- Behind-the-scenes content
- Two-way communication (chat)

**Content Access**: Friends-only posts, live chat, detailed location data

### 3. Sponsors (Tertiary)
**Who**: Gear companies, hiking brands, financial supporters
**Needs**:
- Detailed gear reviews and feedback
- Brand exposure and photo rights
- Early access to content
- Engagement metrics

**Content Access**: Sponsor-exclusive posts, detailed gear analytics, photo gallery

### 4. Admin (The Hiker)
**Who**: George (the developer/hiker)
**Needs**:
- Easy content creation from phone with poor signal
- Quick stats updates (miles, location, status)
- Photo upload with low bandwidth
- Minimal friction for posting updates

**Tools**: Admin dashboard, API access, mobile-optimized forms

---

## Core Features

### Phase 1: Foundation (v1.0) ✅

#### 1.1 Public Landing Page
**Priority**: P0 (Must Have)
**Status**: Complete

**Requirements**:
- Live countdown to permit day / trail start
- Trail stats display (miles done, current section, last check-in)
- Live status card (current location, latest update, next milestone)
- Email subscription form
- Mobile-first responsive design
- Sierra Sunset color palette

**Success Criteria**:
- Page loads in <2 seconds on 3G
- Countdown updates every 250ms
- Works without JavaScript (progressive enhancement)

#### 1.2 Database & Backend
**Priority**: P0 (Must Have)
**Status**: Complete

**Requirements**:
- Supabase PostgreSQL database
- Row-Level Security for tiered access
- API routes for site config and trail updates
- Server-side data fetching (Next.js Server Components)
- Environment-based configuration

**Success Criteria**:
- All database tables created with RLS policies
- API endpoints return data in <500ms
- Zero database credentials exposed client-side

#### 1.3 Docker Deployment
**Priority**: P0 (Must Have)
**Status**: Complete

**Requirements**:
- Dockerfile for Next.js application
- docker-compose configuration
- Self-hosted on VPS
- HTTPS support
- Health check endpoint

**Success Criteria**:
- Deployment takes <5 minutes
- Zero-downtime updates
- Logs accessible via docker-compose logs

---

### Phase 2: Admin & Content Management (v1.1) 🔄

#### 2.1 Authentication System
**Priority**: P0 (Must Have)
**Status**: Not Started

**Requirements**:
- Supabase Auth integration
- Email/password authentication
- OAuth providers (Google, GitHub)
- Role-based access control (admin, friend, sponsor, public)
- Password reset flow
- Session management

**Success Criteria**:
- Users can sign up and log in
- Admin can assign roles to users
- Friends/sponsors can access tiered content
- Sessions persist for 30 days

**Dependencies**: None

#### 2.2 Admin Dashboard
**Priority**: P0 (Must Have)
**Status**: Not Started

**Requirements**:
- Hosted at app.justkeephiking.com
- Protected by authentication
- Site config editor (mode, dates, stats)
- Trail update form (location, miles, note, photo)
- Quick stats update buttons
- Mobile-optimized for trail use

**User Stories**:
- As an admin, I can update my current mile marker in <10 seconds
- As an admin, I can post a trail update with photo in <2 minutes
- As an admin, I can switch from permit mode to trail mode with one button

**Success Criteria**:
- All forms work on mobile (tested on iPhone 13)
- Forms submit successfully on slow 3G connection
- Changes reflect on public site within 5 seconds

**Dependencies**: Authentication System (2.1)

#### 2.3 Trail Update Creation
**Priority**: P0 (Must Have)
**Status**: API route complete, UI not started

**Requirements**:
- Form fields: location name, current mile, miles hiked today, note, photo, visibility
- Photo upload to Supabase Storage
- GPS coordinates (optional, auto-detected or manual)
- Visibility selector (public, friends, sponsors)
- Draft mode (save without publishing)
- Post scheduling (future)

**User Stories**:
- As an admin, I can post a quick text update in 30 seconds
- As an admin, I can upload a photo from my phone camera
- As an admin, I can set visibility to friends-only for personal content

**Success Criteria**:
- Photo upload works on mobile (iOS, Android)
- Photos compressed to <500KB before upload
- Form auto-saves to prevent data loss

**Dependencies**: Authentication (2.1), Admin Dashboard (2.2)

#### 2.4 Photo Upload & Management
**Priority**: P1 (Should Have)
**Status**: Not Started

**Requirements**:
- Single photo upload for trail updates
- Bulk upload for galleries
- Image compression (client-side)
- EXIF data extraction (location, date)
- Caption and alt text fields
- Supabase Storage integration

**Technical Specs**:
- Max upload size: 5MB per photo
- Target compressed size: 200-500KB
- Supported formats: JPG, PNG, WEBP
- Generate thumbnails (200x200, 800x600)

**Success Criteria**:
- Photos upload successfully on 3G
- Upload progress indicator shown
- Failed uploads can be retried

**Dependencies**: Authentication (2.1), Admin Dashboard (2.2)

---

### Phase 3: Content Consumption (v1.2) ⏳

#### 3.1 Trail Updates Feed
**Priority**: P0 (Must Have)
**Status**: Not Started

**Requirements**:
- Chronological list of trail updates
- Filter by visibility (public only for anonymous users)
- Pagination (20 updates per page)
- Photo thumbnails
- Location markers (map view optional)
- Share buttons (Twitter, Facebook)

**User Stories**:
- As a public visitor, I can browse all public trail updates
- As a friend, I can see friends-only updates
- As a visitor, I can share an update on social media

**Success Criteria**:
- Feed loads in <1 second
- Infinite scroll or pagination works smoothly
- Photos lazy-load

**Dependencies**: Trail Update Creation (2.3)

#### 3.2 Blog Post System
**Priority**: P1 (Should Have)
**Status**: Database schema complete, UI not started

**Requirements**:
- Markdown editor for long-form content
- Cover image upload
- SEO metadata (title, description, OG tags)
- Slug generation (URL-friendly)
- Draft/published state
- Visibility tiers (public, friends, sponsors)
- Reading time estimate

**User Stories**:
- As an admin, I can write a detailed town stop story
- As an admin, I can save drafts and publish later
- As a visitor, I can read blog posts with proper formatting

**Success Criteria**:
- Markdown renders correctly (headings, lists, links, images)
- Blog posts have unique URLs (e.g., /blog/forester-pass)
- OG tags show proper preview when shared

**Dependencies**: Authentication (2.1), Admin Dashboard (2.2)

#### 3.3 Photo Galleries
**Priority**: P1 (Should Have)
**Status**: Database schema complete, UI not started

**Requirements**:
- Gallery creation (title, description, visibility)
- Bulk photo upload (up to 50 photos)
- Photo captions and ordering
- Lightbox view (full-screen modal)
- Download options (individual or ZIP)
- GPS map view (if EXIF data available)

**User Stories**:
- As an admin, I can create a "Sierra Section" gallery
- As a visitor, I can browse photos in a lightbox
- As a sponsor, I can download high-res photos for marketing

**Success Criteria**:
- Galleries load quickly (lazy-load images)
- Lightbox works on mobile and desktop
- Photos can be reordered via drag-and-drop

**Dependencies**: Photo Upload (2.4)

#### 3.4 Gear List Page
**Priority**: P1 (Should Have)
**Status**: Database schema complete, UI not started

**Requirements**:
- Public-facing gear list
- Categorized by type (clothing, shelter, cooking, etc.)
- Weight tracking (base weight, worn weight, consumables)
- Affiliate links (optional)
- Notes and reviews for each item
- Before/after comparison (start vs end of hike)

**User Stories**:
- As a public visitor, I can browse the complete gear list
- As a visitor, I can see the total base weight
- As a visitor, I can click affiliate links to purchase gear

**Success Criteria**:
- Gear list is readable and organized
- Total weights calculate correctly
- Page is SEO-optimized for "PCT gear list" searches

**Dependencies**: None (can be built independently)

---

### Phase 4: Advanced Features (v2.0) ⏳

#### 4.1 GPS Tracking
**Priority**: P2 (Nice to Have)
**Status**: Not Started

**Requirements**:
- Integration with Garmin inReach or SPOT device
- Automatic GPS ping every 10-30 minutes
- Live map view (public page)
- Privacy controls (delay updates, hide exact location)
- GPS breadcrumb trail on map
- Elevation profile

**Technical Considerations**:
- Garmin API or email-to-API bridge (inReach sends emails)
- Privacy: Delay GPS updates by 24 hours (safety concern)
- Map provider: Mapbox or Google Maps
- Store GPS pings in `gps_tracks` table

**User Stories**:
- As a friend, I can see the hiker's approximate location on a map
- As a public visitor, I can see the trail route with delayed GPS breadcrumbs
- As an admin, I can control GPS visibility (public, friends-only, off)

**Success Criteria**:
- GPS updates appear on map within 5 minutes of receiving ping
- Privacy delay is configurable (0-48 hours)
- Map loads on slow connections

**Dependencies**: None (can be built independently)

#### 4.2 Email Notifications
**Priority**: P1 (Should Have)
**Status**: Not Started

**Requirements**:
- Email subscription form (already on landing page)
- Daily digest (if new content posted that day)
- Weekly digest (summary of week's updates)
- Subscriber preferences (frequency, content types)
- Unsubscribe link in all emails
- Email templates (HTML + plain text)

**Technical Specs**:
- Email provider: Custom SMTP server on separate VPS (port 25 open)
- Templating: React Email or MJML
- Send time: Daily digest at 6 PM PT, weekly on Sunday
- Rate limiting: Max 1 email per subscriber per day

**User Stories**:
- As a subscriber, I receive an email when new content is posted
- As a subscriber, I can choose daily or weekly digest
- As a subscriber, I can unsubscribe with one click

**Success Criteria**:
- Emails deliver successfully (>95% delivery rate)
- Emails render correctly in Gmail, Outlook, Apple Mail
- Unsubscribe link works immediately

**Dependencies**: Email server setup on separate VPS

#### 4.3 Live Chat
**Priority**: P2 (Nice to Have)
**Status**: Database schema complete, UI not started

**Requirements**:
- Real-time messaging for friends/family
- Chat rooms (direct messages, group chats)
- Typing indicators
- Read receipts
- Message history
- Notification badges

**Technical Specs**:
- Real-time: Supabase Realtime (WebSocket)
- Message storage: `chat_messages` table
- RLS: Only room members can read/write messages

**User Stories**:
- As a friend, I can send a message to check in with the hiker
- As an admin, I can respond to messages during town stops
- As a friend, I can see when the hiker is typing

**Success Criteria**:
- Messages appear in real-time (<1 second latency)
- Chat works on mobile (iOS, Android)
- Unread message count displays correctly

**Dependencies**: Authentication (2.1), Supabase Realtime setup

#### 4.4 AI API Integration
**Priority**: P2 (Nice to Have)
**Status**: Not Started

**Requirements**:
- REST API for Claude/GPT to query trail data
- Natural language queries:
  - "How many miles did I hike in the Sierra?"
  - "What was my longest day?"
  - "Show me all updates from Kennedy Meadows"
- Structured data responses (JSON)
- Rate limiting and API key authentication

**API Endpoints**:
- `GET /api/ai/stats` - Aggregate statistics
- `GET /api/ai/search?q=query` - Semantic search
- `GET /api/ai/timeline` - Full trail timeline

**User Stories**:
- As Claude, I can query trail data to answer user questions
- As Claude, I can fetch the latest update to check the hiker's status
- As a user, I can ask Claude "Where is George on the PCT?" and get accurate data

**Success Criteria**:
- API returns accurate data in <500ms
- Natural language queries work for common questions
- API is documented with examples

**Dependencies**: All trail data must be in database

---

## User Flows

### Flow 1: Public Visitor Discovers Site

1. User searches Google for "PCT 2026 blog"
2. Lands on justkeephiking.com landing page
3. Sees live countdown and trail stats
4. Scrolls to read latest trail update
5. Clicks "Subscribe" to get email updates
6. Confirms email address
7. Returns weekly to check progress

**Pain Points**:
- If no recent updates, visitor may not return
- Email confirmation step may cause drop-off

**Solutions**:
- Always show "last updated X days ago"
- One-click subscribe (no confirmation)

### Flow 2: Admin Posts Trail Update from Phone

1. Admin opens app.justkeephiking.com on phone
2. Already logged in (session persists)
3. Taps "Quick Update" button
4. Form auto-fills current location (from GPS)
5. Admin types a short note: "Just passed mile 150!"
6. Taps camera icon to attach photo
7. Selects photo from camera roll
8. Photo compresses automatically
9. Taps "Post Update" button
10. Success message appears: "Update posted!"
11. Admin closes phone and keeps hiking

**Pain Points**:
- Poor cell signal may cause upload failure
- Typing on small screen is tedious
- GPS may not work in mountains

**Solutions**:
- Auto-save draft every 10 seconds
- Voice-to-text for note field
- Allow manual location entry

### Flow 3: Friend Checks Trail Progress

1. Friend visits justkeephiking.com
2. Sees "Login" button in header
3. Logs in with email/password
4. Redirected to landing page (now sees friends-only content)
5. Sees additional trail update marked "Friends Only"
6. Clicks "View Map" to see GPS location
7. Sees hiker's last known location (delayed 12 hours)
8. Clicks "Chat" to send a message
9. Types: "Stay safe out there!"
10. Logs out

**Pain Points**:
- Remembering password
- Not sure what friends-only content looks like

**Solutions**:
- OAuth login (Google, GitHub)
- Visual badge on friends-only content

---

## Non-Functional Requirements

### Performance

- **Page Load Time**: <2 seconds on 3G connection
- **API Response Time**: <500ms for all endpoints
- **Time to Interactive**: <3 seconds on mobile
- **Image Optimization**: All photos <500KB
- **Lighthouse Score**: >90 on all metrics

### Security

- **Authentication**: Supabase Auth with JWT tokens
- **Password Policy**: Minimum 8 characters
- **HTTPS**: Required for all connections
- **RLS**: Enforced on all database tables
- **API Keys**: Never exposed client-side
- **Rate Limiting**: Max 100 requests/minute per IP

### Reliability

- **Uptime**: 99% target (3.65 days downtime/year acceptable)
- **Backup**: Daily database backups to separate location
- **Monitoring**: Health check endpoint at /api/health
- **Error Logging**: All errors logged to Supabase or Sentry
- **Rollback**: Ability to revert deployment within 5 minutes

### Scalability

- **Concurrent Users**: Support 1000 simultaneous visitors
- **Database**: 500MB data storage (Supabase free tier)
- **File Storage**: 1GB photos (Supabase free tier)
- **CDN**: Cloudflare for static assets (future)

### Accessibility

- **WCAG 2.1**: Level AA compliance target
- **Keyboard Navigation**: All interactive elements accessible via keyboard
- **Screen Readers**: Proper ARIA labels and semantic HTML
- **Color Contrast**: Minimum 4.5:1 for text (Sierra Sunset palette)
- **Mobile Accessibility**: Tested with VoiceOver (iOS) and TalkBack (Android)

### SEO

- **Meta Tags**: Title, description, OG tags on all pages
- **Structured Data**: JSON-LD for blog posts
- **Sitemap**: Auto-generated sitemap.xml
- **Robots.txt**: Allow all crawlers
- **Page Speed**: Core Web Vitals pass
- **Mobile-Friendly**: Responsive design

---

## Technical Constraints

### Must Use

- **Next.js 14**: App Router with Server Components
- **TypeScript**: Strict mode enabled
- **Supabase**: Database, auth, storage
- **Docker**: Deployment must use containers
- **Tailwind CSS**: For styling (no custom CSS unless necessary)

### Cannot Use

- **Third-party analytics**: Privacy concerns (no Google Analytics)
- **External CDNs**: Must self-host or use Supabase Storage
- **Paid services**: Free tiers only (Supabase, GitHub, etc.)

### Preferred

- **React Server Components**: Use by default, Client Components only when necessary
- **Zod**: For form validation and type safety
- **React Hook Form**: For complex forms
- **Radix UI**: For accessible component primitives
- **Mapbox**: For GPS map views (free tier)

---

## Release Plan

### v1.0 - Foundation (Complete)
**Target**: 2026-01-10 ✅
**Status**: Complete

- [x] Landing page with countdown
- [x] Supabase database integration
- [x] API routes (config, trail updates)
- [x] Docker deployment

### v1.1 - Admin Dashboard
**Target**: 2026-01-31
**Status**: Not Started

- [ ] Authentication system
- [ ] Admin dashboard at app.justkeephiking.com
- [ ] Trail update form with photo upload
- [ ] Quick stats update buttons

### v1.2 - Content Consumption
**Target**: 2026-03-15
**Status**: Not Started

- [ ] Trail updates feed (public page)
- [ ] Blog post system
- [ ] Gear list page
- [ ] Email subscription confirmation flow

### v2.0 - Advanced Features
**Target**: 2026-04-01 (before trail start)
**Status**: Not Started

- [ ] GPS tracking integration
- [ ] Email notifications (daily/weekly digest)
- [ ] Photo galleries
- [ ] Live chat (MVP)

### v2.1 - AI & Analytics
**Target**: During hike (2026-05 to 2026-10)
**Status**: Not Started

- [ ] AI API for Claude/GPT integration
- [ ] Analytics dashboard (private)
- [ ] Sponsor dashboard (analytics for sponsors)
- [ ] Advanced search and filtering

---

## Open Questions

1. **GPS Privacy**: Should GPS location be public or friends-only by default?
   - **Proposed**: Friends-only with 24-hour delay, admin can make public

2. **Sponsor Tiers**: What should sponsor benefits include?
   - **Proposed**: Early access, photo downloads, detailed gear reviews, monthly Zoom calls

3. **Photo Storage**: How many photos will be uploaded during hike?
   - **Estimate**: 5-10 photos/day × 150 days = 750-1500 photos
   - **Storage**: 500KB avg × 1500 = 750MB (within Supabase free tier)

4. **Email Server**: Use third-party (SendGrid) or self-hosted SMTP?
   - **Proposed**: Self-hosted on separate VPS (port 25 open)

5. **Offline Support**: Should admin dashboard work offline?
   - **Proposed**: Future enhancement, use service workers for offline posting

---

## Success Criteria

### By Trail Start (April 2026)

- [ ] Landing page live with countdown to trail start
- [ ] Admin dashboard functional (can post updates from phone)
- [ ] Email notifications working (daily digest)
- [ ] 50+ email subscribers
- [ ] Site accessible on all devices (mobile, tablet, desktop)

### During Hike (April - October 2026)

- [ ] 2-3 trail updates posted per week
- [ ] Zero downtime (99% uptime)
- [ ] Blog post from each major town stop (15+ posts)
- [ ] 500+ photos uploaded
- [ ] 10+ sponsor signups

### Post-Hike (November 2026+)

- [ ] Complete trail timeline published
- [ ] Lessons learned blog post
- [ ] Gear review section complete
- [ ] Platform ready for future hikes (CDT 2027?)

---

## Appendix

### Glossary

- **PCT**: Pacific Crest Trail (2650-mile trail from Mexico to Canada)
- **NOBO**: Northbound hiker (Mexico to Canada)
- **RLS**: Row-Level Security (Supabase database access control)
- **Server Component**: React component rendered on server (Next.js 14)
- **Client Component**: React component rendered in browser (uses hooks, event handlers)
- **Campo**: Southern terminus of PCT (mile 0)
- **Shakedown**: Pre-hike test to optimize gear

### References

- [PCT Association](https://www.pcta.org/)
- [Halfmile GPS Tracks](https://www.pctmap.net/)
- [Supabase Documentation](https://supabase.com/docs)
- [Next.js App Router](https://nextjs.org/docs/app)

---

**Document Owner**: George Loudon
**Review Cycle**: Monthly during development, quarterly post-launch
**Last Reviewed**: 2026-01-13
