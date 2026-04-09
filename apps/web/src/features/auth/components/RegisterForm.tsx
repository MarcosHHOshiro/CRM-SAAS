'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { InlineBanner } from '@/components/InlineBanner';
import { TextField } from '@/components/TextField';
import { useToast } from '@/components/ToastProvider';
import { useTranslation } from '@/i18n/use-translation';
import { DEFAULT_PRIVATE_ROUTE } from '@/lib/routes';
import { getApiErrorMessage } from '@/services/api/api-error';

import { useRegisterMutation } from '../hooks/use-auth';
import { createRegisterSchema } from '../schemas/register-schema';
import type { RegisterValues } from '../types/auth';

type RegisterFieldErrors = Partial<Record<keyof RegisterValues, string>>;

const initialValues: RegisterValues = {
  organizationName: '',
  organizationSlug: '',
  name: '',
  email: '',
  password: '',
};

export function RegisterForm() {
  const router = useRouter();
  const registerMutation = useRegisterMutation();
  const [values, setValues] = useState<RegisterValues>(initialValues);
  const [fieldErrors, setFieldErrors] = useState<RegisterFieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const { showToast } = useToast();
  const { messages } = useTranslation();
  const registerSchema = createRegisterSchema(messages);

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

    const result = registerSchema.safeParse(values);

    if (!result.success) {
      const flattened = result.error.flatten().fieldErrors;

      setFieldErrors({
        email: flattened.email?.[0],
        name: flattened.name?.[0],
        organizationName: flattened.organizationName?.[0],
        organizationSlug: flattened.organizationSlug?.[0],
        password: flattened.password?.[0],
      });

      return;
    }

    const parsedValues = {
      ...result.data,
      organizationSlug: result.data.organizationSlug || undefined,
    };

    try {
      await registerMutation.mutateAsync(parsedValues);
      router.replace(DEFAULT_PRIVATE_ROUTE);
    } catch (error) {
      const message = getApiErrorMessage(error, messages.auth.registerForm.fallbackError);

      setFormError(message);
      showToast({ message, tone: 'error' });
    }
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <TextField
        autoComplete="organization"
        error={fieldErrors.organizationName}
        label={messages.auth.registerForm.organizationNameLabel}
        name="organizationName"
        onChange={handleChange}
        placeholder={messages.auth.registerForm.organizationNamePlaceholder}
        value={values.organizationName}
      />
      <TextField
        error={fieldErrors.organizationSlug}
        hint={messages.auth.registerForm.organizationSlugHint}
        label={messages.auth.registerForm.organizationSlugLabel}
        name="organizationSlug"
        onChange={handleChange}
        placeholder={messages.auth.registerForm.organizationSlugPlaceholder}
        value={values.organizationSlug ?? ''}
      />
      <TextField
        autoComplete="name"
        error={fieldErrors.name}
        label={messages.auth.registerForm.nameLabel}
        name="name"
        onChange={handleChange}
        placeholder={messages.auth.registerForm.namePlaceholder}
        value={values.name}
      />
      <TextField
        autoComplete="email"
        error={fieldErrors.email}
        label={messages.auth.registerForm.emailLabel}
        name="email"
        onChange={handleChange}
        placeholder={messages.auth.registerForm.emailPlaceholder}
        type="email"
        value={values.email}
      />
      <TextField
        autoComplete="new-password"
        error={fieldErrors.password}
        hint={messages.auth.registerForm.passwordHint}
        label={messages.auth.registerForm.passwordLabel}
        name="password"
        onChange={handleChange}
        placeholder={messages.auth.registerForm.passwordPlaceholder}
        type="password"
        value={values.password}
      />
      {formError ? (
        <InlineBanner tone="error">{formError}</InlineBanner>
      ) : null}
      <button
        className="inline-flex min-h-12 w-full items-center justify-center rounded-full bg-[var(--accent)] px-5 text-sm font-semibold text-white hover:bg-[var(--accent-strong)] disabled:cursor-not-allowed disabled:opacity-70"
        disabled={registerMutation.isPending}
        type="submit"
      >
        {registerMutation.isPending ? messages.auth.registerForm.submitting : messages.auth.registerForm.submit}
      </button>
      <p className="text-sm text-[var(--foreground-muted)]">
        {messages.auth.registerForm.switchPrompt}{' '}
        <Link className="font-semibold text-[var(--accent)] hover:text-[var(--accent-strong)]" href="/login">
          {messages.auth.registerForm.switchLink}
        </Link>
      </p>
    </form>
  );
}
