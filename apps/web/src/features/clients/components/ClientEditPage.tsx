'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';

import { PageIntro } from '@/components/PageIntro';
import { getApiErrorMessage } from '@/services/api/api-error';

import { useClientOwnersQuery, useClientQuery, useUpdateClientMutation } from '../hooks/use-clients';
import type { ClientFormValues } from '../types/clients';
import { ClientDetailsSkeleton } from './ClientDetailsSkeleton';
import { ClientsErrorState } from './ClientsErrorState';
import { ClientForm } from './ClientForm';

function mapUpdateClientPayload(values: ClientFormValues) {
  return {
    company: values.company || null,
    email: values.email || null,
    name: values.name,
    ownerUserId: values.ownerUserId || null,
    phone: values.phone || null,
  };
}

export function ClientEditPage() {
  const params = useParams<{ clientId: string }>();
  const router = useRouter();
  const clientId = params.clientId;
  const clientQuery = useClientQuery(clientId);
  const updateClientMutation = useUpdateClientMutation(clientId);
  const ownersQuery = useClientOwnersQuery();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(values: ClientFormValues) {
    try {
      await updateClientMutation.mutateAsync(mapUpdateClientPayload(values));
      router.replace(`/clients/${clientId}?success=updated`);
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error, 'Unable to update this client right now.'));
    }
  }

  if (clientQuery.isPending) {
    return <ClientDetailsSkeleton />;
  }

  if (clientQuery.isError) {
    return (
      <div className="space-y-6">
        <PageIntro
          description="Update client information and ownership without leaving the private workspace."
          eyebrow="Clients"
          title="Edit client"
        />
        <ClientsErrorState message={getApiErrorMessage(clientQuery.error, 'Unable to load this client.')} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageIntro
        description="Update client information and ownership without leaving the private workspace."
        eyebrow="Clients"
        title={`Edit ${clientQuery.data.client.name}`}
      />
      <ClientForm
        client={clientQuery.data.client}
        errorMessage={errorMessage}
        isSubmitting={updateClientMutation.isPending}
        onSubmit={handleSubmit}
        ownerOptions={ownersQuery.data}
        submitLabel="Save changes"
      />
    </div>
  );
}
