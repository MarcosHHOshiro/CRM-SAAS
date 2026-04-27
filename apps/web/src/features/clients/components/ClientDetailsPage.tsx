'use client';

import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';

import { PageIntro } from '@/components/PageIntro';
import { useQueryFeedbackToast } from '@/hooks/use-query-feedback-toast';
import { useTranslation } from '@/i18n/use-translation';
import { getApiErrorMessage } from '@/services/api/api-error';

import { getClientSuccessMessage } from '../lib/clients-format';
import { useClientQuery } from '../hooks/use-clients';
import { ClientDetailsCard } from './ClientDetailsCard';
import { ClientDetailsSkeleton } from './ClientDetailsSkeleton';
import { ClientsErrorState } from './ClientsErrorState';

export function ClientDetailsPage() {
  const { messages } = useTranslation();
  const params = useParams<{ clientId: string }>();
  const searchParams = useSearchParams();
  const clientId = params.clientId;
  const clientQuery = useClientQuery(clientId);
  const successMessage = getClientSuccessMessage(searchParams.get('success'), messages);

  useQueryFeedbackToast(successMessage);

  if (clientQuery.isPending) {
    return <ClientDetailsSkeleton />;
  }

  if (clientQuery.isError) {
    return (
      <div className="space-y-6">
        <PageIntro
          description={messages.clients.details.description}
          eyebrow={messages.clients.details.eyebrow}
          title={messages.clients.details.title}
        />
        <ClientsErrorState message={getApiErrorMessage(clientQuery.error, messages.clients.details.loadError)} />
      </div>
    );
  }
  const client = clientQuery.data.client;

  return (
    <div className="space-y-6">
      <PageIntro
        description={messages.clients.details.description}
        eyebrow={messages.clients.details.eyebrow}
        title={client.name}
      />
      <section className="flex flex-wrap gap-3">
        <Link
          className="inline-flex min-h-11 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--card-strong)] px-5 text-sm font-semibold text-[var(--foreground)] hover:border-[var(--accent)] hover:text-[var(--accent)]"
          href="/clients"
        >
          {messages.common.actions.backToList}
        </Link>
        <Link
          className="inline-flex min-h-11 items-center justify-center rounded-full bg-[var(--accent)] px-5 text-sm font-semibold text-white hover:bg-[var(--accent-strong)]"
          href={`/clients/${client.id}/edit`}
        >
          {messages.clients.details.editButton}
        </Link>
      </section>

      <ClientDetailsCard client={client} />
    </div>
  );
}
