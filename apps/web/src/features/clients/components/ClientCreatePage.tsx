'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { PageIntro } from '@/components/PageIntro';
import { useTranslation } from '@/i18n/use-translation';
import { getApiErrorMessage } from '@/services/api/api-error';

import { useClientOwnersQuery, useCreateClientMutation } from '../hooks/use-clients';
import type { ClientFormValues } from '../types/clients';
import { ClientForm } from './ClientForm';

function mapCreateClientPayload(values: ClientFormValues) {
  return {
    ...(values.company ? { company: values.company } : {}),
    ...(values.email ? { email: values.email } : {}),
    name: values.name,
    ...(values.ownerUserId ? { ownerUserId: values.ownerUserId } : {}),
    ...(values.phone ? { phone: values.phone } : {}),
  };
}

export function ClientCreatePage() {
  const { messages } = useTranslation();
  const router = useRouter();
  const createClientMutation = useCreateClientMutation();
  const ownersQuery = useClientOwnersQuery();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(values: ClientFormValues) {
    try {
      const response = await createClientMutation.mutateAsync(mapCreateClientPayload(values));
      router.replace(`/clients/${response.client.id}?success=created`);
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error, messages.clients.create.errorFallback));
    }
  }

  return (
    <div className="space-y-6">
      <PageIntro
        description={messages.clients.create.description}
        eyebrow={messages.clients.create.eyebrow}
        title={messages.clients.create.title}
      />
      <ClientForm
        errorMessage={errorMessage}
        isSubmitting={createClientMutation.isPending}
        onSubmit={handleSubmit}
        ownerOptions={ownersQuery.data}
        submitLabel={messages.clients.create.submit}
      />
    </div>
  );
}
