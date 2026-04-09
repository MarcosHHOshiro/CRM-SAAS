'use client';

import Link from 'next/link';
import { useState } from 'react';

import { InlineBanner } from '@/components/InlineBanner';
import { SelectField } from '@/components/SelectField';
import { TextAreaField } from '@/components/TextAreaField';
import { TextField } from '@/components/TextField';

import {
  getOpportunityClientOptions,
  getOpportunityFormOwnerOptions,
  getOpportunityInitialFormValues,
  opportunityFormStageOptions,
  opportunityStageLabels,
} from '../lib/opportunities-format';
import {
  createOpportunitySchema,
  updateOpportunitySchema,
} from '../schemas/opportunity-schema';
import type {
  Opportunity,
  OpportunityClientOption,
  OpportunityFormValues,
  OpportunityOwnerOption,
} from '../types/opportunities';

type OpportunityFormProps = Readonly<{
  clientOptions?: OpportunityClientOption[];
  errorMessage?: string | null;
  isSubmitting: boolean;
  mode: 'create' | 'edit';
  onSubmit: (values: OpportunityFormValues) => Promise<void>;
  opportunity?: Opportunity;
  ownerOptions?: OpportunityOwnerOption[];
  submitLabel: string;
}>;

type OpportunityFormErrors = Partial<Record<keyof OpportunityFormValues, string>>;

export function OpportunityForm({
  clientOptions = [],
  errorMessage,
  isSubmitting,
  mode,
  onSubmit,
  opportunity,
  ownerOptions = [],
  submitLabel,
}: OpportunityFormProps) {
  const [values, setValues] = useState<OpportunityFormValues>(() =>
    getOpportunityInitialFormValues(opportunity),
  );
  const [fieldErrors, setFieldErrors] = useState<OpportunityFormErrors>({});

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

    const schema = mode === 'create' ? createOpportunitySchema : updateOpportunitySchema;
    const result = schema.safeParse(values);

    if (!result.success) {
      const flattened = result.error.flatten().fieldErrors;

      setFieldErrors({
        clientId: flattened.clientId?.[0],
        estimatedValue: flattened.estimatedValue?.[0],
        expectedCloseDate: flattened.expectedCloseDate?.[0],
        notes: flattened.notes?.[0],
        ownerUserId: flattened.ownerUserId?.[0],
        stage: flattened.stage?.[0],
        title: flattened.title?.[0],
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
          error={fieldErrors.title}
          label="Opportunity title"
          name="title"
          onChange={handleChange}
          placeholder="Annual renewal expansion"
          value={values.title}
        />
        <TextField
          error={fieldErrors.estimatedValue}
          hint="Use numbers with up to 2 decimal places."
          label="Estimated value"
          name="estimatedValue"
          onChange={handleChange}
          placeholder="15000"
          value={values.estimatedValue}
        />
        {mode === 'create' ? (
          <SelectField
            error={fieldErrors.clientId}
            label="Client"
            name="clientId"
            onChange={handleChange}
            options={getOpportunityClientOptions(clientOptions)}
            value={values.clientId}
          />
        ) : (
          <div className="rounded-[1.5rem] border border-[var(--border)] bg-white/60 px-4 py-3 text-sm leading-6 text-[var(--foreground-muted)]">
            Client cannot be changed after the opportunity is created.
          </div>
        )}
        <TextField
          error={fieldErrors.expectedCloseDate}
          label="Expected close date"
          name="expectedCloseDate"
          onChange={handleChange}
          type="date"
          value={values.expectedCloseDate}
        />
        {mode === 'create' ? (
          <SelectField
            error={fieldErrors.stage}
            label="Initial stage"
            name="stage"
            onChange={handleChange}
            options={opportunityFormStageOptions.map((option) => ({
              label: opportunityStageLabels[option.value as keyof typeof opportunityStageLabels],
              value: option.value,
            }))}
            value={values.stage}
          />
        ) : (
          <div className="rounded-[1.5rem] border border-[var(--border)] bg-white/60 px-4 py-3 text-sm leading-6 text-[var(--foreground-muted)]">
            Stage changes are handled from the pipeline or detail view.
          </div>
        )}
        {ownerOptions.length > 0 ? (
          <SelectField
            error={fieldErrors.ownerUserId}
            hint="Assign an owner when the opportunity already belongs to someone."
            label="Owner"
            name="ownerUserId"
            onChange={handleChange}
            options={getOpportunityFormOwnerOptions(ownerOptions)}
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
          hint="Optional notes about the opportunity, stakeholders, or next steps."
          label="Notes"
          name="notes"
          onChange={handleChange}
          placeholder="Important commercial context and next actions."
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
          href={opportunity ? `/opportunities/${opportunity.id}` : '/opportunities'}
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
