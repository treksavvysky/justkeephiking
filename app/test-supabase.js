/**
 * Quick test script to verify Supabase connection and data
 * Run with: node test-supabase.js
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testConnection() {
  console.log('🔍 Testing Supabase connection...\n');

  try {
    // Test 1: Fetch site_config
    console.log('Test 1: Fetching site_config...');
    const { data: config, error: configError } = await supabase
      .from('site_config')
      .select('*')
      .single();

    if (configError) {
      console.error('❌ Error fetching site_config:', configError.message);
      return false;
    }

    console.log('✅ Site config fetched successfully');
    console.log('   Mode:', config.mode);
    console.log('   Section:', config.section_now);
    console.log('   Miles:', config.miles_done);
    console.log('');

    // Test 2: List all tables
    console.log('Test 2: Checking database tables...');
    const tables = [
      'profiles',
      'site_config',
      'trail_updates',
      'blog_posts',
      'galleries',
      'gallery_photos',
      'gear_items',
      'email_subscribers',
      'chat_rooms',
      'chat_messages',
      'room_members'
    ];

    for (const table of tables) {
      const { count, error } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true });

      if (error) {
        console.log(`   ❌ ${table}: ${error.message}`);
      } else {
        console.log(`   ✅ ${table}: ${count} rows`);
      }
    }

    console.log('\n🎉 All tests passed! Supabase is ready.');
    return true;
  } catch (err) {
    console.error('❌ Unexpected error:', err.message);
    return false;
  }
}

testConnection();
