# Deployment Guide

## Quick Start (Local Development)

1. **Install dependencies**:
```bash
cd app
npm install
```

2. **Run development server**:
```bash
npm run dev
```

Visit `http://localhost:3000`

## Deploy to Dokploy (Production)

### 1. Prepare Your VPS

SSH into your VPS and navigate to your deployment directory:

```bash
cd /path/to/justkeephiking
```

### 2. Build and Deploy

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

## Next Steps After Deployment

1. Set up Supabase (follow instructions in main README.md)
2. Configure email notifications
3. Test API endpoints
4. Add admin authentication
