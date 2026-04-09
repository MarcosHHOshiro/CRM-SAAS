import { formatUserRole } from '@/lib/format';

import {
  formatActivityDate,
  getActivityRelatedEntityLabel,
} from '../lib/activities-format';
import type { Activity } from '../types/activities';

import { ActivityTypeBadge } from './ActivityTypeBadge';

type ActivityFeedItemProps = Readonly<{
  activity: Activity;
}>;

export function ActivityFeedItem({ activity }: ActivityFeedItemProps) {
  return (
    <article className="rounded-[1.6rem] border border-[var(--border)] bg-[var(--card-strong)] p-5 shadow-[var(--shadow-soft)]">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          <ActivityTypeBadge type={activity.type} />
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
            {getActivityRelatedEntityLabel(activity)}
          </span>
        </div>
        <span className="text-xs text-[var(--foreground-muted)]">
          {formatActivityDate(activity.createdAt)}
        </span>
      </div>

      <p className="mt-4 text-sm leading-7 text-[var(--foreground)]">{activity.description}</p>

      <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-xs text-[var(--foreground-muted)]">
        <span>
          {activity.author
            ? `By ${activity.author.name} (${formatUserRole(activity.author.role)})`
            : 'System activity'}
        </span>
        {activity.lead ? <span>Lead: {activity.lead.name}</span> : null}
        {activity.client ? <span>Client: {activity.client.name}</span> : null}
        {activity.opportunity ? <span>Opportunity: {activity.opportunity.title}</span> : null}
      </div>
    </article>
  );
}
