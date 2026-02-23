import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const next = requestUrl.searchParams.get('next') || '/dashboard';

  if (code) {
    const supabase = await createClient();
    await supabase.auth.exchangeCodeForSession(code);
  }

  const origin = process.env.NEXT_PUBLIC_APP_URL || requestUrl.origin;
  return NextResponse.redirect(new URL(next, origin));
}
