'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

import { TextField } from '@/components/TextField';
import { useToast } from '@/components/ToastProvider';
import { useTranslation } from '@/i18n/use-translation';
import { DEFAULT_PRIVATE_ROUTE } from '@/lib/routes';
import { getApiErrorMessage } from '@/services/api/api-error';

import { useLoginMutation } from '../hooks/use-auth';
import { createLoginSchema } from '../schemas/login-schema';
import type { LoginValues } from '../types/auth';

type LoginFieldErrors = Partial<Record<keyof LoginValues, string>>;

const initialValues: LoginValues = {
  email: '',
  password: '',
};

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const loginMutation = useLoginMutation();
  const [values, setValues] = useState<LoginValues>(initialValues);
  const [fieldErrors, setFieldErrors] = useState<LoginFieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const { showToast } = useToast();
  const { messages } = useTranslation();
  const loginSchema = createLoginSchema(messages);

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;

    setValues((currentValues) => ({
      ...currentValues,
      [name]: value,
    }));

    setFieldErrors((currentErrors) => ({
      ...currentErrors,
      [name]: undefined,
    }));
    setFormError(null);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const result = loginSchema.safeParse(values);

    if (!result.success) {
      const flattened = result.error.flatten().fieldErrors;

      setFieldErrors({
        email: flattened.email?.[0],
        password: flattened.password?.[0],
      });

      return;
    }

    try {
      await loginMutation.mutateAsync(result.data);
      router.replace(searchParams.get('next') || DEFAULT_PRIVATE_ROUTE);
    } catch (error) {
      const message = getApiErrorMessage(error, messages.auth.loginForm.fallbackError);

      setFormError(message);
      showToast({ message, tone: 'error' });
    }
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <TextField
        autoComplete="email"
        error={fieldErrors.email}
        hideErrorIcon
        label={messages.auth.loginForm.emailLabel}
        name="email"
        onChange={handleChange}
        type="email"
        value={values.email}
      />
      <TextField
        autoComplete="current-password"
        error={fieldErrors.password}
        hideErrorIcon
        label={messages.auth.loginForm.passwordLabel}
        name="password"
        onChange={handleChange}
        type="password"
        value={values.password}
      />
      {formError ? <p className="sr-only">{formError}</p> : null}
      <button
        className="inline-flex min-h-12 w-full items-center justify-center rounded-lg bg-[var(--accent)] px-5 text-sm font-semibold text-white transition-colors hover:bg-[var(--accent-strong)] disabled:cursor-not-allowed disabled:opacity-70"
        disabled={loginMutation.isPending}
        type="submit"
      >
        {loginMutation.isPending ? messages.auth.loginForm.submitting : messages.auth.loginForm.submit}
      </button>
      <p className="text-sm leading-6 text-[var(--foreground-muted)]">
        {messages.auth.loginForm.switchPrompt}{' '}
        <Link className="font-semibold text-[var(--accent)] hover:text-[var(--accent-strong)]" href="/register">
          {messages.auth.loginForm.switchLink}
        </Link>
      </p>
    </form>
  );
}
