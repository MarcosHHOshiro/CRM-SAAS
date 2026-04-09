import { AuthCard } from '@/features/auth/components/AuthCard';
import { LoginForm } from '@/features/auth/components/LoginForm';

export default function LoginPage() {
  return (
    <AuthCard
      description="Sign in with the owner or team member account already registered in your organization."
      title="Welcome back"
    >
      <LoginForm />
    </AuthCard>
  );
}
