'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

import { InlineBanner } from '@/components/InlineBanner';
import { PageIntro } from '@/components/PageIntro';
import { getApiErrorMessage } from '@/services/api/api-error';

import {
  activityTypeOptions,
  buildActivityFilters,
  buildActivityFiltersQueryString,
  getActivityClientOptions,
  getActivityLeadOptions,
  getActivityOpportunityOptions,
  getActivitySuccessMessage,
  getActivityUserOptions,
} from '../lib/activities-format';
import {
  useActivitiesQuery,
  useActivityClientsQuery,
  useActivityLeadsQuery,
  useActivityOpportunitiesQuery,
  useActivityUsersQuery,
  useCreateActivityMutation,
} from '../hooks/use-activities';
import type { ActivityFormValues } from '../types/activities';
import { ActivitiesEmptyState } from './ActivitiesEmptyState';
import { ActivitiesErrorState } from './ActivitiesErrorState';
import { ActivitiesFeed } from './ActivitiesFeed';
import { ActivitiesFilters } from './ActivitiesFilters';
import { ActivitiesSkeleton } from './ActivitiesSkeleton';
import { ActivityForm } from './ActivityForm';

type ActivityFiltersState = {
  authorUserId: string;
  clientId: string;
  leadId: string;
  opportunityId: string;
  type: string;
};

function mapCreateActivityPayload(values: ActivityFormValues) {
  return {
    ...(values.clientId ? { clientId: values.clientId } : {}),
    description: values.description,
    ...(values.leadId ? { leadId: values.leadId } : {}),
    ...(values.opportunityId ? { opportunityId: values.opportunityId } : {}),
    type: values.type,
  };
}

export function ActivitiesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const filters = useMemo(() => buildActivityFilters(searchParams), [searchParams]);
  const activitiesQuery = useActivitiesQuery(filters);
  const usersQuery = useActivityUsersQuery();
  const leadsQuery = useActivityLeadsQuery();
  const clientsQuery = useActivityClientsQuery();
  const opportunitiesQuery = useActivityOpportunitiesQuery();
  const createActivityMutation = useCreateActivityMutation();
  const [formKey, setFormKey] = useState(0);
  const [feedback, setFeedback] = useState<{ message: string; tone: 'error' | 'success' } | null>(
    null,
  );
  const [filtersState, setFiltersState] = useState<ActivityFiltersState>({
    authorUserId: searchParams.get('authorUserId') ?? '',
    clientId: searchParams.get('clientId') ?? '',
    leadId: searchParams.get('leadId') ?? '',
    opportunityId: searchParams.get('opportunityId') ?? '',
    type: searchParams.get('type') ?? '',
  });

  useEffect(() => {
    setFiltersState({
      authorUserId: searchParams.get('authorUserId') ?? '',
      clientId: searchParams.get('clientId') ?? '',
      leadId: searchParams.get('leadId') ?? '',
      opportunityId: searchParams.get('opportunityId') ?? '',
      type: searchParams.get('type') ?? '',
    });
  }, [searchParams]);

  const successMessage = getActivitySuccessMessage(searchParams.get('success'));
  const showUserFilter = (usersQuery.data?.length ?? 0) > 1;

  function handleFilterChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const { name, value } = event.target;

    setFiltersState((currentState) => ({
      ...currentState,
      [name]: value,
    }));
  }

  function handleFilterSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const queryString = buildActivityFiltersQueryString(filtersState);

    router.replace(queryString ? `/activities?${queryString}` : '/activities');
  }

  function handleFilterReset() {
    setFiltersState({
      authorUserId: '',
      clientId: '',
      leadId: '',
      opportunityId: '',
      type: '',
    });
    router.replace('/activities');
  }

  async function handleCreate(values: ActivityFormValues) {
    try {
      await createActivityMutation.mutateAsync(mapCreateActivityPayload(values));
      setFeedback({
        message: 'Activity created successfully.',
        tone: 'success',
      });
      setFormKey((currentKey) => currentKey + 1);
    } catch (error) {
      setFeedback({
        message: getApiErrorMessage(error, 'Unable to create this activity right now.'),
        tone: 'error',
      });
    }
  }

  if (
    activitiesQuery.isPending ||
    leadsQuery.isPending ||
    clientsQuery.isPending ||
    opportunitiesQuery.isPending
  ) {
    return <ActivitiesSkeleton />;
  }

  if (activitiesQuery.isError) {
    return (
      <div className="space-y-6">
        <PageIntro
          description="Capture calls, meetings, notes, emails, and tasks in a clean activity feed for the organization."
          eyebrow="Activities"
          title="Activity feed"
        />
        <ActivitiesErrorState
          message={getApiErrorMessage(
            activitiesQuery.error,
            'Please try loading the activity feed again.',
          )}
          onRetry={() => {
            void activitiesQuery.refetch();
          }}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageIntro
        description="Capture calls, meetings, notes, emails, and tasks in a clean activity feed for the organization."
        eyebrow="Activities"
        title="Activity feed"
      />

      {successMessage ? <InlineBanner tone="success">{successMessage}</InlineBanner> : null}
      {feedback ? <InlineBanner tone={feedback.tone}>{feedback.message}</InlineBanner> : null}
      {usersQuery.isError ? (
        <InlineBanner tone="info">
          Author filtering is not available for your current access level.
        </InlineBanner>
      ) : null}

      <ActivitiesFilters
        clientOptions={getActivityClientOptions(clientsQuery.data ?? [])}
        leadOptions={getActivityLeadOptions(leadsQuery.data ?? [])}
        onChange={handleFilterChange}
        onReset={handleFilterReset}
        onSubmit={handleFilterSubmit}
        opportunityOptions={getActivityOpportunityOptions(opportunitiesQuery.data ?? [])}
        showUserFilter={showUserFilter}
        typeOptions={activityTypeOptions.map((option) => ({
          label: option.label,
          value: option.value,
        }))}
        userOptions={getActivityUserOptions(usersQuery.data ?? [])}
        values={filtersState}
      />

      <div className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
        <section className="space-y-4">
          <div className="rounded-[2rem] border border-[var(--border)] bg-[var(--card)] p-6 shadow-[var(--shadow-soft)]">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">
              Create activity
            </p>
            <h2 className="mt-3 text-2xl font-semibold text-[var(--foreground)]">
              Log the latest interaction
            </h2>
            <p className="mt-2 text-sm leading-6 text-[var(--foreground-muted)]">
              Add notes, calls, emails, meetings, or tasks tied to leads, clients, or opportunities.
            </p>
          </div>
          <ActivityForm
            key={formKey}
            clientOptions={clientsQuery.data}
            errorMessage={feedback?.tone === 'error' ? feedback.message : null}
            isSubmitting={createActivityMutation.isPending}
            leadOptions={leadsQuery.data}
            onSubmit={handleCreate}
            opportunityOptions={opportunitiesQuery.data}
          />
        </section>

        <section className="space-y-4">
          <div className="rounded-[2rem] border border-[var(--border)] bg-[var(--card)] p-6 shadow-[var(--shadow-soft)]">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">
              Recent activities
            </p>
            <h2 className="mt-3 text-2xl font-semibold text-[var(--foreground)]">
              Latest follow-ups and touchpoints
            </h2>
            <p className="mt-2 text-sm leading-6 text-[var(--foreground-muted)]">
              The feed updates as soon as new activities are created.
            </p>
          </div>

          {activitiesQuery.data.activities.length === 0 ? (
            <ActivitiesEmptyState />
          ) : (
            <ActivitiesFeed activities={activitiesQuery.data.activities} />
          )}
        </section>
      </div>
    </div>
  );
}
