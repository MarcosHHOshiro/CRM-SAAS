'use client';

import { PageIntro } from '@/components/PageIntro';
import { useTranslation } from '@/i18n/use-translation';
import { getApiErrorMessage } from '@/services/api/api-error';

import { getDashboardIsEmpty } from '../lib/dashboard-format';
import { useDashboardSummaryQuery } from '../hooks/use-dashboard-summary';
import { DashboardEmptyState } from './DashboardEmptyState';
import { DashboardErrorState } from './DashboardErrorState';
import { DashboardMetricGrid } from './DashboardMetricGrid';
import { DashboardPipelineSummary } from './DashboardPipelineSummary';
import { DashboardRecentActivities } from './DashboardRecentActivities';
import { DashboardSkeleton } from './DashboardSkeleton';

export function DashboardOverview() {
  const dashboardSummaryQuery = useDashboardSummaryQuery();
  const { messages } = useTranslation();

  if (dashboardSummaryQuery.isPending) {
    return <DashboardSkeleton />;
  }

  if (dashboardSummaryQuery.isError) {
    return (
      <div className="space-y-6">
        <PageIntro
          description={messages.dashboard.overview.description}
          eyebrow={messages.dashboard.overview.eyebrow}
          title={messages.dashboard.overview.title}
        />
        <DashboardErrorState
          message={getApiErrorMessage(
            dashboardSummaryQuery.error,
            messages.dashboard.overview.errorFallback,
          )}
          onRetry={() => {
            void dashboardSummaryQuery.refetch();
          }}
        />
      </div>
    );
  }

  const summary = dashboardSummaryQuery.data;
  const isEmpty = getDashboardIsEmpty(summary.metrics, summary.recentActivities.length);

  return (
    <div className="space-y-6">
      <PageIntro
        description={messages.dashboard.overview.description}
        eyebrow={messages.dashboard.overview.eyebrow}
        title={messages.dashboard.overview.title}
      />

      {isEmpty ? <DashboardEmptyState /> : null}

      <DashboardMetricGrid metrics={summary.metrics} />

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <DashboardPipelineSummary metrics={summary.metrics} />
        <DashboardRecentActivities activities={summary.recentActivities} />
      </div>
    </div>
  );
}
