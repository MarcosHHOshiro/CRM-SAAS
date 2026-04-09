'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';

import { PageIntro } from '@/components/PageIntro';
import { useTranslation } from '@/i18n/use-translation';
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
  const { messages } = useTranslation();
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
      setErrorMessage(getApiErrorMessage(error, messages.clients.edit.errorFallback));
    }
  }

  if (clientQuery.isPending) {
    return <ClientDetailsSkeleton />;
  }

  if (clientQuery.isError) {
    return (
      <div className="space-y-6">
        <PageIntro
          description={messages.clients.edit.description}
          eyebrow={messages.clients.edit.eyebrow}
          title={messages.clients.edit.title}
        />
        <ClientsErrorState message={getApiErrorMessage(clientQuery.error, messages.clients.edit.loadError)} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageIntro
        description={messages.clients.edit.description}
        eyebrow={messages.clients.edit.eyebrow}
        title={messages.clients.edit.titleWithName.replace('{name}', clientQuery.data.client.name)}
      />
      <ClientForm
        client={clientQuery.data.client}
        errorMessage={errorMessage}
        isSubmitting={updateClientMutation.isPending}
        onSubmit={handleSubmit}
        ownerOptions={ownersQuery.data}
        submitLabel={messages.clients.edit.submit}
      />
    </div>
  );
}
