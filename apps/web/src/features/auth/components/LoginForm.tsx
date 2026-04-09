'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

import { InlineBanner } from '@/components/InlineBanner';
import { TextField } from '@/components/TextField';
import { useToast } from '@/components/ToastProvider';
import { DEFAULT_PRIVATE_ROUTE } from '@/lib/routes';
import { getApiErrorMessage } from '@/services/api/api-error';

import { useLoginMutation } from '../hooks/use-auth';
import { loginSchema } from '../schemas/login-schema';
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
      const message = getApiErrorMessage(error, 'Unable to sign in right now.');

      setFormError(message);
      showToast({ message, tone: 'error' });
    }
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <TextField
        autoComplete="email"
        error={fieldErrors.email}
        label="Work email"
        name="email"
        onChange={handleChange}
        placeholder="you@company.com"
        type="email"
        value={values.email}
      />
      <TextField
        autoComplete="current-password"
        error={fieldErrors.password}
        label="Password"
        name="password"
        onChange={handleChange}
        placeholder="Enter your password"
        type="password"
        value={values.password}
      />
      {formError ? (
        <InlineBanner tone="error">{formError}</InlineBanner>
      ) : null}
      <button
        className="inline-flex min-h-12 w-full items-center justify-center rounded-full bg-[var(--accent)] px-5 text-sm font-semibold text-white hover:bg-[var(--accent-strong)] disabled:cursor-not-allowed disabled:opacity-70"
        disabled={loginMutation.isPending}
        type="submit"
      >
        {loginMutation.isPending ? 'Signing in...' : 'Sign in'}
      </button>
      <p className="text-sm text-[var(--foreground-muted)]">
        New to Pulse CRM?{' '}
        <Link className="font-semibold text-[var(--accent)] hover:text-[var(--accent-strong)]" href="/register">
          Create your workspace
        </Link>
      </p>
    </form>
  );
}
