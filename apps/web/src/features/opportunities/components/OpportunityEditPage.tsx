'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';

import { PageIntro } from '@/components/PageIntro';
import { getApiErrorMessage } from '@/services/api/api-error';

import {
  useOpportunityOwnersQuery,
  useOpportunityQuery,
  useUpdateOpportunityMutation,
} from '../hooks/use-opportunities';
import type { OpportunityFormValues } from '../types/opportunities';
import { OpportunityDetailsSkeleton } from './OpportunityDetailsSkeleton';
import { OpportunitiesErrorState } from './OpportunitiesErrorState';
import { OpportunityForm } from './OpportunityForm';

function mapUpdateOpportunityPayload(values: OpportunityFormValues) {
  return {
    estimatedValue: values.estimatedValue,
    expectedCloseDate: values.expectedCloseDate || null,
    notes: values.notes || null,
    ownerUserId: values.ownerUserId || null,
    title: values.title,
  };
}

export function OpportunityEditPage() {
  const params = useParams<{ opportunityId: string }>();
  const router = useRouter();
  const opportunityId = params.opportunityId;
  const opportunityQuery = useOpportunityQuery(opportunityId);
  const updateOpportunityMutation = useUpdateOpportunityMutation(opportunityId);
  const ownersQuery = useOpportunityOwnersQuery();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(values: OpportunityFormValues) {
    try {
      await updateOpportunityMutation.mutateAsync(mapUpdateOpportunityPayload(values));
      router.replace(`/opportunities/${opportunityId}?success=updated`);
    } catch (error) {
      setErrorMessage(
        getApiErrorMessage(error, 'Unable to update this opportunity right now.'),
      );
    }
  }

  if (opportunityQuery.isPending) {
    return <OpportunityDetailsSkeleton />;
  }

  if (opportunityQuery.isError) {
    return (
      <div className="space-y-6">
        <PageIntro
          description="Update opportunity information, ownership, value, and close date from the private workspace."
          eyebrow="Opportunities"
          title="Edit opportunity"
        />
        <OpportunitiesErrorState
          message={getApiErrorMessage(opportunityQuery.error, 'Unable to load this opportunity.')}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageIntro
        description="Update opportunity information, ownership, value, and close date from the private workspace."
        eyebrow="Opportunities"
        title={`Edit ${opportunityQuery.data.opportunity.title}`}
      />
      <OpportunityForm
        errorMessage={errorMessage}
        isSubmitting={updateOpportunityMutation.isPending}
        mode="edit"
        onSubmit={handleSubmit}
        opportunity={opportunityQuery.data.opportunity}
        ownerOptions={ownersQuery.data}
        submitLabel="Save changes"
      />
    </div>
  );
}
