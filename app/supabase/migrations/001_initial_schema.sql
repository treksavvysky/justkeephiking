-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types
CREATE TYPE user_role AS ENUM ('public', 'friend', 'sponsor', 'admin');
CREATE TYPE sponsor_tier AS ENUM ('bronze', 'silver', 'gold', 'platinum');
CREATE TYPE visibility_level AS ENUM ('public', 'friends', 'sponsors');
CREATE TYPE email_frequency AS ENUM ('realtime', 'daily', 'weekly');

-- User Profiles (extends Supabase auth.users)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role user_role DEFAULT 'public',
  sponsor_tier sponsor_tier,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Site Configuration (replaces site.json)
CREATE TABLE site_config (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  mode TEXT NOT NULL CHECK (mode IN ('permit', 'start')),
  permit_release_utc TIMESTAMPTZ,
  my_permit_slot_utc TIMESTAMPTZ,
  start_date_iso TIMESTAMPTZ,
  miles_done DECIMAL(6,2) DEFAULT 0,
  section_now TEXT,
  last_checkin TEXT,
  next_town TEXT,
  status_state TEXT,
  status_area TEXT,
  status_blurb TEXT,
  status_next TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  updated_by UUID REFERENCES profiles(id)
);

-- Insert default config
INSERT INTO site_config (
  mode,
  permit_release_utc,
  my_permit_slot_utc,
  start_date_iso,
  miles_done,
  section_now,
  last_checkin,
  next_town,
  status_state,
  status_area,
  status_blurb,
  status_next
) VALUES (
  'permit',
  '2026-01-13T18:30:00Z',
  '2026-01-13T20:48:07Z',
  NULL,
  0,
  'Permitting',
  'Today',
  'Campo (soon)',
  'Planning / Permit Day',
  'Off-trail (ops planning)',
  'Finalizing my NOBO start date today.',
  'After permit is confirmed.'
);

-- Trail Updates (micro-posts from trail)
CREATE TABLE trail_updates (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  miles_hiked DECIMAL(6,2),
  current_mile DECIMAL(6,2),
  location_name TEXT NOT NULL,
  location_lat DECIMAL(10,8),
  location_lon DECIMAL(11,8),
  note TEXT,
  photo_url TEXT,
  visibility visibility_level DEFAULT 'public',
  author_id UUID REFERENCES profiles(id)
);

-- Blog Posts (long-form narratives)
CREATE TABLE blog_posts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  featured_image TEXT,
  published BOOLEAN DEFAULT false,
  visibility visibility_level DEFAULT 'public',
  author_id UUID REFERENCES profiles(id)
);

-- Photo Galleries
CREATE TABLE galleries (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  title TEXT NOT NULL,
  description TEXT,
  visibility visibility_level DEFAULT 'public'
);

CREATE TABLE gallery_photos (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  gallery_id UUID REFERENCES galleries(id) ON DELETE CASCADE,
  photo_url TEXT NOT NULL,
  caption TEXT,
  taken_at TIMESTAMPTZ,
  order_index INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Gear Lists
CREATE TABLE gear_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
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
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  frequency email_frequency DEFAULT 'weekly',
  subscribed BOOLEAN DEFAULT true,
  verification_token TEXT,
  verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Chat Rooms (secured, invite-only)
CREATE TABLE chat_rooms (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT DEFAULT 'private' CHECK (type IN ('public', 'friends', 'private')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE chat_messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
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

-- Enable Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE trail_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE galleries ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE gear_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE room_members ENABLE ROW LEVEL SECURITY;

-- RLS Policies for site_config (everyone can read, only admins can write)
CREATE POLICY "Anyone can read site config" ON site_config
  FOR SELECT USING (true);

CREATE POLICY "Only admins can update site config" ON site_config
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- RLS Policies for trail_updates
CREATE POLICY "Public updates are viewable by everyone" ON trail_updates
  FOR SELECT USING (visibility = 'public');

CREATE POLICY "Friends updates viewable by authenticated users" ON trail_updates
  FOR SELECT USING (
    visibility = 'friends' AND auth.uid() IS NOT NULL
  );

CREATE POLICY "Sponsor updates viewable by sponsors" ON trail_updates
  FOR SELECT USING (
    visibility = 'sponsors' AND
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('sponsor', 'admin')
    )
  );

CREATE POLICY "Admins can insert trail updates" ON trail_updates
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- RLS Policies for blog_posts (similar to trail_updates)
CREATE POLICY "Published public posts viewable by everyone" ON blog_posts
  FOR SELECT USING (published = true AND visibility = 'public');

CREATE POLICY "Published friends posts viewable by authenticated" ON blog_posts
  FOR SELECT USING (
    published = true AND visibility = 'friends' AND auth.uid() IS NOT NULL
  );

CREATE POLICY "Published sponsor posts viewable by sponsors" ON blog_posts
  FOR SELECT USING (
    published = true AND visibility = 'sponsors' AND
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role IN ('sponsor', 'admin')
    )
  );

CREATE POLICY "Admins can manage blog posts" ON blog_posts
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- RLS Policies for galleries
CREATE POLICY "Public galleries viewable by everyone" ON galleries
  FOR SELECT USING (visibility = 'public');

CREATE POLICY "Gallery photos inherit gallery visibility" ON gallery_photos
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM galleries
      WHERE galleries.id = gallery_photos.gallery_id
      AND galleries.visibility = 'public'
    )
  );

-- RLS Policies for gear_items (public read)
CREATE POLICY "Anyone can view gear" ON gear_items
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage gear" ON gear_items
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- RLS Policies for email_subscribers (users can only see their own)
CREATE POLICY "Users can manage their own subscription" ON email_subscribers
  FOR ALL USING (
    email = (SELECT email FROM auth.users WHERE id = auth.uid())
  );

-- RLS Policies for chat (friends and sponsors only)
CREATE POLICY "Room members can view their rooms" ON chat_rooms
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM room_members
      WHERE room_members.room_id = chat_rooms.id
      AND room_members.user_id = auth.uid()
    )
  );

CREATE POLICY "Room members can view messages" ON chat_messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM room_members
      WHERE room_members.room_id = chat_messages.room_id
      AND room_members.user_id = auth.uid()
    )
  );

CREATE POLICY "Room members can send messages" ON chat_messages
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM room_members
      WHERE room_members.room_id = room_id
      AND room_members.user_id = auth.uid()
    )
  );

-- Create indexes for better query performance
CREATE INDEX idx_trail_updates_created_at ON trail_updates(created_at DESC);
CREATE INDEX idx_trail_updates_visibility ON trail_updates(visibility);
CREATE INDEX idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX idx_blog_posts_published ON blog_posts(published);
CREATE INDEX idx_gallery_photos_gallery_id ON gallery_photos(gallery_id);
CREATE INDEX idx_chat_messages_room_id ON chat_messages(room_id);
CREATE INDEX idx_room_members_user_id ON room_members(user_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON blog_posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_site_config_updated_at BEFORE UPDATE ON site_config
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
