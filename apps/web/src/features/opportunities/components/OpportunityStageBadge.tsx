import { opportunityStageLabels } from '../lib/opportunities-format';
import type { OpportunityStage } from '../types/opportunities';

type OpportunityStageBadgeProps = Readonly<{
  stage: OpportunityStage;
}>;

const stageClasses: Record<OpportunityStage, string> = {
  LOST: 'bg-rose-100 text-rose-800',
  NEGOTIATION: 'bg-violet-100 text-violet-800',
  NEW: 'bg-slate-200 text-slate-700',
  PROPOSAL: 'bg-sky-100 text-sky-800',
  QUALIFICATION: 'bg-amber-100 text-amber-800',
  WON: 'bg-emerald-100 text-emerald-800',
};

export function OpportunityStageBadge({ stage }: OpportunityStageBadgeProps) {
  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${stageClasses[stage]}`}>
      {opportunityStageLabels[stage]}
    </span>
  );
}
