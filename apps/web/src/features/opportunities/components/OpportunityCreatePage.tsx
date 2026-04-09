'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { InlineBanner } from '@/components/InlineBanner';
import { PageIntro } from '@/components/PageIntro';
import { getApiErrorMessage } from '@/services/api/api-error';

import {
  useCreateOpportunityMutation,
  useOpportunityClientsQuery,
  useOpportunityOwnersQuery,
} from '../hooks/use-opportunities';
import type { OpportunityFormValues } from '../types/opportunities';
import { OpportunityForm } from './OpportunityForm';

function mapCreateOpportunityPayload(values: OpportunityFormValues) {
  return {
    clientId: values.clientId,
    estimatedValue: values.estimatedValue,
    ...(values.expectedCloseDate ? { expectedCloseDate: values.expectedCloseDate } : {}),
    ...(values.notes ? { notes: values.notes } : {}),
    ...(values.ownerUserId ? { ownerUserId: values.ownerUserId } : {}),
    stage: values.stage,
    title: values.title,
  };
}

export function OpportunityCreatePage() {
  const router = useRouter();
  const createOpportunityMutation = useCreateOpportunityMutation();
  const ownersQuery = useOpportunityOwnersQuery();
  const clientsQuery = useOpportunityClientsQuery();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(values: OpportunityFormValues) {
    try {
      const response = await createOpportunityMutation.mutateAsync(
        mapCreateOpportunityPayload(values),
      );
      router.replace(`/opportunities/${response.opportunity.id}?success=created`);
    } catch (error) {
      setErrorMessage(
        getApiErrorMessage(error, 'Unable to create this opportunity right now.'),
      );
    }
  }

  return (
    <div className="space-y-6">
      <PageIntro
        description="Create a new commercial opportunity linked to an existing client and track it across the pipeline."
        eyebrow="Opportunities"
        title="Create opportunity"
      />
      {clientsQuery.data && clientsQuery.data.length === 0 ? (
        <InlineBanner tone="info">
          Create at least one client before adding an opportunity.
        </InlineBanner>
      ) : null}
      <OpportunityForm
        clientOptions={clientsQuery.data}
        errorMessage={errorMessage}
        isSubmitting={createOpportunityMutation.isPending}
        mode="create"
        onSubmit={handleSubmit}
        ownerOptions={ownersQuery.data}
        submitLabel="Create opportunity"
      />
    </div>
  );
}
