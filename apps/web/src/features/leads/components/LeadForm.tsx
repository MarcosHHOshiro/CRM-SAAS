'use client';

import Link from 'next/link';
import { useState } from 'react';

import { InlineBanner } from '@/components/InlineBanner';
import { SelectField } from '@/components/SelectField';
import { TextAreaField } from '@/components/TextAreaField';
import { TextField } from '@/components/TextField';

import {
  getLeadFormOwnerOptions,
  getLeadInitialFormValues,
  leadFormStatusOptions,
  leadStatusLabels,
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

    const result = leadSchema.safeParse(values);

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
      className="rounded-[2rem] border border-[var(--border)] bg-[var(--card)] p-6 shadow-[var(--shadow-soft)]"
      onSubmit={handleSubmit}
    >
      <div className="grid gap-5 md:grid-cols-2">
        <TextField
          error={fieldErrors.name}
          label="Lead name"
          name="name"
          onChange={handleChange}
          placeholder="Jamie Rivera"
          value={values.name}
        />
        <TextField
          error={fieldErrors.email}
          label="Email"
          name="email"
          onChange={handleChange}
          placeholder="jamie@company.com"
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
        <SelectField
          error={fieldErrors.status}
          label="Status"
          name="status"
          onChange={handleChange}
          options={leadFormStatusOptions.map((option) => ({
            label: leadStatusLabels[option.value as keyof typeof leadStatusLabels],
            value: option.value,
          }))}
          value={values.status}
        />
        {ownerOptions.length > 0 ? (
          <SelectField
            error={fieldErrors.ownerUserId}
            hint="Assign an owner when the lead already belongs to someone."
            label="Owner"
            name="ownerUserId"
            onChange={handleChange}
            options={getLeadFormOwnerOptions(ownerOptions)}
            value={values.ownerUserId}
          />
        ) : (
          <div className="rounded-[1.5rem] border border-[var(--border)] bg-white/60 px-4 py-3 text-sm leading-6 text-[var(--foreground-muted)]">
            Owner assignment is not available for your current access level.
          </div>
        )}
      </div>

      <div className="mt-5">
        <TextAreaField
          error={fieldErrors.notes}
          hint="Optional internal notes about the lead."
          label="Notes"
          name="notes"
          onChange={handleChange}
          placeholder="Important context, recent touchpoints, or qualification notes."
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
          {isSubmitting ? 'Saving...' : submitLabel}
        </button>
        <Link
          className="inline-flex min-h-11 items-center justify-center rounded-full border border-[var(--border)] bg-white/80 px-5 text-sm font-semibold text-[var(--foreground)] hover:border-[var(--accent)] hover:text-[var(--accent)]"
          href={lead ? `/leads/${lead.id}` : '/leads'}
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
