'use client';

import { useMemo, useState } from 'react';

import { InlineBanner } from '@/components/InlineBanner';
import { SelectField } from '@/components/SelectField';
import { TextAreaField } from '@/components/TextAreaField';

import {
  activityFormTypeOptions,
  activityTypeLabels,
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

    const result = activitySchema.safeParse(values);

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
      className="rounded-[2rem] border border-[var(--border)] bg-[var(--card)] p-6 shadow-[var(--shadow-soft)]"
      onSubmit={handleSubmit}
    >
      <div className="grid gap-4 md:grid-cols-2">
        <SelectField
          error={fieldErrors.type}
          label="Type"
          name="type"
          onChange={handleChange}
          options={activityFormTypeOptions.map((option) => ({
            label: activityTypeLabels[option.value as keyof typeof activityTypeLabels],
            value: option.value,
          }))}
          value={values.type}
        />
        <SelectField
          error={fieldErrors.leadId}
          label="Lead"
          name="leadId"
          onChange={handleChange}
          options={getActivityLeadOptions(leadOptions)}
          value={values.leadId}
        />
        <SelectField
          error={fieldErrors.clientId}
          label="Client"
          name="clientId"
          onChange={handleChange}
          options={getActivityClientOptions(clientOptions)}
          value={values.clientId}
        />
        <SelectField
          error={fieldErrors.opportunityId}
          label="Opportunity"
          name="opportunityId"
          onChange={handleChange}
          options={getActivityOpportunityOptions(filteredOpportunityOptions)}
          value={values.opportunityId}
        />
      </div>

      <div className="mt-5">
        <TextAreaField
          error={fieldErrors.description}
          hint="Describe the call, meeting, email, note, or task clearly."
          label="Description"
          name="description"
          onChange={handleChange}
          placeholder="Summarize what happened or what needs to happen next."
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
          {isSubmitting ? 'Saving...' : 'Create activity'}
        </button>
      </div>
    </form>
  );
}
