import { activityTypeLabels } from '../lib/activities-format';
import type { ActivityType } from '../types/activities';

type ActivityTypeBadgeProps = Readonly<{
  type: ActivityType;
}>;

const typeClasses: Record<ActivityType, string> = {
  CALL: 'bg-sky-100 text-sky-800',
  EMAIL: 'bg-violet-100 text-violet-800',
  MEETING: 'bg-amber-100 text-amber-800',
  NOTE: 'bg-slate-200 text-slate-700',
  TASK: 'bg-emerald-100 text-emerald-800',
};

export function ActivityTypeBadge({ type }: ActivityTypeBadgeProps) {
  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${typeClasses[type]}`}>
      {activityTypeLabels[type]}
    </span>
  );
}
