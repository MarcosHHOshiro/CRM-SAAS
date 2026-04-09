'use client';

import { useTranslation } from '@/i18n/use-translation';
import { formatDashboardCurrency, formatDashboardPercentage } from '../lib/dashboard-format';
import type { DashboardMetrics } from '../types/dashboard';

import { DashboardMetricCard } from './DashboardMetricCard';

type DashboardMetricGridProps = Readonly<{
  metrics: DashboardMetrics;
}>;

export function DashboardMetricGrid({ metrics }: DashboardMetricGridProps) {
  const { locale, messages } = useTranslation();

  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <DashboardMetricCard
        description={messages.dashboard.metrics.totalLeadsDescription}
        label={messages.dashboard.metrics.totalLeads}
        value={String(metrics.totalLeads)}
      />
      <DashboardMetricCard
        accent="emerald"
        description={messages.dashboard.metrics.totalClientsDescription}
        label={messages.dashboard.metrics.totalClients}
        value={String(metrics.totalClients)}
      />
      <DashboardMetricCard
        description={messages.dashboard.metrics.openOpportunitiesDescription}
        label={messages.dashboard.metrics.openOpportunities}
        value={String(metrics.openOpportunities)}
      />
      <DashboardMetricCard
        accent="emerald"
        description={messages.dashboard.metrics.wonOpportunitiesDescription}
        label={messages.dashboard.metrics.wonOpportunities}
        value={String(metrics.wonOpportunities)}
      />
      <DashboardMetricCard
        accent="red"
        description={messages.dashboard.metrics.lostOpportunitiesDescription}
        label={messages.dashboard.metrics.lostOpportunities}
        value={String(metrics.lostOpportunities)}
      />
      <DashboardMetricCard
        accent="amber"
        description={messages.dashboard.metrics.totalPipelineValueDescription}
        label={messages.dashboard.metrics.totalPipelineValue}
        value={formatDashboardCurrency(metrics.totalPipelineValue, locale)}
      />
      <DashboardMetricCard
        accent="emerald"
        description={messages.dashboard.metrics.conversionRateDescription}
        label={messages.dashboard.metrics.conversionRate}
        value={formatDashboardPercentage(metrics.conversionRate, locale)}
      />
    </section>
  );
}
