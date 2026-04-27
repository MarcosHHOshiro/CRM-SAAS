'use client';

import { SelectField } from '@/components/SelectField';
import { useTranslation } from '@/i18n/use-translation';

type ActivitiesFiltersProps = Readonly<{
  clientOptions: Array<{ label: string; value: string }>;
  leadOptions: Array<{ label: string; value: string }>;
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  onReset: () => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  opportunityOptions: Array<{ label: string; value: string }>;
  showUserFilter: boolean;
  typeOptions: Array<{ label: string; value: string }>;
  userOptions: Array<{ label: string; value: string }>;
  values: {
    authorUserId: string;
    clientId: string;
    leadId: string;
    opportunityId: string;
    type: string;
  };
}>;

export function ActivitiesFilters({
  clientOptions,
  leadOptions,
  onChange,
  onReset,
  onSubmit,
  opportunityOptions,
  showUserFilter,
  typeOptions,
  userOptions,
  values,
}: ActivitiesFiltersProps) {
  const { messages } = useTranslation();

  return (
    <form
      className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-6 shadow-[var(--shadow-soft)]"
      onSubmit={onSubmit}
    >
      <div className="grid gap-4 xl:grid-cols-[0.9fr_1fr_1fr_1fr_1fr_auto]">
        <SelectField
          label={messages.activities.filters.type}
          name="type"
          onChange={onChange}
          options={typeOptions}
          value={values.type}
        />
        {showUserFilter ? (
          <SelectField
            label={messages.activities.filters.author}
            name="authorUserId"
            onChange={onChange}
            options={userOptions}
            value={values.authorUserId}
          />
        ) : (
          <div />
        )}
        <SelectField
          label={messages.activities.filters.lead}
          name="leadId"
          onChange={onChange}
          options={leadOptions}
          value={values.leadId}
        />
        <SelectField
          label={messages.activities.filters.client}
          name="clientId"
          onChange={onChange}
          options={clientOptions}
          value={values.clientId}
        />
        <SelectField
          label={messages.activities.filters.opportunity}
          name="opportunityId"
          onChange={onChange}
          options={opportunityOptions}
          value={values.opportunityId}
        />
        <div className="flex items-end gap-3">
          <button
            className="inline-flex min-h-12 items-center justify-center rounded-full bg-[var(--accent)] px-5 text-sm font-semibold text-white hover:bg-[var(--accent-strong)]"
            type="submit"
          >
            {messages.common.actions.apply}
          </button>
          <button
            className="inline-flex min-h-12 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--card-strong)] px-5 text-sm font-semibold text-[var(--foreground)] hover:border-[var(--accent)] hover:text-[var(--accent)]"
            onClick={onReset}
            type="button"
          >
            {messages.common.actions.reset}
          </button>
        </div>
      </div>
    </form>
  );
}
