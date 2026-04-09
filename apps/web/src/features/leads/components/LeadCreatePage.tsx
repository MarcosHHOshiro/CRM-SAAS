'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { PageIntro } from '@/components/PageIntro';
import { getApiErrorMessage } from '@/services/api/api-error';

import { useCreateLeadMutation, useLeadOwnersQuery } from '../hooks/use-leads';
import type { LeadFormValues } from '../types/leads';
import { LeadForm } from './LeadForm';

function mapCreateLeadPayload(values: LeadFormValues) {
  return {
    ...(values.company ? { company: values.company } : {}),
    ...(values.email ? { email: values.email } : {}),
    name: values.name,
    ...(values.notes ? { notes: values.notes } : {}),
    ...(values.ownerUserId ? { ownerUserId: values.ownerUserId } : {}),
    ...(values.phone ? { phone: values.phone } : {}),
    status: values.status,
  };
}

export function LeadCreatePage() {
  const router = useRouter();
  const createLeadMutation = useCreateLeadMutation();
  const ownersQuery = useLeadOwnersQuery();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(values: LeadFormValues) {
    try {
      const response = await createLeadMutation.mutateAsync(mapCreateLeadPayload(values));
      router.replace(`/leads/${response.lead.id}?success=created`);
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error, 'Unable to create this lead right now.'));
    }
  }

  return (
    <div className="space-y-6">
      <PageIntro
        description="Create a new lead record with the core commercial information needed for follow-up and qualification."
        eyebrow="Leads"
        title="Create lead"
      />
      <LeadForm
        errorMessage={errorMessage}
        isSubmitting={createLeadMutation.isPending}
        onSubmit={handleSubmit}
        ownerOptions={ownersQuery.data}
        submitLabel="Create lead"
      />
    </div>
  );
}
