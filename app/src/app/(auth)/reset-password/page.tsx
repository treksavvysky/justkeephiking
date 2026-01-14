import ResetPasswordForm from '@/components/auth/ResetPasswordForm';

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Reset password</h1>
          <p className="text-muted">Enter your email to receive a reset link</p>
        </div>
        <ResetPasswordForm />
      </div>
    </div>
  );
}
