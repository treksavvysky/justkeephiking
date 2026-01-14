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
- 📝 **Blog Posts** - Long-form narratives and town stop stories
- 📸 **Photo Galleries** - Organized collections by section or theme
- ⚖️ **Gear Tracking** - Complete gear list with weights and categories
- 🔒 **Tiered Access** - Public, friends-only, and sponsor-exclusive content
- 🤖 **AI Integration** - API endpoints for Claude/GPT to query trail data
- 📧 **Email Digest** - Daily/weekly update summaries

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
├── api/                    # Standalone API service (api.justkeephiking.com)
├── docs/                   # Project documentation
│   ├── PRD.md              # Product requirements
│   └── ROADMAP.md          # Development roadmap
├── CLAUDE.md               # AI assistant context
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
3. Run the migration in Supabase SQL Editor:
   ```bash
   # Copy contents of app/supabase/migrations/001_initial_schema.sql
   # Paste into SQL Editor and execute
   ```

See [app/SUPABASE_QUICKSTART.md](app/SUPABASE_QUICKSTART.md) for detailed database setup.

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

### API Service (api.justkeephiking.com)

The `api/` directory contains a standalone Express service that serves
configuration data and user listings for `api.justkeephiking.com`.

```bash
cd api
cp .env.example .env
npm install
npm start
```

By default the service listens on port 4000. Configure `SUPABASE_URL` and
`SUPABASE_ANON_KEY` (or `SUPABASE_SERVICE_ROLE_KEY`) in `.env` to enable
`/config`, and add `SUPABASE_SERVICE_ROLE_KEY` for `/users`.

## 📚 Documentation

- **[CLAUDE.md](CLAUDE.md)** - Complete architecture and development guide for AI assistants
- **[docs/PRD.md](docs/PRD.md)** - Product requirements and feature specifications
- **[docs/ROADMAP.md](docs/ROADMAP.md)** - Development roadmap and priorities
- **[app/DEPLOY.md](app/DEPLOY.md)** - Deployment instructions
- **[app/SUPABASE_QUICKSTART.md](app/SUPABASE_QUICKSTART.md)** - Database operations guide

## 🗂️ API Reference

### Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/config` | GET | Get current site configuration |
| `/api/config` | PUT | Update site config (admin only) |
| `/api/trail-updates` | GET | List trail updates (with pagination) |
| `/api/trail-updates` | POST | Create new trail update (admin only) |

### Example Usage

```bash
# Get current configuration
curl https://justkeephiking.com/api/config

# Get trail updates
curl https://justkeephiking.com/api/trail-updates?limit=10

# Create a trail update
curl -X POST https://justkeephiking.com/api/trail-updates \
  -H "Content-Type: application/json" \
  -d '{
    "locationName": "Forester Pass",
    "currentMile": 150.5,
    "note": "Highest point on the PCT!",
    "visibility": "public"
  }'
```

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

### 🔄 Phase 2: Admin & Content (In Progress)
- [ ] Admin authentication (Supabase Auth)
- [ ] Admin dashboard at app.justkeephiking.com
- [ ] Trail update form with photo upload
- [ ] Blog post editor with markdown support

### ⏳ Phase 3: Advanced Features (Planned)
- [ ] Gallery management with bulk upload
- [ ] GPS tracking with privacy controls
- [ ] Email notifications (daily/weekly digest)
- [ ] Live chat for friends/family
- [ ] Gear list page (public)
- [ ] AI API for natural language queries

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

**Current Status**: Permit Phase (Countdown to 2026-01-13)
**Trail Start**: April 2026 (date TBD after permit confirmation)
**Last Updated**: 2026-01-13

*Keep hiking. Keep dreaming. Just keep going.* 🥾
