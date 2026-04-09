import { opportunityStatusLabels } from '../lib/opportunities-format';
import type { OpportunityStatus } from '../types/opportunities';

type OpportunityStatusBadgeProps = Readonly<{
  status: OpportunityStatus;
}>;

const statusClasses: Record<OpportunityStatus, string> = {
  LOST: 'bg-rose-100 text-rose-800',
  OPEN: 'bg-slate-200 text-slate-700',
  WON: 'bg-emerald-100 text-emerald-800',
};

export function OpportunityStatusBadge({ status }: OpportunityStatusBadgeProps) {
  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusClasses[status]}`}>
      {opportunityStatusLabels[status]}
    </span>
  );
}
