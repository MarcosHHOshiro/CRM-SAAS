'use client';

import { useTranslation } from '@/i18n/use-translation';
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

function ActivityPulseIcon() {
  return (
    <svg aria-hidden="true" className="h-7 w-7" fill="none" viewBox="0 0 24 24">
      <path d="M3.5 12h4l2.1-5 4.8 10 2.1-5H20.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
    </svg>
  );
}

export function DashboardRecentActivities({ activities }: DashboardRecentActivitiesProps) {
  const { locale, messages } = useTranslation();

  return (
    <section className="rounded-lg border border-[var(--border)] bg-[var(--card)] p-6 shadow-[var(--shadow-soft)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
            {messages.dashboard.recentActivities.eyebrow}
          </p>
          <h2 className="mt-5 text-xl font-semibold text-[var(--foreground)]">
            {messages.dashboard.recentActivities.title}
          </h2>
          <p className="mt-2 text-sm leading-6 text-[var(--foreground-muted)]">
            {messages.dashboard.recentActivities.description}
          </p>
        </div>
        <span className="rounded-full border border-[var(--border)] bg-[var(--card-strong)] px-3 py-1 text-xs font-semibold text-[var(--foreground-muted)]">
          {activities.length} {messages.dashboard.recentActivities.items}
        </span>
      </div>

      {activities.length === 0 ? (
        <div className="mt-6 rounded-lg border border-dashed border-[var(--border)] bg-[color:rgb(var(--card-dark-rgb)/0.6)] px-5 py-10 text-center">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[var(--card)] text-[var(--foreground-muted)] shadow-[var(--shadow-soft)]">
            <ActivityPulseIcon />
          </span>
          <h3 className="mt-4 text-lg font-semibold text-[var(--foreground)]">{messages.dashboard.recentActivities.emptyTitle}</h3>
          <p className="mt-3 text-sm leading-6 text-[var(--foreground-muted)]">
            {messages.dashboard.recentActivities.emptyDescription}
          </p>
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {activities.map((activity) => {
            const relation = getDashboardActivityRelation(activity);

            return (
              <article
                key={activity.id}
                className="rounded-lg border border-[var(--border)] bg-[var(--card-strong)] p-4"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-[var(--accent-soft)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--accent-strong)]">
                        {getDashboardActivityLabel(activity, messages)}
                      </span>
                      {relation ? (
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                          {relation}
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-3 text-sm leading-7 text-[var(--foreground)]">
                      {getDashboardActivityDescription(activity, messages)}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-[var(--foreground-muted)]">
                      <span>{activity.author ? `${messages.dashboard.recentActivities.byAuthor} ${activity.author.name}` : messages.dashboard.recentActivities.system}</span>
                      <span>{formatDashboardDateTime(activity.createdAt, locale, messages)}</span>
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
