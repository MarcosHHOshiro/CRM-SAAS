'use client';

import { PageIntro } from '@/components/PageIntro';
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

  if (dashboardSummaryQuery.isPending) {
    return <DashboardSkeleton />;
  }

  if (dashboardSummaryQuery.isError) {
    return (
      <div className="space-y-6">
        <PageIntro
          description="Track your sales funnel, client base, recent activity, and conversion performance in one place."
          eyebrow="Dashboard"
          title="Commercial performance overview"
        />
        <DashboardErrorState
          message={getApiErrorMessage(
            dashboardSummaryQuery.error,
            'Please confirm the backend is running and try again.',
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
        description="Track your sales funnel, client base, recent activity, and conversion performance in one place."
        eyebrow="Dashboard"
        title="Commercial performance overview"
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
