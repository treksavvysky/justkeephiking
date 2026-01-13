# Deployment Guide

## Quick Start (Local Development)

1. **Set up environment variables**:
```bash
cd app
cp .env.example .env.local
# Edit .env.local with your Supabase credentials
```

2. **Install dependencies**:
```bash
npm install
```

3. **Run development server**:
```bash
npm run dev
```

Visit `http://localhost:3000`

## Set Up Supabase Database

Before deploying, you need to set up your Supabase database:

### 1. Execute Database Migration

1. Open your Supabase dashboard at https://supabase.com/dashboard
2. Navigate to **SQL Editor** in the left sidebar
3. Click **New Query**
4. Copy the entire contents of `supabase/migrations/001_initial_schema.sql`
5. Paste into the SQL Editor and click **Run**

This creates all tables, RLS policies, and default data.

### 2. Verify Migration

1. Go to **Table Editor** in Supabase dashboard
2. Confirm you see all tables (profiles, site_config, trail_updates, etc.)
3. Check **site_config** table has one row with your permit countdown data

See `supabase/README.md` for detailed instructions.

## Deploy to Dokploy (Production)

### 1. Prepare Your VPS

SSH into your VPS and navigate to your deployment directory:

```bash
cd /path/to/justkeephiking
```

### 2. Configure Environment Variables

Create `.env` file in the `app` directory:

```bash
cd app
nano .env
```

Add your Supabase credentials (same as `.env.local`):
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 3. Build and Deploy

```bash
cd app
docker-compose up --build -d
```

The app will be running on port 3000.

### 3. Configure Nginx (if using)

Add this to your Nginx config:

```nginx
# Main site
server {
    listen 80;
    server_name justkeephiking.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# Admin subdomain (same app, Next.js handles routing)
server {
    listen 80;
    server_name app.justkeephiking.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 4. SSL with Certbot

```bash
sudo certbot --nginx -d justkeephiking.com -d app.justkeephiking.com
```

## Environment Variables

Before deploying, copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
nano .env
```

Required variables:
- `NEXT_PUBLIC_SUPABASE_URL` - From Supabase dashboard
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - From Supabase dashboard
- `SUPABASE_SERVICE_ROLE_KEY` - From Supabase dashboard (keep secret!)
- `SMTP_HOST` - Your VPS with open SMTP port
- `SMTP_PORT` - Usually 25
- `SMTP_USER` - SMTP username
- `SMTP_PASS` - SMTP password
- `SMTP_FROM` - Sender email address

## Updating the App

1. Pull latest changes:
```bash
git pull
```

2. Rebuild and restart:
```bash
cd app
docker-compose down
docker-compose up --build -d
```

## Monitoring Logs

```bash
docker-compose logs -f app
```

## Health Check

Visit `https://justkeephiking.com` - you should see the landing page with countdown.

## Testing API Endpoints

Once deployed, test your API endpoints:

```bash
# Get current site config
curl https://justkeephiking.com/api/config

# Get trail updates
curl https://justkeephiking.com/api/trail-updates

# Create a trail update (requires admin auth - TODO)
curl -X POST https://justkeephiking.com/api/trail-updates \
  -H "Content-Type: application/json" \
  -d '{
    "locationName": "Campo",
    "currentMile": 0,
    "note": "Day 0: Starting tomorrow!",
    "visibility": "public"
  }'
```

## Next Steps After Deployment

1. ✅ Supabase database is set up
2. ✅ Landing page fetches data from Supabase
3. ✅ API endpoints are ready
4. 🔲 Build admin dashboard at app.justkeephiking.com
5. 🔲 Add authentication (Supabase Auth)
6. 🔲 Configure email notifications
7. 🔲 Add photo upload functionality
8. 🔲 Implement GPS tracking with privacy controls
