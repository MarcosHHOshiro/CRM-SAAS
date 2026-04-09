'use client';

import { useTranslation } from '@/i18n/use-translation';
import { formatDashboardCurrency } from '../lib/dashboard-format';
import type { DashboardMetrics } from '../types/dashboard';

type DashboardPipelineSummaryProps = Readonly<{
  metrics: DashboardMetrics;
}>;

export function DashboardPipelineSummary({ metrics }: DashboardPipelineSummaryProps) {
  const { locale, messages } = useTranslation();
  const totalTrackedOpportunities =
    metrics.openOpportunities + metrics.wonOpportunities + metrics.lostOpportunities;
  const pipelineSegments = [
    {
      colorClassName: 'bg-slate-900',
      key: 'openOpportunities',
      label: messages.dashboard.pipeline.open,
    },
    {
      colorClassName: 'bg-emerald-500',
      key: 'wonOpportunities',
      label: messages.dashboard.pipeline.won,
    },
    {
      colorClassName: 'bg-rose-400',
      key: 'lostOpportunities',
      label: messages.dashboard.pipeline.lost,
    },
  ] as const;

  return (
    <section className="rounded-[2rem] border border-[var(--border)] bg-[var(--card)] p-6 shadow-[var(--shadow-soft)]">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">
            {messages.dashboard.pipeline.eyebrow}
          </p>
          <h2 className="mt-3 text-2xl font-semibold text-[var(--foreground)]">
            {formatDashboardCurrency(metrics.totalPipelineValue, locale)}
          </h2>
          <p className="mt-2 text-sm leading-6 text-[var(--foreground-muted)]">
            {messages.dashboard.pipeline.description}
          </p>
        </div>
        <div className="rounded-[1.4rem] border border-[var(--border)] bg-white/80 px-4 py-3">
          <p className="text-sm font-semibold text-[var(--foreground)]">{totalTrackedOpportunities}</p>
          <p className="mt-1 text-xs uppercase tracking-[0.16em] text-[var(--foreground-muted)]">
            {messages.dashboard.pipeline.trackedOpportunities}
          </p>
        </div>
      </div>

      <div className="mt-6 flex h-4 overflow-hidden rounded-full bg-slate-200">
        {pipelineSegments.map((segment) => {
          const value = metrics[segment.key];
          const width =
            totalTrackedOpportunities === 0 ? 0 : (value / totalTrackedOpportunities) * 100;

          return (
            <div
              key={segment.key}
              aria-hidden="true"
              className={segment.colorClassName}
              style={{ width: `${width}%` }}
            />
          );
        })}
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        {pipelineSegments.map((segment) => (
          <article
            key={segment.key}
            className="rounded-[1.4rem] border border-[var(--border)] bg-[var(--card-strong)] px-4 py-4"
          >
            <div className="flex items-center gap-3">
              <span className={`h-3 w-3 rounded-full ${segment.colorClassName}`} />
              <p className="text-sm font-semibold text-[var(--foreground)]">{segment.label}</p>
            </div>
            <p className="mt-3 text-2xl font-semibold text-[var(--foreground)]">
              {metrics[segment.key]}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
