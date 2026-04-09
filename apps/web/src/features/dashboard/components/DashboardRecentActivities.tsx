import {
  formatDashboardDateTime,
  getDashboardActivityDescription,
  getDashboardActivityLabel,
  getDashboardActivityRelation,
} from '../lib/dashboard-format';
import type { DashboardActivity } from '../types/dashboard';

type DashboardRecentActivitiesProps = Readonly<{
  activities: DashboardActivity[];
}>;

export function DashboardRecentActivities({ activities }: DashboardRecentActivitiesProps) {
  return (
    <section className="rounded-[2rem] border border-[var(--border)] bg-[var(--card)] p-6 shadow-[var(--shadow-soft)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">
            Recent activities
          </p>
          <h2 className="mt-3 text-2xl font-semibold text-[var(--foreground)]">
            Latest team interactions
          </h2>
          <p className="mt-2 text-sm leading-6 text-[var(--foreground-muted)]">
            Notes, calls, emails, meetings, and tasks created most recently.
          </p>
        </div>
        <span className="rounded-full border border-[var(--border)] bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--foreground-muted)]">
          {activities.length} items
        </span>
      </div>

      {activities.length === 0 ? (
        <div className="mt-6 rounded-[1.6rem] border border-dashed border-[var(--border)] bg-white/55 px-5 py-8 text-center">
          <h3 className="text-lg font-semibold text-[var(--foreground)]">No recent activities yet</h3>
          <p className="mt-3 text-sm leading-6 text-[var(--foreground-muted)]">
            Once your team starts logging notes, calls, tasks, and meetings, they will appear here.
          </p>
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {activities.map((activity) => {
            const relation = getDashboardActivityRelation(activity);

            return (
              <article
                key={activity.id}
                className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--card-strong)] p-4"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-[var(--accent-soft)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--accent-strong)]">
                        {getDashboardActivityLabel(activity)}
                      </span>
                      {relation ? (
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                          {relation}
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-3 text-sm leading-7 text-[var(--foreground)]">
                      {getDashboardActivityDescription(activity)}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-[var(--foreground-muted)]">
                      <span>{activity.author ? `By ${activity.author.name}` : 'System activity'}</span>
                      <span>{formatDashboardDateTime(activity.createdAt)}</span>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
