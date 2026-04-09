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
      setErrorMessage(getApiErrorMessage(error, 'Nao foi possivel criar este lead agora.'));
    }
  }

  return (
    <div className="space-y-6">
      <PageIntro
        description="Crie um novo lead com as informacoes comerciais principais para follow-up e qualificacao."
        eyebrow="Leads"
        title="Criar lead"
      />
      <LeadForm
        errorMessage={errorMessage}
        isSubmitting={createLeadMutation.isPending}
        onSubmit={handleSubmit}
        ownerOptions={ownersQuery.data}
        submitLabel="Criar lead"
      />
    </div>
  );
}
