# Project Roadmap
# justkeephiking.com

**Last Updated**: 2026-01-13
**Current Phase**: Phase 2 - Admin & Content Management
**Next Milestone**: Admin Dashboard (Target: 2026-01-31)

---

## Overview

This roadmap outlines the development timeline for justkeephiking.com from initial concept through post-hike completion. The project is structured in four main phases, with milestones tied to key dates in the 2026 PCT thru-hike journey.

### Key Dates

- **2026-01-13**: Permit Day (Round 2 release at 10:30 AM PT)
- **2026-01-31**: Target for Admin Dashboard completion
- **2026-03-15**: Target for public content pages
- **2026-04-01**: Target for all pre-hike features (buffer before trail start)
- **2026-04-17**: Estimated trail start date (pending permit)
- **2026-10-15**: Estimated trail completion (150 days × 18 miles/day)

---

## Phase 1: Foundation ✅
**Duration**: 2025-12-01 to 2026-01-10
**Status**: Complete

### Goals
- Establish core infrastructure
- Launch public landing page
- Set up database and deployment

### Deliverables

#### ✅ 1.1 Static Landing Page (Complete)
- [x] HTML/CSS/JS separation
- [x] Sierra Sunset color palette
- [x] Countdown timer (permit day)
- [x] Trail stats display
- [x] Status cards
- [x] Mobile-first responsive design
- [x] Email subscription form (UI only)

**Completion**: 2025-12-20

#### ✅ 1.2 Next.js Migration (Complete)
- [x] Next.js 14 setup with App Router
- [x] TypeScript configuration
- [x] Tailwind CSS integration
- [x] Component structure (Server/Client)
- [x] Countdown logic (two-stage: Round 2 → personal slot)
- [x] Exact replica of static site

**Completion**: 2026-01-05

#### ✅ 1.3 Supabase Integration (Complete)
- [x] Supabase project setup
- [x] Database schema design
- [x] Row-Level Security policies
- [x] Migration file (001_initial_schema.sql)
- [x] Supabase client utilities
- [x] Server actions for data fetching
- [x] Landing page fetching from database

**Completion**: 2026-01-10

#### ✅ 1.4 API Routes (Complete)
- [x] GET /api/config - Fetch site configuration
- [x] PUT /api/config - Update site config (unprotected)
- [x] GET /api/trail-updates - List trail updates
- [x] POST /api/trail-updates - Create trail update (unprotected)

**Completion**: 2026-01-10

#### ✅ 1.5 Docker Deployment (Complete)
- [x] Dockerfile (multi-stage build)
- [x] docker-compose.yml
- [x] Environment variable configuration
- [x] Deployment documentation
- [x] Health check endpoint

**Completion**: 2026-01-08

### Outcomes
- ✅ Landing page live at justkeephiking.com
- ✅ Database fully operational
- ✅ Deployment pipeline established
- ✅ API foundation ready

---

## Phase 2: Admin & Content Management 🔄
**Duration**: 2026-01-11 to 2026-01-31
**Status**: In Progress (0% complete)

### Goals
- Enable admin to post content easily
- Build mobile-optimized admin dashboard
- Implement authentication system
- Support photo uploads

### Deliverables

#### 2.1 Authentication System
**Priority**: P0 (Must Have)
**Target**: 2026-01-15
**Estimated Effort**: 3 days

**Tasks**:
- [ ] Supabase Auth setup (email/password)
- [ ] OAuth providers (Google, GitHub)
- [ ] User registration flow
- [ ] Login page at app.justkeephiking.com/login
- [ ] Password reset flow
- [ ] Session management (persistent login)
- [ ] Role assignment UI (admin can assign friend/sponsor roles)

**Acceptance Criteria**:
- User can sign up with email/password
- User can log in with Google OAuth
- Admin can assign roles in Supabase dashboard
- Session persists for 30 days
- Password reset email delivers successfully

**Dependencies**: None

**Risks**:
- Email delivery issues (SMTP not configured yet)
- OAuth callback URL configuration

#### 2.2 Admin Dashboard Shell
**Priority**: P0 (Must Have)
**Target**: 2026-01-20
**Estimated Effort**: 5 days

**Tasks**:
- [ ] Create app.justkeephiking.com route group
- [ ] Dashboard layout with navigation
- [ ] Protected route middleware (auth required)
- [ ] Mobile-optimized sidebar/menu
- [ ] Quick actions buttons
- [ ] Stats display (current mile, section, last update)

**Acceptance Criteria**:
- Dashboard accessible only when logged in
- Redirects to /login if not authenticated
- Mobile navigation works (hamburger menu)
- Dashboard loads in <1 second

**Dependencies**: Authentication (2.1)

#### 2.3 Site Config Editor
**Priority**: P0 (Must Have)
**Target**: 2026-01-22
**Estimated Effort**: 2 days

**Tasks**:
- [ ] Form to edit site_config table
- [ ] Mode switcher (permit → start)
- [ ] Date pickers for countdown dates
- [ ] Stats editor (miles done, section, last check-in)
- [ ] Status editor (state, area, blurb, next)
- [ ] Form validation with Zod
- [ ] Success/error toast notifications

**Acceptance Criteria**:
- Admin can update all site_config fields
- Changes reflect on landing page within 5 seconds
- Form validates inputs (e.g., miles must be positive number)
- Mobile-friendly inputs (large touch targets)

**Dependencies**: Admin Dashboard (2.2)

#### 2.4 Trail Update Form
**Priority**: P0 (Must Have)
**Target**: 2026-01-27
**Estimated Effort**: 3 days

**Tasks**:
- [ ] Create trail update form page
- [ ] Fields: location name, current mile, miles hiked, note, visibility
- [ ] Photo upload (single image)
- [ ] GPS coordinate input (optional, manual or auto)
- [ ] Visibility selector (dropdown: public, friends, sponsors)
- [ ] Form auto-save (draft mode)
- [ ] Submit handler with error handling

**Acceptance Criteria**:
- Admin can create trail update in <2 minutes
- Form works on mobile (tested on iPhone)
- Photo uploads successfully to Supabase Storage
- Updates appear in API endpoint immediately

**Dependencies**: Admin Dashboard (2.2), Photo Upload (2.5)

#### 2.5 Photo Upload Component
**Priority**: P0 (Must Have)
**Target**: 2026-01-25
**Estimated Effort**: 2 days

**Tasks**:
- [ ] File input component (drag-and-drop + click)
- [ ] Client-side image compression (browser-image-compression library)
- [ ] Upload progress indicator
- [ ] Supabase Storage integration
- [ ] Error handling (file too large, wrong format)
- [ ] Preview uploaded image

**Acceptance Criteria**:
- Photos <5MB upload successfully
- Photos compressed to <500KB before upload
- Upload works on slow 3G connection
- Failed uploads show error message

**Dependencies**: None (can build independently)

#### 2.6 Quick Update Buttons
**Priority**: P1 (Should Have)
**Target**: 2026-01-29
**Estimated Effort**: 1 day

**Tasks**:
- [ ] Quick stat update buttons (e.g., "Add 10 miles")
- [ ] One-tap location update ("I'm in [town]")
- [ ] Status preset buttons ("Taking a zero", "Resupplying", etc.)
- [ ] Optimistic UI updates

**Acceptance Criteria**:
- Admin can update miles in <10 seconds
- No form required for quick updates
- Works with poor connectivity (queues requests)

**Dependencies**: Site Config Editor (2.3)

### Phase 2 Milestones

**Milestone 2.1**: Authentication Complete (2026-01-15)
- Users can sign up and log in
- Admin dashboard accessible

**Milestone 2.2**: Admin Dashboard Functional (2026-01-27)
- Trail updates can be posted
- Site config can be edited
- Photos can be uploaded

**Milestone 2.3**: Mobile Optimization (2026-01-31)
- All forms tested on mobile
- Quick update buttons work with poor signal
- Phase 2 complete!

---

## Phase 3: Content Consumption 📅
**Duration**: 2026-02-01 to 2026-03-15
**Status**: Not Started

### Goals
- Build public-facing content pages
- Enable visitors to browse trail updates, blog posts, and gear
- Implement email notifications

### Deliverables

#### 3.1 Trail Updates Feed
**Priority**: P0 (Must Have)
**Target**: 2026-02-10
**Estimated Effort**: 5 days

**Tasks**:
- [ ] Create /updates route
- [ ] Fetch trail updates from API
- [ ] Pagination (20 updates per page)
- [ ] Filter by visibility (public only for anonymous users)
- [ ] Display photos with lazy loading
- [ ] Location markers (text-based, map optional)
- [ ] Share buttons (Twitter, Facebook)
- [ ] SEO optimization (meta tags, structured data)

**Acceptance Criteria**:
- Feed loads in <1 second
- Photos lazy-load as user scrolls
- Pagination works smoothly
- Anonymous users see only public updates

**Dependencies**: Trail Update Creation (2.4)

#### 3.2 Blog Post System
**Priority**: P1 (Should Have)
**Target**: 2026-02-20
**Estimated Effort**: 5 days

**Tasks**:
- [ ] Create /blog route (list of posts)
- [ ] Create /blog/[slug] route (individual post)
- [ ] Admin: Blog post editor with markdown
- [ ] Admin: Cover image upload
- [ ] Admin: SEO metadata editor
- [ ] Markdown rendering (remark, rehype)
- [ ] Reading time estimate
- [ ] Table of contents generation
- [ ] Related posts suggestion

**Acceptance Criteria**:
- Admin can write and publish blog posts
- Markdown renders correctly (headings, lists, code blocks)
- Blog posts have unique URLs
- OG tags show proper preview when shared

**Dependencies**: Admin Dashboard (2.2), Photo Upload (2.5)

#### 3.3 Gear List Page
**Priority**: P1 (Should Have)
**Target**: 2026-02-28
**Estimated Effort**: 3 days

**Tasks**:
- [ ] Create /gear route
- [ ] Fetch gear items from database
- [ ] Group by category (shelter, clothing, cooking, etc.)
- [ ] Calculate total base weight
- [ ] Display worn weight and consumables separately
- [ ] Admin: Gear editor (add/edit/delete items)
- [ ] Affiliate links (optional)
- [ ] Sorting and filtering options

**Acceptance Criteria**:
- Gear list is public and SEO-optimized
- Weights calculate correctly
- Categorization is clear and intuitive
- Mobile-friendly layout (stacked cards)

**Dependencies**: None

#### 3.4 Email Notification System
**Priority**: P1 (Should Have)
**Target**: 2026-03-10
**Estimated Effort**: 5 days

**Tasks**:
- [ ] Email subscription confirmation flow
- [ ] Store subscribers in database (email_subscribers table)
- [ ] Daily digest email (if new content posted)
- [ ] Weekly digest email (summary of week)
- [ ] Email templates (React Email or MJML)
- [ ] Unsubscribe link
- [ ] SMTP server configuration (separate VPS)
- [ ] Scheduled job (cron or Supabase Edge Function)

**Acceptance Criteria**:
- Subscribers receive confirmation email
- Daily digest sends at 6 PM PT if new content exists
- Unsubscribe link works immediately
- Emails render correctly in Gmail, Outlook, Apple Mail

**Dependencies**: SMTP server on separate VPS

#### 3.5 Photo Galleries
**Priority**: P1 (Should Have)
**Target**: 2026-03-15
**Estimated Effort**: 3 days

**Tasks**:
- [ ] Create /galleries route (list of galleries)
- [ ] Create /galleries/[id] route (individual gallery)
- [ ] Admin: Gallery creation form
- [ ] Admin: Bulk photo upload (up to 50 photos)
- [ ] Lightbox view (full-screen modal)
- [ ] Photo captions and ordering
- [ ] Download options (individual or ZIP)

**Acceptance Criteria**:
- Galleries load quickly (lazy-load images)
- Lightbox works on mobile and desktop
- Photos can be reordered via drag-and-drop (admin)
- Visitors can download high-res photos

**Dependencies**: Photo Upload (2.5)

### Phase 3 Milestones

**Milestone 3.1**: Content Pages Live (2026-02-15)
- Trail updates feed is public
- Gear list page is live

**Milestone 3.2**: Blog & Galleries (2026-03-01)
- Blog post system functional
- Photo galleries working

**Milestone 3.3**: Email Notifications (2026-03-15)
- Daily digest emails sending
- Phase 3 complete!

---

## Phase 4: Advanced Features 🚀
**Duration**: 2026-03-16 to 2026-04-01
**Status**: Not Started

### Goals
- Add GPS tracking
- Implement live chat
- Build AI API for Claude/GPT integration
- Polish and optimize for trail start

### Deliverables

#### 4.1 GPS Tracking
**Priority**: P2 (Nice to Have)
**Target**: 2026-03-22
**Estimated Effort**: 5 days

**Tasks**:
- [ ] Research Garmin inReach API or email bridge
- [ ] Create gps_tracks table (if not already in schema)
- [ ] Ingest GPS pings (email-to-API webhook)
- [ ] Store GPS coordinates with timestamp
- [ ] Create /map route with live map view
- [ ] Display GPS breadcrumb trail on map
- [ ] Privacy controls (delay updates by X hours)
- [ ] Elevation profile chart

**Acceptance Criteria**:
- GPS pings appear on map within 5 minutes
- Privacy delay is configurable (0-48 hours)
- Map loads on slow connections
- Breadcrumb trail shows hike route

**Dependencies**: Garmin inReach device, Mapbox account

**Risks**:
- Garmin API may not be available (use email bridge as backup)
- Map performance on mobile

#### 4.2 Live Chat (MVP)
**Priority**: P2 (Nice to Have)
**Target**: 2026-03-28
**Estimated Effort**: 5 days

**Tasks**:
- [ ] Enable Supabase Realtime
- [ ] Create /chat route (friends only)
- [ ] Room list (direct messages, group chats)
- [ ] Message input component
- [ ] Real-time message display (WebSocket)
- [ ] Typing indicators
- [ ] Unread message count
- [ ] Notification badges

**Acceptance Criteria**:
- Messages appear in real-time (<1 second latency)
- Chat works on mobile (iOS, Android)
- Only friends can access chat
- Admin can respond during town stops

**Dependencies**: Authentication (2.1), Supabase Realtime

**Risks**:
- Realtime may be unreliable on slow connections
- Chat spam (consider rate limiting)

#### 4.3 AI API Integration
**Priority**: P2 (Nice to Have)
**Target**: 2026-03-31
**Estimated Effort**: 3 days

**Tasks**:
- [ ] Create /api/ai/stats endpoint (aggregate data)
- [ ] Create /api/ai/search endpoint (semantic search)
- [ ] Create /api/ai/timeline endpoint (full trail timeline)
- [ ] Add API key authentication
- [ ] Rate limiting (100 requests/minute)
- [ ] Documentation for Claude/GPT integration

**Acceptance Criteria**:
- API returns accurate data in <500ms
- Claude can query "How many miles has George hiked?"
- API is documented with examples

**Dependencies**: All trail data in database

#### 4.4 Final Polish & Testing
**Priority**: P0 (Must Have)
**Target**: 2026-04-01
**Estimated Effort**: 2 days

**Tasks**:
- [ ] Performance audit (Lighthouse)
- [ ] Accessibility audit (WCAG 2.1 AA)
- [ ] Mobile testing (iOS, Android)
- [ ] Security review (RLS policies, API keys)
- [ ] Backup strategy (daily database backups)
- [ ] Monitoring setup (health checks, error logging)

**Acceptance Criteria**:
- Lighthouse score >90 on all metrics
- All pages work on mobile
- Security review complete
- Monitoring dashboard set up

**Dependencies**: All previous features

### Phase 4 Milestones

**Milestone 4.1**: GPS & Chat Live (2026-03-28)
- GPS tracking functional
- Live chat available for friends

**Milestone 4.2**: AI API Ready (2026-03-31)
- Claude can query trail data

**Milestone 4.3**: Production Ready (2026-04-01)
- All features tested and optimized
- **Trail start ready!**

---

## Post-Hike Enhancements (v2.1+) 🔮
**Duration**: 2026-10-15 onwards
**Status**: Backlog

### Ideas for Future Development

#### Analytics Dashboard (Admin)
- Page view tracking (privacy-respecting, no cookies)
- Most popular blog posts
- Email open rates
- Geographic distribution of visitors

#### Sponsor Dashboard
- Custom analytics for sponsors
- Photo download portal
- Engagement metrics (views, shares)
- Monthly reports

#### Multi-Hike Support
- Track multiple trails (CDT 2027, AT 2028, etc.)
- Archive mode for completed hikes
- Comparison tools (PCT vs CDT stats)

#### Community Features
- Comments on blog posts
- Gear reviews from other hikers
- Trail condition reports
- Collaborative resupply planner

#### Advanced AI Features
- Natural language queries ("What was my longest day?")
- Automatic blog post generation from trail updates
- Photo captioning with AI
- Gear recommendations based on conditions

#### Mobile App (React Native)
- Native iOS/Android app
- Offline posting (queued sync)
- Push notifications for friends
- GPS tracking from phone

---

## Risk Management

### High-Priority Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| **Email delivery fails** | Medium | High | Test SMTP server early, have backup (SendGrid) |
| **Poor cell signal on trail** | High | High | Offline support, auto-save drafts, queue posts |
| **Supabase free tier limits** | Low | Medium | Monitor usage, upgrade if needed ($25/month) |
| **Photo storage fills up** | Medium | Medium | Compress photos aggressively, delete duplicates |
| **GPS device failure** | Low | High | Carry backup device, email-based fallback |

### Medium-Priority Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| **Docker deployment issues** | Low | Medium | Document rollback process, test locally first |
| **Authentication bugs** | Medium | Low | Extensive testing, use Supabase's battle-tested auth |
| **Mobile UI issues** | Medium | Medium | Test on real devices early, prioritize mobile |
| **Map performance** | Medium | Low | Use static maps for slow connections |

### Low-Priority Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| **Spam subscriptions** | Low | Low | CAPTCHA on email form, email confirmation |
| **Chat spam** | Low | Low | Friends-only access, rate limiting |
| **SEO not working** | Low | Low | Use Next.js metadata API, structured data |

---

## Resource Planning

### Time Commitment

- **Pre-hike development** (Jan - Mar 2026): 10-15 hours/week
- **During hike** (Apr - Oct 2026): 1-2 hours/week (content creation only)
- **Post-hike** (Nov 2026+): 5 hours/week (analysis, enhancements)

### Budget

| Item | Cost | Frequency | Total/Year |
|------|------|-----------|------------|
| **VPS Hosting** | $10/month | Monthly | $120 |
| **Domain** | $15/year | Yearly | $15 |
| **Supabase** | $0 (free tier) | - | $0 |
| **Backup VPS (SMTP)** | $5/month | Monthly | $60 |
| **Garmin inReach** | $15/month | 6 months | $90 |
| **Total** | - | - | **$285/year** |

*Note: Assuming Supabase free tier is sufficient. Upgrade to Pro ($25/month) if limits are exceeded.*

### External Dependencies

- **Garmin inReach**: GPS tracking (device purchase ~$400)
- **SMTP Server**: Email notifications (backup VPS with port 25 open)
- **Mapbox**: Map views (free tier: 50k map loads/month)

---

## Success Metrics

### Development Metrics

- **Phase 1 Completion**: 2026-01-10 ✅ (on time)
- **Phase 2 Completion**: 2026-01-31 (target)
- **Phase 3 Completion**: 2026-03-15 (target)
- **Phase 4 Completion**: 2026-04-01 (target)

### Trail Metrics

- **Trail updates posted**: 2-3/week (target: 100+ total)
- **Blog posts written**: 1 per major town stop (target: 15+)
- **Photos uploaded**: 5-10/day (target: 750-1500 total)
- **Email subscribers**: 50 by trail start (target: 100 by trail end)

### Technical Metrics

- **Uptime**: 99% during hike (target: <3 days downtime)
- **Page load time**: <2 seconds on 3G
- **Lighthouse score**: >90 on all metrics
- **Mobile responsiveness**: 100% pass rate (tested on iOS, Android)

---

## Change Log

| Date | Change | Reason |
|------|--------|--------|
| 2026-01-13 | Initial roadmap created | Establish project timeline and priorities |
| 2026-01-13 | Phase 1 marked complete | All foundation features deployed |

---

## Approval & Sign-Off

**Approved By**: George Loudon (Developer/Hiker)
**Date**: 2026-01-13

**Next Review**: 2026-02-01 (after Phase 2 completion)

---

*This roadmap is a living document and will be updated as the project evolves.*
