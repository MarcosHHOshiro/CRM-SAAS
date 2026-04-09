'use client';

import Link from 'next/link';
import { useState } from 'react';

import { InlineBanner } from '@/components/InlineBanner';
import { SelectField } from '@/components/SelectField';
import { TextField } from '@/components/TextField';

import { getClientInitialFormValues, getClientOwnerOptions } from '../lib/clients-format';
import { clientSchema } from '../schemas/client-schema';
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
  const [values, setValues] = useState<ClientFormValues>(() => getClientInitialFormValues(client));
  const [fieldErrors, setFieldErrors] = useState<ClientFormErrors>({});

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
      className="rounded-[2rem] border border-[var(--border)] bg-[var(--card)] p-6 shadow-[var(--shadow-soft)]"
      onSubmit={handleSubmit}
    >
      <div className="grid gap-5 md:grid-cols-2">
        <TextField
          error={fieldErrors.name}
          label="Client name"
          name="name"
          onChange={handleChange}
          placeholder="Northwind Manufacturing"
          value={values.name}
        />
        <TextField
          error={fieldErrors.email}
          label="Email"
          name="email"
          onChange={handleChange}
          placeholder="contact@company.com"
          type="email"
          value={values.email}
        />
        <TextField
          error={fieldErrors.phone}
          label="Phone"
          name="phone"
          onChange={handleChange}
          placeholder="+1 (555) 000-1234"
          value={values.phone}
        />
        <TextField
          error={fieldErrors.company}
          label="Company"
          name="company"
          onChange={handleChange}
          placeholder="Northwind"
          value={values.company}
        />
        {ownerOptions.length > 0 ? (
          <SelectField
            error={fieldErrors.ownerUserId}
            hint="Assign an owner when this client already belongs to a team member."
            label="Owner"
            name="ownerUserId"
            onChange={handleChange}
            options={getClientOwnerOptions(ownerOptions)}
            value={values.ownerUserId}
          />
        ) : (
          <div className="rounded-[1.5rem] border border-[var(--border)] bg-white/60 px-4 py-3 text-sm leading-6 text-[var(--foreground-muted)]">
            Owner assignment is not available for your current access level.
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
          {isSubmitting ? 'Saving...' : submitLabel}
        </button>
        <Link
          className="inline-flex min-h-11 items-center justify-center rounded-full border border-[var(--border)] bg-white/80 px-5 text-sm font-semibold text-[var(--foreground)] hover:border-[var(--accent)] hover:text-[var(--accent)]"
          href={client ? `/clients/${client.id}` : '/clients'}
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
