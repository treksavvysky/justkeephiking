# Admin Dashboard Setup Guide

This guide walks through setting up the admin dashboard and authentication system for justkeephiking.com.

## Prerequisites

- Supabase project created
- Database migrations executed (see `SUPABASE_QUICKSTART.md`)
- Environment variables configured

## 1. Supabase Storage Setup

### Create Storage Bucket

1. Go to Supabase Dashboard → Storage
2. Create a new bucket named `photos`
3. Set to **Public** bucket
4. Add the following policies:

**SELECT Policy (Public Read)**:
```sql
CREATE POLICY "Public photos are viewable by everyone"
ON storage.objects FOR SELECT
USING ( bucket_id = 'photos' );
```

**INSERT Policy (Authenticated Upload)**:
```sql
CREATE POLICY "Authenticated users can upload photos"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'photos' AND
  auth.role() = 'authenticated'
);
```

**DELETE Policy (Authenticated Delete)**:
```sql
CREATE POLICY "Users can delete their own photos"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'photos' AND
  auth.uid() = owner
);
```

## 2. Authentication Configuration

### Enable Auth Providers

1. Go to Supabase Dashboard → Authentication → Providers
2. Enable **Email** provider (default enabled)
3. Enable **Google** OAuth:
   - Add your Google OAuth credentials
   - Redirect URL: `https://yourproject.supabase.co/auth/v1/callback`
4. Enable **GitHub** OAuth:
   - Add your GitHub OAuth app credentials
   - Redirect URL: `https://yourproject.supabase.co/auth/v1/callback`

### Configure Site URL

1. Go to Authentication → URL Configuration
2. Set **Site URL**: `https://justkeephiking.com` (or your domain)
3. Add **Redirect URLs**:
   - `https://justkeephiking.com/auth/callback`
   - `https://app.justkeephiking.com/auth/callback`
   - `http://localhost:3000/auth/callback` (for local development)

## 3. Database Function: Auto-Create Profile

When a user signs up, automatically create a profile entry:

```sql
-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)),
    'public'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to auto-create profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

## 4. Assign Admin Role

After you sign up with your account:

1. Go to Supabase Dashboard → Table Editor → `profiles`
2. Find your profile row (by email)
3. Change `role` from `public` to `admin`
4. Save

## 5. Environment Variables

Ensure your `.env.local` (development) and `.env` (production) have:

```env
NEXT_PUBLIC_SUPABASE_URL=https://yourproject.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_SITE_URL=https://justkeephiking.com
```

## 6. Test Authentication

1. **Start development server**:
   ```bash
   cd app
   npm run dev
   ```

2. **Test signup**:
   - Navigate to `http://localhost:3000/signup`
   - Create an account with email/password
   - Check Supabase → Authentication → Users to verify user created
   - Check `profiles` table to verify profile auto-created

3. **Assign admin role**:
   - Update your profile's `role` to `admin` in Supabase

4. **Test login**:
   - Navigate to `http://localhost:3000/login`
   - Log in with your credentials
   - Should redirect to `/dashboard`

5. **Test OAuth** (optional):
   - Click "Continue with Google" or "Continue with GitHub"
   - Authorize the app
   - Should redirect to `/dashboard`

## 7. Test Dashboard Features

### Test Site Config Editor

1. Go to `/dashboard/config`
2. Update countdown dates, stats, status
3. Click "Save Changes"
4. Verify changes appear on landing page `/`

### Test Trail Update Form

1. Go to `/dashboard/update`
2. Fill in location, miles, note
3. Upload a photo (test compression)
4. Set visibility (public, friends, sponsors)
5. Click "Post Update"
6. Verify update appears in dashboard recent updates

### Test Quick Actions

1. Go to `/dashboard`
2. If in "trail mode", see quick mile buttons
3. Click "+10 mi" or "+15 mi"
4. Verify miles update immediately

### Test Photo Upload

1. Go to `/dashboard/update`
2. Click photo upload area
3. Select an image (test with >5MB image)
4. Verify compression (should reduce to ~500KB)
5. Verify upload progress indicator
6. Verify preview appears
7. Check Supabase Storage → `photos` bucket to see uploaded file

## 8. Production Deployment

### Update Docker Environment

1. SSH into your VPS
2. Update `/path/to/justkeephiking/app/.env`:
   ```bash
   nano /path/to/justkeephiking/app/.env
   ```
3. Add production environment variables (same as above)

### Rebuild and Deploy

```bash
cd /path/to/justkeephiking
git pull
cd app
docker-compose down
docker-compose up --build -d
```

### Verify Production

1. Visit `https://justkeephiking.com/login`
2. Log in with admin account
3. Test all dashboard features
4. Verify photo uploads work on production

## 9. Mobile Testing

### Test on Mobile Device

1. Open Safari (iOS) or Chrome (Android)
2. Navigate to `https://justkeephiking.com/login`
3. Log in
4. Test trail update form:
   - Check form fields are large enough
   - Test photo upload from camera
   - Verify quick action buttons work with touch
5. Test in airplane mode (offline):
   - Forms should show "offline" message or queue updates

## Troubleshooting

### "Failed to upload photo"

- Check storage bucket exists and is public
- Verify storage policies are correct
- Check browser console for CORS errors

### "Not authenticated" error

- Check middleware is set up (`src/middleware.ts`)
- Verify cookies are enabled in browser
- Check Supabase URL and anon key are correct

### Profile not created on signup

- Check if trigger exists: `SELECT * FROM pg_trigger WHERE tgname = 'on_auth_user_created';`
- Check function exists: `SELECT * FROM pg_proc WHERE proname = 'handle_new_user';`
- Manually create profile if needed

### OAuth callback error

- Verify redirect URLs in Supabase → Authentication → URL Configuration
- Check OAuth provider credentials (Google/GitHub)
- Ensure `NEXT_PUBLIC_SITE_URL` is set correctly

### Dashboard redirects to login

- Check if user is authenticated
- Verify profile exists with correct role
- Check middleware is not blocking authenticated routes

## Next Steps

- Set up email notifications (Phase 3)
- Build blog post editor (Phase 3)
- Implement GPS tracking (Phase 4)
- Add live chat (Phase 4)

---

**Last Updated**: 2026-01-13
**Status**: Phase 2 Complete
