import { AuthCard } from '@/features/auth/components/AuthCard';
import { LoginForm } from '@/features/auth/components/LoginForm';
import { getRequestI18n } from '@/i18n/request';

export default async function LoginPage() {
  const { messages } = await getRequestI18n();

  return (
    <AuthCard
      description={messages.auth.loginPage.description}
      title={messages.auth.loginPage.title}
    >
      <LoginForm />
    </AuthCard>
  );
}
