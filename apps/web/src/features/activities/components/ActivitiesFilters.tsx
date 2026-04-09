'use client';

import { SelectField } from '@/components/SelectField';

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
  return (
    <form
      className="rounded-[2rem] border border-[var(--border)] bg-[var(--card)] p-6 shadow-[var(--shadow-soft)]"
      onSubmit={onSubmit}
    >
      <div className="grid gap-4 xl:grid-cols-[0.9fr_1fr_1fr_1fr_1fr_auto]">
        <SelectField
          label="Type"
          name="type"
          onChange={onChange}
          options={typeOptions}
          value={values.type}
        />
        {showUserFilter ? (
          <SelectField
            label="Author"
            name="authorUserId"
            onChange={onChange}
            options={userOptions}
            value={values.authorUserId}
          />
        ) : (
          <div />
        )}
        <SelectField
          label="Lead"
          name="leadId"
          onChange={onChange}
          options={leadOptions}
          value={values.leadId}
        />
        <SelectField
          label="Client"
          name="clientId"
          onChange={onChange}
          options={clientOptions}
          value={values.clientId}
        />
        <SelectField
          label="Opportunity"
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
            Apply
          </button>
          <button
            className="inline-flex min-h-12 items-center justify-center rounded-full border border-[var(--border)] bg-white/80 px-5 text-sm font-semibold text-[var(--foreground)] hover:border-[var(--accent)] hover:text-[var(--accent)]"
            onClick={onReset}
            type="button"
          >
            Reset
          </button>
        </div>
      </div>
    </form>
  );
}
