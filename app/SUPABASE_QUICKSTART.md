# Supabase Quick Start Guide

## ✅ Database Migration Complete!

Your Supabase database is now set up with all tables and Row-Level Security policies.

## Verify Your Setup

### 1. Check Tables in Supabase Dashboard

Go to: https://uoopfkziigqnyssdwenz.supabase.co/project/uoopfkziigqnyssdwenz/editor

You should see these tables:
- ✅ profiles
- ✅ site_config (with 1 row of data)
- ✅ trail_updates
- ✅ blog_posts
- ✅ galleries
- ✅ gallery_photos
- ✅ gear_items
- ✅ email_subscribers
- ✅ chat_rooms
- ✅ chat_messages
- ✅ room_members

### 2. Verify site_config Data

Click on **site_config** table and you should see one row with:
- mode: `permit`
- permit_release_utc: `2026-01-13T18:30:00Z`
- my_permit_slot_utc: `2026-01-13T20:48:07Z`
- section_now: `Permitting`
- miles_done: `0`

## Quick Database Operations

### View Current Site Config

Go to SQL Editor and run:
```sql
SELECT * FROM site_config;
```

### Update Site Config (Switch to Trail Mode)

When you're ready to start hiking:
```sql
UPDATE site_config
SET
  mode = 'start',
  start_date_iso = '2026-04-17T07:00:00-07:00',
  section_now = 'Southern California',
  status_state = 'On Trail',
  status_area = 'Campo',
  status_blurb = 'Day 1: Let''s do this!',
  updated_at = NOW()
WHERE id = (SELECT id FROM site_config LIMIT 1);
```

### Create Your First Trail Update

```sql
INSERT INTO trail_updates (
  miles_hiked,
  current_mile,
  location_name,
  note,
  visibility
) VALUES (
  15.2,
  15.2,
  'Lake Morena',
  'First day done! Legs are tired but spirits are high.',
  'public'
);
```

### View All Trail Updates

```sql
SELECT
  location_name,
  current_mile,
  note,
  created_at
FROM trail_updates
ORDER BY created_at DESC;
```

## API Endpoints (After Deployment)

Once deployed, you can interact with your data via API:

### Get Current Config
```bash
curl https://justkeephiking.com/api/config
```

### Get Trail Updates
```bash
curl https://justkeephiking.com/api/trail-updates
```

### Create Trail Update (Unprotected for now)
```bash
curl -X POST https://justkeephiking.com/api/trail-updates \
  -H "Content-Type: application/json" \
  -d '{
    "locationName": "Mount Laguna",
    "currentMile": 42.3,
    "milesHiked": 14.1,
    "note": "Beautiful views of the desert below",
    "visibility": "public"
  }'
```

## Row Level Security (RLS)

Your database is protected with these policies:

- **site_config**: Everyone can read, no one can write (update via SQL Editor for now)
- **trail_updates**: Public posts visible to all, friends/sponsors need auth
- **blog_posts**: Same tiered visibility as trail_updates
- **galleries**: Public galleries visible to all
- **email_subscribers**: Users can only see their own subscription

## Next Steps

1. ✅ Database is ready
2. 🔄 Deploy the app to Dokploy
3. ⏳ Test the landing page - it will fetch from Supabase
4. ⏳ Build admin dashboard for easy updates
5. ⏳ Add authentication for protected content
6. ⏳ Build trail update form with photo upload
7. ⏳ Set up email notifications

## Troubleshooting

### "No rows returned" when querying site_config

Run this INSERT to add the default data:
```sql
INSERT INTO site_config (
  mode, permit_release_utc, my_permit_slot_utc,
  miles_done, section_now, last_checkin, next_town,
  status_state, status_area, status_blurb, status_next
) VALUES (
  'permit',
  '2026-01-13T18:30:00Z',
  '2026-01-13T20:48:07Z',
  0,
  'Permitting',
  'Today',
  'Campo (soon)',
  'Planning / Permit Day',
  'Off-trail (ops planning)',
  'Finalizing my NOBO start date today.',
  'After permit is confirmed.'
);
```

### "Permission denied" errors

- Public users can only read public data
- Use service role key for admin operations
- Check RLS policies in Table Editor → Policies tab
