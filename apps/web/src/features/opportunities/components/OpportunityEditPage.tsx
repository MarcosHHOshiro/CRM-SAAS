'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';

import { PageIntro } from '@/components/PageIntro';
import { useTranslation } from '@/i18n/use-translation';
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
  const { messages } = useTranslation();

  async function handleSubmit(values: OpportunityFormValues) {
    try {
      await updateOpportunityMutation.mutateAsync(mapUpdateOpportunityPayload(values));
      router.replace(`/opportunities/${opportunityId}?success=updated`);
    } catch (error) {
      setErrorMessage(
        getApiErrorMessage(error, messages.opportunities.edit.errorFallback),
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
          description={messages.opportunities.edit.description}
          eyebrow={messages.opportunities.edit.eyebrow}
          title={messages.opportunities.edit.title}
        />
        <OpportunitiesErrorState
          message={getApiErrorMessage(opportunityQuery.error, messages.opportunities.edit.loadError)}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageIntro
        description={messages.opportunities.edit.description}
        eyebrow={messages.opportunities.edit.eyebrow}
        title={messages.opportunities.edit.titleWithName.replace('{name}', opportunityQuery.data.opportunity.title)}
      />
      <OpportunityForm
        errorMessage={errorMessage}
        isSubmitting={updateOpportunityMutation.isPending}
        mode="edit"
        onSubmit={handleSubmit}
        opportunity={opportunityQuery.data.opportunity}
        ownerOptions={ownersQuery.data}
        submitLabel={messages.opportunities.edit.submit}
      />
    </div>
  );
}
