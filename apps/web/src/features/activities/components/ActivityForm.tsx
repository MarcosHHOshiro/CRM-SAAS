'use client';

import { useMemo, useState } from 'react';

import { InlineBanner } from '@/components/InlineBanner';
import { SelectField } from '@/components/SelectField';
import { TextAreaField } from '@/components/TextAreaField';
import { useTranslation } from '@/i18n/use-translation';

import {
  getActivityFormTypeOptions,
  getActivityTypeLabels,
  getActivityClientOptions,
  getActivityInitialFormValues,
  getActivityLeadOptions,
  getActivityOpportunityOptions,
} from '../lib/activities-format';
import { activitySchema } from '../schemas/activity-schema';
import type {
  ActivityClientOption,
  ActivityFormValues,
  ActivityLeadOption,
  ActivityOpportunityOption,
} from '../types/activities';

type ActivityFormProps = Readonly<{
  clientOptions?: ActivityClientOption[];
  errorMessage?: string | null;
  isSubmitting: boolean;
  leadOptions?: ActivityLeadOption[];
  onSubmit: (values: ActivityFormValues) => Promise<void>;
  opportunityOptions?: ActivityOpportunityOption[];
}>;

type ActivityFormErrors = Partial<Record<keyof ActivityFormValues, string>>;

export function ActivityForm({
  clientOptions = [],
  errorMessage,
  isSubmitting,
  leadOptions = [],
  onSubmit,
  opportunityOptions = [],
}: ActivityFormProps) {
  const { messages } = useTranslation();
  const [values, setValues] = useState<ActivityFormValues>(() =>
    getActivityInitialFormValues(),
  );
  const [fieldErrors, setFieldErrors] = useState<ActivityFormErrors>({});

  const filteredOpportunityOptions = useMemo(() => {
    if (!values.clientId) {
      return opportunityOptions;
    }

    return opportunityOptions.filter((opportunity) => opportunity.clientId === values.clientId);
  }, [opportunityOptions, values.clientId]);

  function handleChange(
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLSelectElement>,
  ) {
    const { name, value } = event.target;

    setValues((currentValues) => {
      const nextValues = {
        ...currentValues,
        [name]: value,
      };

      if (name === 'clientId' && currentValues.opportunityId) {
        const stillMatches = opportunityOptions.some(
          (opportunity) =>
            opportunity.id === currentValues.opportunityId &&
            (!value || opportunity.clientId === value),
        );

        if (!stillMatches) {
          nextValues.opportunityId = '';
        }
      }

      return nextValues;
    });

    setFieldErrors((currentErrors) => ({
      ...currentErrors,
      [name]: undefined,
    }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const result = activitySchema(messages).safeParse(values);

    if (!result.success) {
      const flattened = result.error.flatten().fieldErrors;

      setFieldErrors({
        clientId: flattened.clientId?.[0],
        description: flattened.description?.[0],
        leadId: flattened.leadId?.[0],
        opportunityId: flattened.opportunityId?.[0],
        type: flattened.type?.[0],
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
      <div className="grid gap-4 md:grid-cols-2">
        <SelectField
          error={fieldErrors.type}
          label={messages.activities.form.type}
          name="type"
          onChange={handleChange}
          options={getActivityFormTypeOptions(messages).map((option) => ({
            label: getActivityTypeLabels(messages)[option.value as keyof ReturnType<typeof getActivityTypeLabels>],
            value: option.value,
          }))}
          value={values.type}
        />
        <SelectField
          error={fieldErrors.leadId}
          label={messages.activities.form.lead}
          name="leadId"
          onChange={handleChange}
          options={getActivityLeadOptions(leadOptions, messages)}
          value={values.leadId}
        />
        <SelectField
          error={fieldErrors.clientId}
          label={messages.activities.form.client}
          name="clientId"
          onChange={handleChange}
          options={getActivityClientOptions(clientOptions, messages)}
          value={values.clientId}
        />
        <SelectField
          error={fieldErrors.opportunityId}
          label={messages.activities.form.opportunity}
          name="opportunityId"
          onChange={handleChange}
          options={getActivityOpportunityOptions(filteredOpportunityOptions, messages)}
          value={values.opportunityId}
        />
      </div>

      <div className="mt-5">
        <TextAreaField
          error={fieldErrors.description}
          hint={messages.activities.form.descriptionHint}
          label={messages.activities.form.description}
          name="description"
          onChange={handleChange}
          placeholder={messages.activities.form.descriptionPlaceholder}
          rows={6}
          value={values.description}
        />
      </div>

      {errorMessage ? (
        <div className="mt-5">
          <InlineBanner tone="error">{errorMessage}</InlineBanner>
        </div>
      ) : null}

      <div className="mt-6">
        <button
          className="inline-flex min-h-11 items-center justify-center rounded-full bg-[var(--accent)] px-5 text-sm font-semibold text-white hover:bg-[var(--accent-strong)] disabled:cursor-not-allowed disabled:opacity-70"
          disabled={isSubmitting}
          type="submit"
        >
          {isSubmitting ? messages.common.actions.saving : messages.activities.form.submit}
        </button>
      </div>
    </form>
  );
}
