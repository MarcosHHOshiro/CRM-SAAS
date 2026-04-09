import { AuthCard } from '@/features/auth/components/AuthCard';
import { RegisterForm } from '@/features/auth/components/RegisterForm';
import { getRequestI18n } from '@/i18n/request';

export default async function RegisterPage() {
  const { messages } = await getRequestI18n();

  return (
    <AuthCard
      description={messages.auth.registerPage.description}
      title={messages.auth.registerPage.title}
    >
      <RegisterForm />
    </AuthCard>
  );
}
