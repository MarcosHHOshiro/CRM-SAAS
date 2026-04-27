'use client';

import Link from 'next/link';
import { useState } from 'react';

import { InlineBanner } from '@/components/InlineBanner';
import { SelectField } from '@/components/SelectField';
import { TextField } from '@/components/TextField';
import { useTranslation } from '@/i18n/use-translation';

import { getClientInitialFormValues, getClientOwnerOptions } from '../lib/clients-format';
import { createClientSchema } from '../schemas/client-schema';
import type { Client, ClientFormValues, ClientOwnerOption } from '../types/clients';

type ClientFormProps = Readonly<{
  client?: Client;
  errorMessage?: string | null;
  isSubmitting: boolean;
  onSubmit: (values: ClientFormValues) => Promise<void>;
  ownerOptions?: ClientOwnerOption[];
  submitLabel: string;
}>;

type ClientFormErrors = Partial<Record<keyof ClientFormValues, string>>;

export function ClientForm({
  client,
  errorMessage,
  isSubmitting,
  onSubmit,
  ownerOptions = [],
  submitLabel,
}: ClientFormProps) {
  const { messages } = useTranslation();
  const [values, setValues] = useState<ClientFormValues>(() => getClientInitialFormValues(client));
  const [fieldErrors, setFieldErrors] = useState<ClientFormErrors>({});
  const clientSchema = createClientSchema(messages);

  function handleChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) {
    const { name, value } = event.target;

    setValues((currentValues) => ({
      ...currentValues,
      [name]: value,
    }));
    setFieldErrors((currentErrors) => ({
      ...currentErrors,
      [name]: undefined,
    }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const result = clientSchema.safeParse(values);

    if (!result.success) {
      const flattened = result.error.flatten().fieldErrors;

      setFieldErrors({
        company: flattened.company?.[0],
        email: flattened.email?.[0],
        name: flattened.name?.[0],
        ownerUserId: flattened.ownerUserId?.[0],
        phone: flattened.phone?.[0],
      });

      return;
    }

    await onSubmit(result.data);
  }

  return (
    <form
      className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-6 shadow-[var(--shadow-soft)]"
      onSubmit={handleSubmit}
    >
      <div className="grid gap-5 md:grid-cols-2">
        <TextField
          error={fieldErrors.name}
          label={messages.clients.form.name}
          name="name"
          onChange={handleChange}
          placeholder={messages.clients.form.namePlaceholder}
          value={values.name}
        />
        <TextField
          error={fieldErrors.email}
          label={messages.clients.form.email}
          name="email"
          onChange={handleChange}
          placeholder={messages.clients.form.emailPlaceholder}
          type="email"
          value={values.email}
        />
        <TextField
          error={fieldErrors.phone}
          label={messages.clients.form.phone}
          name="phone"
          onChange={handleChange}
          placeholder={messages.clients.form.phonePlaceholder}
          value={values.phone}
        />
        <TextField
          error={fieldErrors.company}
          label={messages.clients.form.company}
          name="company"
          onChange={handleChange}
          placeholder={messages.clients.form.companyPlaceholder}
          value={values.company}
        />
        {ownerOptions.length > 0 ? (
          <SelectField
            error={fieldErrors.ownerUserId}
            hint={messages.clients.form.ownerHint}
            label={messages.clients.form.owner}
            name="ownerUserId"
            onChange={handleChange}
            options={getClientOwnerOptions(ownerOptions, messages)}
            value={values.ownerUserId}
          />
        ) : (
          <div className="rounded-lg border border-[var(--border)] bg-[var(--card-dark)] px-4 py-3 text-sm leading-6 text-[var(--foreground-muted)]">
            {messages.clients.form.ownerUnavailable}
          </div>
        )}
      </div>

      {errorMessage ? (
        <div className="mt-5">
          <InlineBanner tone="error">{errorMessage}</InlineBanner>
        </div>
      ) : null}

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          className="inline-flex min-h-11 items-center justify-center rounded-full bg-[var(--accent)] px-5 text-sm font-semibold text-white hover:bg-[var(--accent-strong)] disabled:cursor-not-allowed disabled:opacity-70"
          disabled={isSubmitting}
          type="submit"
        >
          {isSubmitting ? messages.common.actions.saving : submitLabel}
        </button>
        <Link
          className="inline-flex min-h-11 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--card-strong)] px-5 text-sm font-semibold text-[var(--foreground)] hover:border-[var(--accent)] hover:text-[var(--accent)]"
          href={client ? `/clients/${client.id}` : '/clients'}
        >
          {messages.common.actions.cancel}
        </Link>
      </div>
    </form>
  );
}
