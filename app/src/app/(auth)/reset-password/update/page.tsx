import UpdatePasswordForm from '@/components/auth/UpdatePasswordForm';

export default function UpdatePasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Set new password</h1>
          <p className="text-muted">Enter your new password below</p>
        </div>
        <UpdatePasswordForm />
      </div>
    </div>
  );
}
