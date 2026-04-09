'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

import { InlineBanner } from '@/components/InlineBanner';
import { PaginationControls } from '@/components/PaginationControls';
import { PageIntro } from '@/components/PageIntro';
import { useToast } from '@/components/ToastProvider';
import { useQueryFeedbackToast } from '@/hooks/use-query-feedback-toast';
import { buildPageQueryString, getPageFromSearchParams, paginateItems } from '@/lib/pagination';
import { getApiErrorMessage } from '@/services/api/api-error';

import {
  buildLeadFilters,
  buildLeadFiltersQueryString,
  getLeadOwnerOptions,
  getLeadSuccessMessage,
} from '../lib/leads-format';
import { useConvertLeadMutation, useDeleteLeadMutation, useLeadOwnersQuery, useLeadsQuery } from '../hooks/use-leads';
import type { Lead } from '../types/leads';
import { LeadsEmptyState } from './LeadsEmptyState';
import { LeadsErrorState } from './LeadsErrorState';
import { LeadsFilters } from './LeadsFilters';
import { LeadsListSkeleton } from './LeadsListSkeleton';
import { LeadsTable } from './LeadsTable';

type FiltersFormState = {
  ownerUserId: string;
  search: string;
  status: string;
};

export function LeadsListPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const filters = useMemo(() => buildLeadFilters(searchParams), [searchParams]);
  const leadsQuery = useLeadsQuery(filters);
  const ownersQuery = useLeadOwnersQuery();
  const deleteLeadMutation = useDeleteLeadMutation();
  const convertLeadMutation = useConvertLeadMutation();
  const { showToast } = useToast();
  const [filtersState, setFiltersState] = useState<FiltersFormState>({
    ownerUserId: searchParams.get('ownerUserId') ?? '',
    search: searchParams.get('search') ?? '',
    status: searchParams.get('status') ?? '',
  });

  useEffect(() => {
    setFiltersState({
      ownerUserId: searchParams.get('ownerUserId') ?? '',
      search: searchParams.get('search') ?? '',
      status: searchParams.get('status') ?? '',
    });
  }, [searchParams]);

  const successMessage = getLeadSuccessMessage(searchParams.get('success'));
  const ownerOptions = ownersQuery.data ? getLeadOwnerOptions(ownersQuery.data) : [];
  const showOwnerFilter = ownerOptions.length > 1;
  const hasFilters = Boolean(filters.search || filters.status || filters.ownerUserId);
  const currentPage = getPageFromSearchParams(searchParams);

  useQueryFeedbackToast(successMessage);

  function handleChange(event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = event.target;

    setFiltersState((currentState) => ({
      ...currentState,
      [name]: value,
    }));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const queryString = buildLeadFiltersQueryString(filtersState);

    router.replace(queryString ? `/leads?${queryString}` : '/leads');
  }

  function handleReset() {
    setFiltersState({
      ownerUserId: '',
      search: '',
      status: '',
    });
    router.replace('/leads');
  }

  function handlePageChange(page: number) {
    const queryString = buildPageQueryString(searchParams, page);

    router.replace(queryString ? `/leads?${queryString}` : '/leads');
  }

  async function handleDelete(lead: Lead) {
    const confirmed = window.confirm(`Delete the lead "${lead.name}"?`);

    if (!confirmed) {
      return;
    }

    try {
      await deleteLeadMutation.mutateAsync(lead.id);
      showToast({ message: 'Lead deleted successfully.', tone: 'success' });
    } catch (error) {
      showToast({
        message: getApiErrorMessage(error, 'Unable to delete this lead right now.'),
        tone: 'error',
      });
    }
  }

  async function handleConvert(lead: Lead) {
    const confirmed = window.confirm(`Convert the lead "${lead.name}" into a client?`);

    if (!confirmed) {
      return;
    }

    try {
      await convertLeadMutation.mutateAsync(lead.id);
      showToast({
        message: 'Lead converted into a client successfully.',
        tone: 'success',
      });
    } catch (error) {
      showToast({
        message: getApiErrorMessage(error, 'Unable to convert this lead right now.'),
        tone: 'error',
      });
    }
  }

  if (leadsQuery.isPending) {
    return <LeadsListSkeleton />;
  }

  if (leadsQuery.isError) {
    return (
      <div className="space-y-6">
        <PageIntro
          description="Manage prospects across the organization, keep pipeline data clean, and move qualified records toward conversion."
          eyebrow="Leads"
          title="Lead management"
        />
        <LeadsErrorState
          message={getApiErrorMessage(leadsQuery.error, 'Please try loading the leads again.')}
          onRetry={() => {
            void leadsQuery.refetch();
          }}
        />
      </div>
    );
  }

  const paginatedLeads = paginateItems(leadsQuery.data.leads, currentPage, 10);

  return (
    <div className="space-y-6">
      <PageIntro
        description="Manage prospects across the organization, keep pipeline data clean, and move qualified records toward conversion."
        eyebrow="Leads"
        title="Lead management"
      />

      {ownersQuery.isError ? (
        <InlineBanner tone="info">
          Owner filters are not available for your current access level.
        </InlineBanner>
      ) : null}

      <LeadsFilters
        onChange={handleChange}
        onReset={handleReset}
        onSubmit={handleSubmit}
        ownerOptions={ownerOptions}
        showOwnerFilter={showOwnerFilter}
        values={filtersState}
      />

      {leadsQuery.data.leads.length === 0 ? (
        <LeadsEmptyState hasFilters={hasFilters} />
      ) : (
        <>
          <LeadsTable
            isDeletingLeadId={deleteLeadMutation.isPending ? deleteLeadMutation.variables ?? null : null}
            isMutatingConvertLeadId={convertLeadMutation.isPending ? convertLeadMutation.variables ?? null : null}
            leads={paginatedLeads.items}
            onConvert={handleConvert}
            onDelete={handleDelete}
          />
          <PaginationControls
            currentPage={paginatedLeads.currentPage}
            itemLabel="leads"
            onPageChange={handlePageChange}
            pageSize={10}
            totalItems={paginatedLeads.totalItems}
            totalPages={paginatedLeads.totalPages}
          />
        </>
      )}
    </div>
  );
}
