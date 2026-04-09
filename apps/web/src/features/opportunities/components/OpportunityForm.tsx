'use client';

import Link from 'next/link';
import { useState } from 'react';

import { InlineBanner } from '@/components/InlineBanner';
import { SelectField } from '@/components/SelectField';
import { TextAreaField } from '@/components/TextAreaField';
import { TextField } from '@/components/TextField';
import { useTranslation } from '@/i18n/use-translation';

import {
  getOpportunityClientOptions,
  getOpportunityFormStageOptions,
  getOpportunityFormOwnerOptions,
  getOpportunityInitialFormValues,
  getOpportunityStageLabels,
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
  const { messages } = useTranslation();
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

    const schema = mode === 'create' ? createOpportunitySchema(messages) : updateOpportunitySchema(messages);
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
          label={messages.opportunities.form.title}
          name="title"
          onChange={handleChange}
          placeholder={messages.opportunities.form.titlePlaceholder}
          value={values.title}
        />
        <TextField
          error={fieldErrors.estimatedValue}
          hint={messages.opportunities.form.estimatedValueHint}
          label={messages.opportunities.form.estimatedValue}
          name="estimatedValue"
          onChange={handleChange}
          placeholder="15000"
          value={values.estimatedValue}
        />
        {mode === 'create' ? (
          <SelectField
            error={fieldErrors.clientId}
            label={messages.opportunities.form.client}
            name="clientId"
            onChange={handleChange}
            options={getOpportunityClientOptions(clientOptions, messages)}
            value={values.clientId}
          />
        ) : (
          <div className="rounded-[1.5rem] border border-[var(--border)] bg-white/60 px-4 py-3 text-sm leading-6 text-[var(--foreground-muted)]">
            {messages.opportunities.form.clientReadonly}
          </div>
        )}
        <TextField
          error={fieldErrors.expectedCloseDate}
          label={messages.opportunities.form.expectedCloseDate}
          name="expectedCloseDate"
          onChange={handleChange}
          type="date"
          value={values.expectedCloseDate}
        />
        {mode === 'create' ? (
          <SelectField
            error={fieldErrors.stage}
            label={messages.opportunities.form.initialStage}
            name="stage"
            onChange={handleChange}
            options={getOpportunityFormStageOptions(messages).map((option) => ({
              label: getOpportunityStageLabels(messages)[option.value as keyof ReturnType<typeof getOpportunityStageLabels>],
              value: option.value,
            }))}
            value={values.stage}
          />
        ) : (
          <div className="rounded-[1.5rem] border border-[var(--border)] bg-white/60 px-4 py-3 text-sm leading-6 text-[var(--foreground-muted)]">
            {messages.opportunities.form.stageReadonly}
          </div>
        )}
        {ownerOptions.length > 0 ? (
          <SelectField
            error={fieldErrors.ownerUserId}
            hint={messages.opportunities.form.ownerHint}
            label={messages.opportunities.form.owner}
            name="ownerUserId"
            onChange={handleChange}
            options={getOpportunityFormOwnerOptions(ownerOptions, messages)}
            value={values.ownerUserId}
          />
        ) : (
          <div className="rounded-[1.5rem] border border-[var(--border)] bg-white/60 px-4 py-3 text-sm leading-6 text-[var(--foreground-muted)]">
            {messages.opportunities.form.ownerUnavailable}
          </div>
        )}
      </div>

      <div className="mt-5">
        <TextAreaField
          error={fieldErrors.notes}
          hint={messages.opportunities.form.notesHint}
          label={messages.opportunities.form.notes}
          name="notes"
          onChange={handleChange}
          placeholder={messages.opportunities.form.notesPlaceholder}
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
          className="inline-flex min-h-11 items-center justify-center rounded-full border border-[var(--border)] bg-white/80 px-5 text-sm font-semibold text-[var(--foreground)] hover:border-[var(--accent)] hover:text-[var(--accent)]"
          href={opportunity ? `/opportunities/${opportunity.id}` : '/opportunities'}
        >
          {messages.common.actions.cancel}
        </Link>
      </div>
    </form>
  );
}
