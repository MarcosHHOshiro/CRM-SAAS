'use client';

import Link from 'next/link';
import { useParams, useRouter, useSearchParams } from 'next/navigation';

import { PageIntro } from '@/components/PageIntro';
import { useToast } from '@/components/ToastProvider';
import { useQueryFeedbackToast } from '@/hooks/use-query-feedback-toast';
import { getApiErrorMessage } from '@/services/api/api-error';

import { getLeadCanConvert, getLeadSuccessMessage } from '../lib/leads-format';
import { useConvertLeadMutation, useDeleteLeadMutation, useLeadQuery } from '../hooks/use-leads';
import { LeadDetailsCard } from './LeadDetailsCard';
import { LeadDetailsSkeleton } from './LeadDetailsSkeleton';
import { LeadsErrorState } from './LeadsErrorState';

export function LeadDetailsPage() {
  const params = useParams<{ leadId: string }>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const leadId = params.leadId;
  const leadQuery = useLeadQuery(leadId);
  const deleteLeadMutation = useDeleteLeadMutation();
  const convertLeadMutation = useConvertLeadMutation();
  const { showToast } = useToast();
  const successMessage = getLeadSuccessMessage(searchParams.get('success'));

  useQueryFeedbackToast(successMessage);

  if (leadQuery.isPending) {
    return <LeadDetailsSkeleton />;
  }

  if (leadQuery.isError) {
    return (
      <div className="space-y-6">
        <PageIntro
          description="Revise o perfil do lead, o status atual de qualificacao, a responsabilidade e a prontidao para conversao."
          eyebrow="Leads"
          title="Detalhes do lead"
        />
        <LeadsErrorState message={getApiErrorMessage(leadQuery.error, 'Nao foi possivel carregar este lead.')} />
      </div>
    );
  }
  const lead = leadQuery.data.lead;
  const canConvert = getLeadCanConvert(lead);

  async function handleDelete() {
    const confirmed = window.confirm(`Excluir o lead "${lead.name}"?`);

    if (!confirmed) {
      return;
    }

    try {
      await deleteLeadMutation.mutateAsync(lead.id);
      router.replace('/leads?success=deleted');
    } catch (error) {
      showToast({
        message: getApiErrorMessage(error, 'Nao foi possivel excluir este lead agora.'),
        tone: 'error',
      });
    }
  }

  async function handleConvert() {
    const confirmed = window.confirm(`Converter o lead "${lead.name}" em cliente?`);

    if (!confirmed) {
      return;
    }

    try {
      await convertLeadMutation.mutateAsync(lead.id);
      router.replace(`/leads/${lead.id}?success=converted`);
    } catch (error) {
      showToast({
        message: getApiErrorMessage(error, 'Nao foi possivel converter este lead agora.'),
        tone: 'error',
      });
    }
  }

  return (
    <div className="space-y-6">
      <PageIntro
        description="Revise o perfil do lead, o status atual de qualificacao, a responsabilidade e a prontidao para conversao."
        eyebrow="Leads"
        title={lead.name}
      />
      <section className="flex flex-wrap gap-3">
        <Link
          className="inline-flex min-h-11 items-center justify-center rounded-full border border-[var(--border)] bg-white/80 px-5 text-sm font-semibold text-[var(--foreground)] hover:border-[var(--accent)] hover:text-[var(--accent)]"
          href="/leads"
        >
          Voltar para a lista
        </Link>
        <Link
          className="inline-flex min-h-11 items-center justify-center rounded-full bg-[var(--accent)] px-5 text-sm font-semibold text-white hover:bg-[var(--accent-strong)]"
          href={`/leads/${lead.id}/edit`}
        >
          Editar lead
        </Link>
        {canConvert ? (
          <button
            className="inline-flex min-h-11 items-center justify-center rounded-full border border-emerald-200 bg-emerald-50 px-5 text-sm font-semibold text-emerald-700 hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-70"
            disabled={convertLeadMutation.isPending}
            onClick={handleConvert}
            type="button"
          >
            {convertLeadMutation.isPending ? 'Convertendo...' : 'Converter em cliente'}
          </button>
        ) : null}
        <button
          className="inline-flex min-h-11 items-center justify-center rounded-full border border-rose-200 bg-rose-50 px-5 text-sm font-semibold text-rose-700 hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-70"
          disabled={deleteLeadMutation.isPending}
          onClick={handleDelete}
          type="button"
        >
          {deleteLeadMutation.isPending ? 'Excluindo...' : 'Excluir lead'}
        </button>
      </section>

      <LeadDetailsCard lead={lead} />
    </div>
  );
}
