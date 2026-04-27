'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

import { InlineBanner } from '@/components/InlineBanner';
import { PaginationControls } from '@/components/PaginationControls';
import { PageIntro } from '@/components/PageIntro';
import { useToast } from '@/components/ToastProvider';
import { useQueryFeedbackToast } from '@/hooks/use-query-feedback-toast';
import { useTranslation } from '@/i18n/use-translation';
import { buildPageQueryString, getPageFromSearchParams, paginateItems } from '@/lib/pagination';
import { getApiErrorMessage } from '@/services/api/api-error';

import {
  buildActivityFilters,
  buildActivityFiltersQueryString,
  getActivityClientOptions,
  getActivityTypeOptions,
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
  const [formErrorMessage, setFormErrorMessage] = useState<string | null>(null);
  const { showToast } = useToast();
  const { messages } = useTranslation();
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

  const successMessage = getActivitySuccessMessage(searchParams.get('success'), messages);
  const showUserFilter = (usersQuery.data?.length ?? 0) > 1;
  const currentPage = getPageFromSearchParams(searchParams);

  useQueryFeedbackToast(successMessage);

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

  function handlePageChange(page: number) {
    const queryString = buildPageQueryString(searchParams, page);

    router.replace(queryString ? `/activities?${queryString}` : '/activities');
  }

  async function handleCreate(values: ActivityFormValues) {
    try {
      setFormErrorMessage(null);
      await createActivityMutation.mutateAsync(mapCreateActivityPayload(values));
      showToast({
        message: messages.activities.shared.successCreated,
        tone: 'success',
      });
      setFormKey((currentKey) => currentKey + 1);
    } catch (error) {
      const message = getApiErrorMessage(error, messages.activities.page.errorFallback);

      setFormErrorMessage(message);
      showToast({
        message,
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
          description={messages.activities.page.description}
          eyebrow={messages.activities.page.eyebrow}
          title={messages.activities.page.title}
        />
        <ActivitiesErrorState
          message={getApiErrorMessage(
            activitiesQuery.error,
            messages.activities.page.errorFallback,
          )}
          onRetry={() => {
            void activitiesQuery.refetch();
          }}
        />
      </div>
    );
  }

  const paginatedActivities = paginateItems(activitiesQuery.data.activities, currentPage, 8);

  return (
    <div className="space-y-6">
      <PageIntro
        description={messages.activities.page.description}
        eyebrow={messages.activities.page.eyebrow}
        title={messages.activities.page.title}
      />

      {usersQuery.isError ? (
        <InlineBanner tone="info">
          {messages.activities.page.authorUnavailable}
        </InlineBanner>
      ) : null}

      <ActivitiesFilters
        clientOptions={getActivityClientOptions(clientsQuery.data ?? [], messages)}
        leadOptions={getActivityLeadOptions(leadsQuery.data ?? [], messages)}
        onChange={handleFilterChange}
        onReset={handleFilterReset}
        onSubmit={handleFilterSubmit}
        opportunityOptions={getActivityOpportunityOptions(opportunitiesQuery.data ?? [], messages)}
        showUserFilter={showUserFilter}
        typeOptions={getActivityTypeOptions(messages).map((option) => ({
          label: option.label,
          value: option.value,
        }))}
        userOptions={getActivityUserOptions(usersQuery.data ?? [], messages)}
        values={filtersState}
      />

      <div className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
        <section className="space-y-4">
          <div className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-6 shadow-[var(--shadow-soft)]">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">
              {messages.activities.page.createEyebrow}
            </p>
            <h2 className="mt-3 text-2xl font-semibold text-[var(--foreground)]">
              {messages.activities.page.createTitle}
            </h2>
            <p className="mt-2 text-sm leading-6 text-[var(--foreground-muted)]">
              {messages.activities.page.createDescription}
            </p>
          </div>
          <ActivityForm
            key={formKey}
            clientOptions={clientsQuery.data}
            errorMessage={formErrorMessage}
            isSubmitting={createActivityMutation.isPending}
            leadOptions={leadsQuery.data}
            onSubmit={handleCreate}
            opportunityOptions={opportunitiesQuery.data}
          />
        </section>

        <section className="space-y-4">
          <div className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-6 shadow-[var(--shadow-soft)]">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">
              {messages.activities.page.recentEyebrow}
            </p>
            <h2 className="mt-3 text-2xl font-semibold text-[var(--foreground)]">
              {messages.activities.page.recentTitle}
            </h2>
            <p className="mt-2 text-sm leading-6 text-[var(--foreground-muted)]">
              {messages.activities.page.recentDescription}
            </p>
          </div>

          {activitiesQuery.data.activities.length === 0 ? (
            <ActivitiesEmptyState />
          ) : (
            <>
              <ActivitiesFeed activities={paginatedActivities.items} />
              <PaginationControls
                currentPage={paginatedActivities.currentPage}
                itemLabel={messages.activities.page.itemLabel}
                onPageChange={handlePageChange}
                pageSize={8}
                totalItems={paginatedActivities.totalItems}
                totalPages={paginatedActivities.totalPages}
              />
            </>
          )}
        </section>
      </div>
    </div>
  );
}
