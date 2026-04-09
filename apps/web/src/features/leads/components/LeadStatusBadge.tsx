import { useTranslation } from '@/i18n/use-translation';
import { formatLeadStatus } from '../lib/leads-format';
import type { LeadStatus } from '../types/leads';

type LeadStatusBadgeProps = Readonly<{
  status: LeadStatus;
}>;

const statusClasses: Record<LeadStatus, string> = {
  CONTACTED: 'bg-sky-100 text-sky-800',
  CONVERTED: 'bg-emerald-100 text-emerald-800',
  LOST: 'bg-rose-100 text-rose-800',
  NEW: 'bg-slate-200 text-slate-700',
  QUALIFIED: 'bg-amber-100 text-amber-800',
};

export function LeadStatusBadge({ status }: LeadStatusBadgeProps) {
  const { messages } = useTranslation();

  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusClasses[status]}`}>
      {formatLeadStatus(status, messages)}
    </span>
  );
}
