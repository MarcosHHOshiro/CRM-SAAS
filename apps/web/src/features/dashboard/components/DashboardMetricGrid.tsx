import { formatDashboardCurrency, formatDashboardPercentage } from '../lib/dashboard-format';
import type { DashboardMetrics } from '../types/dashboard';

import { DashboardMetricCard } from './DashboardMetricCard';

type DashboardMetricGridProps = Readonly<{
  metrics: DashboardMetrics;
}>;

export function DashboardMetricGrid({ metrics }: DashboardMetricGridProps) {
  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <DashboardMetricCard
        description="Total prospects currently tracked in the CRM."
        label="Total leads"
        value={String(metrics.totalLeads)}
      />
      <DashboardMetricCard
        accent="emerald"
        description="Customers already converted into active client records."
        label="Total clients"
        value={String(metrics.totalClients)}
      />
      <DashboardMetricCard
        description="Open deals still moving through the commercial pipeline."
        label="Open opportunities"
        value={String(metrics.openOpportunities)}
      />
      <DashboardMetricCard
        accent="emerald"
        description="Deals already marked as won."
        label="Won opportunities"
        value={String(metrics.wonOpportunities)}
      />
      <DashboardMetricCard
        accent="red"
        description="Deals closed as lost."
        label="Lost opportunities"
        value={String(metrics.lostOpportunities)}
      />
      <DashboardMetricCard
        accent="amber"
        description="Current value of open opportunities in the pipeline."
        label="Total pipeline value"
        value={formatDashboardCurrency(metrics.totalPipelineValue)}
      />
      <DashboardMetricCard
        accent="emerald"
        description="Share of leads that already became clients."
        label="Conversion rate"
        value={formatDashboardPercentage(metrics.conversionRate)}
      />
    </section>
  );
}
