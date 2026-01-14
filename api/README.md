# justkeephiking API Service

Backend API intended for deployment at `api.justkeephiking.com`. It provides
read-only endpoints for the site configuration and user list.

## Endpoints

- `GET /health` — health check
- `GET /config` — returns the `site_config` row
- `GET /users?page=1&perPage=50` — lists Supabase auth users

## Local Development

```bash
cd api
cp .env.example .env
npm install
npm run dev
```

The server listens on `http://localhost:4000` by default.

## Environment Variables

| Variable | Description |
| --- | --- |
| `SUPABASE_URL` | Supabase project URL |
| `SUPABASE_ANON_KEY` | Supabase anon key (required for `/config` if no service role key is set) |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (required for `/users`) |
| `PORT` | Port to run the API server (default: 4000) |
| `ALLOWED_ORIGINS` | Optional comma-separated CORS allowlist |
