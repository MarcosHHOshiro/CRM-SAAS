'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';

import { PageIntro } from '@/components/PageIntro';
import { getApiErrorMessage } from '@/services/api/api-error';

import { useLeadOwnersQuery, useLeadQuery, useUpdateLeadMutation } from '../hooks/use-leads';
import type { LeadFormValues } from '../types/leads';
import { LeadDetailsSkeleton } from './LeadDetailsSkeleton';
import { LeadForm } from './LeadForm';
import { LeadsErrorState } from './LeadsErrorState';

function mapUpdateLeadPayload(values: LeadFormValues) {
  return {
    company: values.company || null,
    email: values.email || null,
    name: values.name,
    notes: values.notes || null,
    ownerUserId: values.ownerUserId || null,
    phone: values.phone || null,
    status: values.status,
  };
}

export function LeadEditPage() {
  const params = useParams<{ leadId: string }>();
  const router = useRouter();
  const leadId = params.leadId;
  const leadQuery = useLeadQuery(leadId);
  const updateLeadMutation = useUpdateLeadMutation(leadId);
  const ownersQuery = useLeadOwnersQuery();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(values: LeadFormValues) {
    try {
      await updateLeadMutation.mutateAsync(mapUpdateLeadPayload(values));
      router.replace(`/leads/${leadId}?success=updated`);
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error, 'Unable to update this lead right now.'));
    }
  }

  if (leadQuery.isPending) {
    return <LeadDetailsSkeleton />;
  }

  if (leadQuery.isError) {
    return (
      <div className="space-y-6">
        <PageIntro
          description="Update lead information, ownership, and qualification status without leaving the private workspace."
          eyebrow="Leads"
          title="Edit lead"
        />
        <LeadsErrorState message={getApiErrorMessage(leadQuery.error, 'Unable to load this lead.')} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageIntro
        description="Update lead information, ownership, and qualification status without leaving the private workspace."
        eyebrow="Leads"
        title={`Edit ${leadQuery.data.lead.name}`}
      />
      <LeadForm
        errorMessage={errorMessage}
        isSubmitting={updateLeadMutation.isPending}
        lead={leadQuery.data.lead}
        onSubmit={handleSubmit}
        ownerOptions={ownersQuery.data}
        submitLabel="Save changes"
      />
    </div>
  );
}
