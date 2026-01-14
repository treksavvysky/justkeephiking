# justkeephiking.com

**A comprehensive platform for tracking and sharing long-distance hiking adventures.**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green)](https://supabase.com/)

## 🏔️ About

justkeephiking.com is a personal hiking platform built to document a 2026 Pacific Crest Trail (PCT) thru-hike. It features real-time trail tracking, tiered content access for different audiences, and tools for planning and executing long-distance hikes.

**Live Site**: [justkeephiking.com](https://justkeephiking.com)

### Key Features

- ⏱️ **Live Countdown** - Multi-stage countdown system (permit day → trail start)
- 📍 **Trail Updates** - Micro-posts with location, mileage, and photos
- 📝 **Blog Posts** - Long-form narratives and town stop stories (coming soon)
- 📸 **Photo Galleries** - Organized collections by section or theme (coming soon)
- ⚖️ **Gear Tracking** - Complete gear list with weights and categories
- 🔒 **Tiered Access** - Public, friends-only, and sponsor-exclusive content
- 🔐 **Admin Dashboard** - Content management with authentication
- 🤖 **AI Integration** - RESTful API for custom GPTs and AI assistants
- 🔑 **API Keys** - Secure authentication for external integrations
- 📧 **Email Digest** - Daily/weekly update summaries (coming soon)

## 🏗️ Architecture

### Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes (serverless)
- **Database**: Supabase (PostgreSQL + Row-Level Security)
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage (photos, attachments)
- **Deployment**: Docker + Docker Compose on VPS (Dokploy)

### Project Structure

```
justkeephiking/
├── app/                    # Next.js application
│   ├── src/
│   │   ├── app/            # Routes and pages
│   │   ├── components/     # React components
│   │   ├── lib/            # Utilities and actions
│   │   └── types/          # TypeScript definitions
│   ├── supabase/           # Database migrations
│   ├── Dockerfile
│   ├── docker-compose.yml
│   └── package.json
├── site/                   # Legacy static site (deprecated)
├── docs/                   # Project documentation
│   ├── PRD.md              # Product requirements
│   └── ROADMAP.md          # Development roadmap
├── CLAUDE.md               # AI assistant context
├── AGENTS.md               # AI agent integration guide
└── README.md               # This file
```

## 🚀 Getting Started

### Prerequisites

- Node.js 20+ (for local development)
- Docker & Docker Compose (for deployment)
- Supabase account

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/treksavvysky/justkeephiking.git
   cd justkeephiking
   ```

2. **Set up environment variables**
   ```bash
   cd app
   cp .env.example .env.local
   # Edit .env.local with your Supabase credentials
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   ```
   http://localhost:3000
   ```

### Database Setup

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Copy your credentials to `.env.local`
3. Run migrations in Supabase SQL Editor:
   ```bash
   # Execute app/supabase/migrations/001_initial_schema.sql
   # Execute app/supabase/migrations/002_api_keys.sql
   ```

See [app/SUPABASE_QUICKSTART.md](app/SUPABASE_QUICKSTART.md) and [app/ADMIN_SETUP.md](app/ADMIN_SETUP.md) for detailed setup.

## 📦 Deployment

### Docker Deployment (Production)

1. **On your VPS**
   ```bash
   cd /path/to/justkeephiking
   git pull
   cd app
   ```

2. **Configure environment**
   ```bash
   nano .env  # Add production credentials
   ```

3. **Build and run**
   ```bash
   docker-compose up --build -d
   ```

4. **Verify deployment**
   ```bash
   curl https://justkeephiking.com/api/config
   ```

See [app/DEPLOY.md](app/DEPLOY.md) for full deployment guide.

## 📚 Documentation

### Core Guides
- **[CLAUDE.md](CLAUDE.md)** - Complete architecture and development guide
- **[AGENTS.md](AGENTS.md)** - AI agent integration guide (custom GPTs, Claude Projects)
- **[docs/PRD.md](docs/PRD.md)** - Product requirements and feature specifications
- **[docs/ROADMAP.md](docs/ROADMAP.md)** - Development roadmap and priorities

### Setup & Deployment
- **[app/DEPLOY.md](app/DEPLOY.md)** - Production deployment instructions
- **[app/SUPABASE_QUICKSTART.md](app/SUPABASE_QUICKSTART.md)** - Database operations guide
- **[app/ADMIN_SETUP.md](app/ADMIN_SETUP.md)** - Admin dashboard setup guide

### API Documentation
- **[app/API_DESIGN.md](app/API_DESIGN.md)** - API architecture and design decisions
- **[app/API_SUBDOMAIN_SETUP.md](app/API_SUBDOMAIN_SETUP.md)** - API subdomain deployment
- **[app/API_IMPLEMENTATION_COMPLETE.md](app/API_IMPLEMENTATION_COMPLETE.md)** - Implementation summary

### Completion Reports
- **[app/PHASE2_COMPLETE.md](app/PHASE2_COMPLETE.md)** - Phase 2 completion report

## 🗂️ API Reference

### AI/GPT Integration API (v1)

**Base URL**: `https://api.justkeephiking.com/v1/`

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/v1/status` | GET | Current trail status and location |
| `/v1/updates` | GET | Trail updates feed (paginated) |
| `/v1/stats` | GET | Trail statistics and pace |
| `/v1/gear` | GET | Gear list with weights |
| `/v1/openapi` | GET | OpenAPI specification |

**Example Usage**:

```bash
# Get current status
curl https://api.justkeephiking.com/v1/status

# Get recent updates
curl https://api.justkeephiking.com/v1/updates?limit=5

# Get trail statistics
curl https://api.justkeephiking.com/v1/stats

# Get gear list
curl https://api.justkeephiking.com/v1/gear
```

**For AI Assistants**: See [AGENTS.md](AGENTS.md) for complete integration guide including custom GPT setup.

### Legacy API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/config` | GET | Get current site configuration |
| `/api/config` | PUT | Update site config (admin only) |
| `/api/trail-updates` | GET | List trail updates (with pagination) |
| `/api/trail-updates` | POST | Create new trail update (admin only) |

## 🎨 Design

### Sierra Sunset Color Palette

The design is inspired by alpenglow on Sierra Nevada peaks:

```css
--background: #2a2038;   /* Deep twilight purple */
--card: #3a3048;         /* Elevated card background */
--text: #f5e6d3;         /* Sun-bleached cream */
--accent: #ff7b5f;       /* Warm coral-orange */
--muted: #a09199;        /* Muted text */
--border: #4a4058;       /* Subtle borders */
```

### Design Principles

- **Mobile-first** - Optimized for small screens and limited connectivity
- **High contrast** - Readable in bright outdoor conditions
- **Minimal** - Clean, distraction-free interface
- **Fast** - Server-side rendering, optimized images, minimal JavaScript

## 🛣️ Roadmap

### ✅ Phase 1: Foundation (Complete)
- [x] Landing page with countdown
- [x] Supabase database integration
- [x] API routes for config and trail updates
- [x] Docker deployment setup

### ✅ Phase 2: Admin & Content (Complete)
- [x] Admin authentication (Supabase Auth with OAuth)
- [x] Admin dashboard with protected routes
- [x] Site config editor
- [x] Trail update form with photo upload
- [x] Quick action buttons for mile tracking
- [x] API key authentication system
- [x] Backend API for AI/GPT integration
- [x] OpenAPI specification for custom GPTs
- [x] API keys management dashboard

### 🔄 Phase 3: Content Consumption (In Progress)
- [ ] Public trail updates feed at `/updates`
- [ ] Blog post editor with markdown support
- [ ] Gallery management with bulk upload
- [ ] Email notifications (daily/weekly digest)
- [ ] Gear list page (public)

### ⏳ Phase 4: Advanced Features (Planned)
- [ ] GPS tracking with privacy controls
- [ ] Live chat for friends/family
- [ ] Rate limiting middleware for API
- [ ] API usage analytics dashboard
- [ ] Webhooks for real-time notifications

See [docs/ROADMAP.md](docs/ROADMAP.md) for detailed timeline and priorities.

## 🤝 Contributing

This is a personal project, but suggestions and feedback are welcome!

If you find a bug or have a feature request:
1. Check existing issues
2. Open a new issue with detailed description
3. Include screenshots or error logs if applicable

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Halfmile**: Trail data and GPS tracks
- **Guthook/FarOut**: Inspiration for trail tracking UX
- **PCT Class of 2026**: Community support and beta testing
- **Supabase**: Amazing backend-as-a-service platform

## 📞 Contact

- **Website**: [justkeephiking.com](https://justkeephiking.com)
- **GitHub**: [treksavvysky/justkeephiking](https://github.com/treksavvysky/justkeephiking)
- **Trail Name**: TBD (will update after shakedown hikes)

---

**Current Status**: Permit Phase (Countdown to permit slot opening)
**Trail Start**: May 11, 2026 (confirmed)
**Last Updated**: 2026-01-13
**Version**: v1.1 (Admin Dashboard + API Integration)

*Keep hiking. Keep building. Just keep going.* 🥾
