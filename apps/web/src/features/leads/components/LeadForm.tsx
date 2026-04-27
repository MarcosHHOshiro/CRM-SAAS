'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useTranslation } from '@/i18n/use-translation';

import { InlineBanner } from '@/components/InlineBanner';
import { SelectField } from '@/components/SelectField';
import { TextAreaField } from '@/components/TextAreaField';
import { TextField } from '@/components/TextField';

import {
  getLeadFormStatusOptions,
  getLeadFormOwnerOptions,
  getLeadInitialFormValues,
  getLeadStatusLabels,
} from '../lib/leads-format';
import { leadSchema } from '../schemas/lead-schema';
import type { Lead, LeadFormValues, LeadOwnerOption } from '../types/leads';

type LeadFormProps = Readonly<{
  errorMessage?: string | null;
  isSubmitting: boolean;
  lead?: Lead;
  ownerOptions?: LeadOwnerOption[];
  onSubmit: (values: LeadFormValues) => Promise<void>;
  submitLabel: string;
}>;

type LeadFormErrors = Partial<Record<keyof LeadFormValues, string>>;

export function LeadForm({
  errorMessage,
  isSubmitting,
  lead,
  ownerOptions = [],
  onSubmit,
  submitLabel,
}: LeadFormProps) {
  const { messages } = useTranslation();
  const [values, setValues] = useState<LeadFormValues>(() => getLeadInitialFormValues(lead));
  const [fieldErrors, setFieldErrors] = useState<LeadFormErrors>({});

  function handleChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
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

    const result = leadSchema(messages).safeParse(values);

    if (!result.success) {
      const flattened = result.error.flatten().fieldErrors;

      setFieldErrors({
        company: flattened.company?.[0],
        email: flattened.email?.[0],
        name: flattened.name?.[0],
        notes: flattened.notes?.[0],
        ownerUserId: flattened.ownerUserId?.[0],
        phone: flattened.phone?.[0],
        status: flattened.status?.[0],
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
          label={messages.leads.form.name}
          name="name"
          onChange={handleChange}
          placeholder={messages.leads.form.namePlaceholder}
          value={values.name}
        />
        <TextField
          error={fieldErrors.email}
          label={messages.leads.form.email}
          name="email"
          onChange={handleChange}
          placeholder={messages.leads.form.emailPlaceholder}
          type="email"
          value={values.email}
        />
        <TextField
          error={fieldErrors.phone}
          label={messages.leads.form.phone}
          name="phone"
          onChange={handleChange}
          placeholder={messages.leads.form.phonePlaceholder}
          value={values.phone}
        />
        <TextField
          error={fieldErrors.company}
          label={messages.leads.form.company}
          name="company"
          onChange={handleChange}
          placeholder={messages.leads.form.companyPlaceholder}
          value={values.company}
        />
        <SelectField
          error={fieldErrors.status}
          label={messages.leads.form.status}
          name="status"
          onChange={handleChange}
          options={getLeadFormStatusOptions(messages).map((option) => ({
            label: getLeadStatusLabels(messages)[option.value as keyof ReturnType<typeof getLeadStatusLabels>],
            value: option.value,
          }))}
          value={values.status}
        />
        {ownerOptions.length > 0 ? (
          <SelectField
            error={fieldErrors.ownerUserId}
            hint={messages.leads.form.ownerHint}
            label={messages.leads.form.owner}
            name="ownerUserId"
            onChange={handleChange}
            options={getLeadFormOwnerOptions(ownerOptions, messages)}
            value={values.ownerUserId}
          />
        ) : (
          <div className="rounded-lg border border-[var(--border)] bg-[var(--card-dark)] px-4 py-3 text-sm leading-6 text-[var(--foreground-muted)]">
            {messages.leads.form.ownerUnavailable}
          </div>
        )}
      </div>

      <div className="mt-5">
        <TextAreaField
          error={fieldErrors.notes}
          hint={messages.leads.form.notesHint}
          label={messages.leads.form.notes}
          name="notes"
          onChange={handleChange}
          placeholder={messages.leads.form.notesPlaceholder}
          rows={6}
          value={values.notes}
        />
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
          href={lead ? `/leads/${lead.id}` : '/leads'}
        >
          {messages.common.actions.cancel}
        </Link>
      </div>
    </form>
  );
}
