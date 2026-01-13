# Supabase Setup Instructions

## 1. Execute Database Migration

Open your Supabase dashboard and follow these steps:

1. Navigate to **SQL Editor** in the left sidebar
2. Click **New Query**
3. Copy the entire contents of `migrations/001_initial_schema.sql`
4. Paste into the SQL Editor
5. Click **Run** or press `Ctrl+Enter`

This will create:
- All database tables (profiles, site_config, trail_updates, blog_posts, etc.)
- Row Level Security policies for access control
- Default site_config data matching your current landing page
- Indexes for performance
- Triggers for automatic timestamp updates

## 2. Verify Migration

After running the migration, verify it worked:

1. Go to **Table Editor** in Supabase dashboard
2. You should see these tables:
   - profiles
   - site_config
   - trail_updates
   - blog_posts
   - galleries
   - gallery_photos
   - gear_items
   - email_subscribers
   - chat_rooms
   - chat_messages
   - room_members

3. Click on **site_config** table - you should see one row with your current permit countdown data

## 3. Set Up Authentication (Later)

Once you're ready to add admin features:

1. Go to **Authentication** → **Providers** in Supabase dashboard
2. Enable Email provider (or Google/GitHub for OAuth)
3. Create your admin account:
   - Go to **Authentication** → **Users**
   - Click **Add User**
   - Enter your email and password
   - Note the User ID (UUID)

4. Update your profile role to admin:
   - Go to **Table Editor** → **profiles**
   - Find your user record (it will be auto-created on first login)
   - Edit the `role` field to `'admin'`

## 4. Row Level Security (RLS)

The migration automatically enables RLS on all tables with these policies:

- **site_config**: Everyone can read, only admins can update
- **trail_updates**: Public posts visible to all, friends posts to authenticated users, sponsor posts to sponsors only
- **blog_posts**: Same visibility tiers as trail_updates
- **galleries**: Public galleries visible to all
- **gear_items**: Anyone can view, admins can manage
- **email_subscribers**: Users can only see/manage their own subscription
- **chat**: Only room members can see rooms and messages

## 5. Testing the Connection

After executing the migration, the Next.js app will automatically connect using the credentials in `.env.local`.

You can test the connection by checking the landing page - it will soon fetch data from Supabase instead of using hardcoded values.

## Troubleshooting

**Error: "relation already exists"**
- You may have already run the migration
- Drop all tables and re-run, or skip to the next step

**Error: "permission denied"**
- Check that your API keys in `.env.local` match your Supabase dashboard
- Ensure you're using the service role key for admin operations

**Tables created but no data**
- Check the `site_config` table - it should have one row
- If empty, run just the INSERT statement from the migration file
