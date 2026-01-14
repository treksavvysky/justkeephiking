import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import SignupForm from '@/components/auth/SignupForm';

export default async function SignupPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Redirect if already logged in
  if (user) {
    redirect('/dashboard');
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Create account</h1>
          <p className="text-muted">Join the adventure</p>
        </div>
        <SignupForm />
      </div>
    </div>
  );
}
