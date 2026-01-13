# Just Keep Hiking - Next.js Application

Production-ready hiking platform with tiered access, real-time updates, and AI integration.

## Architecture Overview

### Tech Stack
- **Frontend**: Next.js 14 (App Router) + TypeScript + Tailwind CSS
- **Database**: Supabase (PostgreSQL with Row-Level Security)
- **Auth**: Supabase Auth (email/password + social providers)
- **Email**: Custom SMTP relay to your VPS
- **Hosting**: Docker on Dokploy (your VPS)
- **Domains**:
  - `justkeephiking.com` - Public site
  - `app.justkeephiking.com` - Admin dashboard & tools

### Database Schema

```sql
-- Users table (managed by Supabase Auth)
-- Extended with custom profiles

-- User Profiles
CREATE TABLE profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'public' CHECK (role IN ('public', 'friend', 'sponsor', 'admin')),
  sponsor_tier TEXT CHECK (sponsor_tier IN ('bronze', 'silver', 'gold', 'platinum')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trail Updates (micro-posts from trail)
CREATE TABLE trail_updates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  miles_hiked DECIMAL(6,2),
  current_mile DECIMAL(6,2),
  location_name TEXT NOT NULL,
  location_lat DECIMAL(10,8),
  location_lon DECIMAL(11,8),
  note TEXT,
  photo_url TEXT,
  visibility TEXT DEFAULT 'public' CHECK (visibility IN ('public', 'friends', 'sponsors')),
  author_id UUID REFERENCES profiles(id)
);

-- Blog Posts (long-form narratives)
CREATE TABLE blog_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  featured_image TEXT,
  published BOOLEAN DEFAULT false,
  visibility TEXT DEFAULT 'public' CHECK (visibility IN ('public', 'friends', 'sponsors')),
  author_id UUID REFERENCES profiles(id)
);

-- Photo Galleries
CREATE TABLE galleries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  title TEXT NOT NULL,
  description TEXT,
  visibility TEXT DEFAULT 'public' CHECK (visibility IN ('public', 'friends', 'sponsors'))
);

CREATE TABLE gallery_photos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  gallery_id UUID REFERENCES galleries(id) ON DELETE CASCADE,
  photo_url TEXT NOT NULL,
  caption TEXT,
  taken_at TIMESTAMPTZ,
  order_index INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Gear Lists
CREATE TABLE gear_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  weight_grams INTEGER,
  quantity INTEGER DEFAULT 1,
  notes TEXT,
  url TEXT,
  is_worn BOOLEAN DEFAULT false,
  is_consumable BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Email Subscribers
CREATE TABLE email_subscribers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  frequency TEXT DEFAULT 'weekly' CHECK (frequency IN ('realtime', 'daily', 'weekly')),
  subscribed BOOLEAN DEFAULT true,
  verification_token TEXT,
  verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Chat Messages (secured, invite-only)
CREATE TABLE chat_rooms (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT DEFAULT 'private' CHECK (type IN ('public', 'friends', 'private')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE chat_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  room_id UUID REFERENCES chat_rooms(id) ON DELETE CASCADE,
  author_id UUID REFERENCES profiles(id),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE room_members (
  room_id UUID REFERENCES chat_rooms(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (room_id, user_id)
);
```

### Row-Level Security (RLS) Policies

Supabase RLS ensures content is only visible to authorized users:

- **Public content**: Everyone can read
- **Friends content**: Authenticated users with role >= 'friend'
- **Sponsors content**: Authenticated users with role = 'sponsor' or 'admin'
- **Admin actions**: Only users with role = 'admin'

## Project Structure

```
app/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (public)/          # Public routes (justkeephiking.com)
│   │   │   ├── page.tsx       # Landing page (countdown + stats)
│   │   │   ├── blog/          # Blog posts
│   │   │   ├── log/           # Trail log
│   │   │   └── gallery/       # Photo galleries
│   │   ├── (admin)/           # Admin routes (app.justkeephiking.com)
│   │   │   ├── dashboard/     # Admin dashboard
│   │   │   ├── updates/       # Create trail updates
│   │   │   ├── posts/         # Manage blog posts
│   │   │   └── gear/          # Gear list manager
│   │   ├── api/               # API routes
│   │   │   ├── updates/       # Trail updates API (for AI)
│   │   │   ├── subscribe/     # Email subscription
│   │   │   └── auth/          # Auth callbacks
│   │   └── layout.tsx         # Root layout
│   ├── components/            # Reusable components
│   │   ├── ui/               # UI primitives
│   │   ├── auth/             # Auth components
│   │   └── trail/            # Trail-specific components
│   ├── lib/                   # Utilities
│   │   ├── supabase.ts       # Supabase client
│   │   ├── email.ts          # Email utilities
│   │   └── utils.ts          # Helpers
│   └── types/                 # TypeScript types
├── public/                    # Static assets
├── Dockerfile
├── docker-compose.yml
└── README.md
```

## Quick Start

### 1. Set up Supabase

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Run the database schema from above in the SQL editor
3. Copy your project URL and API keys

### 2. Configure Environment

```bash
cp .env.example .env.local
# Edit .env.local with your Supabase credentials and SMTP settings
```

### 3. Run Locally (Development)

```bash
npm install
npm run dev
```

Visit `http://localhost:3000`

### 4. Deploy to Dokploy

```bash
# Build and start with Docker Compose
docker-compose up --build -d
```

Configure Dokploy to:
- Point `justkeephiking.com` to port 3000
- Point `app.justkeephiking.com` to port 3000 (Next.js will handle routing)

## API Endpoints (for AI Integration)

### GET /api/updates
Get recent trail updates
```bash
curl https://justkeephiking.com/api/updates
```

### POST /api/updates
Create trail update (requires auth)
```bash
curl -X POST https://justkeephiking.com/api/updates \
  -H "Authorization: Bearer YOUR_SUPABASE_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "miles_hiked": 15.2,
    "location_name": "Lake Morena",
    "note": "Great day. Feet holding up."
  }'
```

### GET /api/stats
Get current hiking stats
```bash
curl https://justkeephiking.com/api/stats
```

## Next Steps

1. **Complete the PoC**: I can continue building out all the components
2. **Review architecture**: Make changes to database schema or structure
3. **Deploy immediately**: Get this running on your VPS to test

What would you like me to do next?
