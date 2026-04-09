'use client';

import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';

import { PageIntro } from '@/components/PageIntro';
import { useQueryFeedbackToast } from '@/hooks/use-query-feedback-toast';
import { getApiErrorMessage } from '@/services/api/api-error';

import { getClientSuccessMessage } from '../lib/clients-format';
import { useClientQuery } from '../hooks/use-clients';
import { ClientDetailsCard } from './ClientDetailsCard';
import { ClientDetailsSkeleton } from './ClientDetailsSkeleton';
import { ClientsErrorState } from './ClientsErrorState';

export function ClientDetailsPage() {
  const params = useParams<{ clientId: string }>();
  const searchParams = useSearchParams();
  const clientId = params.clientId;
  const clientQuery = useClientQuery(clientId);
  const successMessage = getClientSuccessMessage(searchParams.get('success'));

  useQueryFeedbackToast(successMessage);

  if (clientQuery.isPending) {
    return <ClientDetailsSkeleton />;
  }

  if (clientQuery.isError) {
    return (
      <div className="space-y-6">
        <PageIntro
          description="Review the client profile, ownership, and origin details from the current organization."
          eyebrow="Clients"
          title="Client details"
        />
        <ClientsErrorState message={getApiErrorMessage(clientQuery.error, 'Unable to load this client.')} />
      </div>
    );
  }
  const client = clientQuery.data.client;

  return (
    <div className="space-y-6">
      <PageIntro
        description="Review the client profile, ownership, and origin details from the current organization."
        eyebrow="Clients"
        title={client.name}
      />
      <section className="flex flex-wrap gap-3">
        <Link
          className="inline-flex min-h-11 items-center justify-center rounded-full border border-[var(--border)] bg-white/80 px-5 text-sm font-semibold text-[var(--foreground)] hover:border-[var(--accent)] hover:text-[var(--accent)]"
          href="/clients"
        >
          Back to list
        </Link>
        <Link
          className="inline-flex min-h-11 items-center justify-center rounded-full bg-[var(--accent)] px-5 text-sm font-semibold text-white hover:bg-[var(--accent-strong)]"
          href={`/clients/${client.id}/edit`}
        >
          Edit client
        </Link>
      </section>

      <ClientDetailsCard client={client} />
    </div>
  );
}
