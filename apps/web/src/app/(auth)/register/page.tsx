import { AuthCard } from '@/features/auth/components/AuthCard';
import { RegisterForm } from '@/features/auth/components/RegisterForm';

export default function RegisterPage() {
  return (
    <AuthCard
      description="Create the first organization workspace and owner account to start using the CRM."
      title="Create your workspace"
    >
      <RegisterForm />
    </AuthCard>
  );
}
