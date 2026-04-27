'use client';

import { useTranslation } from '@/i18n/use-translation';
import { formatDashboardCurrency, formatDashboardPercentage } from '../lib/dashboard-format';
import type { DashboardMetrics } from '../types/dashboard';

import { DashboardMetricCard } from './DashboardMetricCard';

type DashboardMetricGridProps = Readonly<{
  metrics: DashboardMetrics;
}>;

function UsersIcon() {
  return (
    <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24">
      <path d="M16 18v-1.2a3.8 3.8 0 0 0-3.8-3.8H7.8A3.8 3.8 0 0 0 4 16.8V18" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
      <circle cx="10" cy="7.5" r="3.2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M18 9v5M15.5 11.5h5" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
    </svg>
  );
}

function UserCheckIcon() {
  return (
    <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24">
      <path d="M16 18v-1a3.7 3.7 0 0 0-3.7-3.7H8A3.7 3.7 0 0 0 4.3 17v1" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
      <circle cx="10.2" cy="7.6" r="3.1" stroke="currentColor" strokeWidth="1.8" />
      <path d="m16.4 11.4 1.7 1.7 3-3.3" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
    </svg>
  );
}

function CircleDashedIcon() {
  return (
    <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="7.2" stroke="currentColor" strokeDasharray="3 3" strokeLinecap="round" strokeWidth="1.8" />
    </svg>
  );
}

function CheckCircleIcon() {
  return (
    <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="7.2" stroke="currentColor" strokeWidth="1.8" />
      <path d="m8.7 12.2 2.1 2.1 4.7-5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
    </svg>
  );
}

function XCircleIcon() {
  return (
    <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="7.2" stroke="currentColor" strokeWidth="1.8" />
      <path d="m9.7 9.7 4.6 4.6M14.3 9.7l-4.6 4.6" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
    </svg>
  );
}

function DollarIcon() {
  return (
    <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24">
      <path d="M12 4v16M15.5 7.2h-5.1a2.4 2.4 0 0 0 0 4.8h3.2a2.4 2.4 0 0 1 0 4.8H8.5" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
    </svg>
  );
}

function PercentIcon() {
  return (
    <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24">
      <path d="m18 6-12 12" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
      <circle cx="7.5" cy="7.5" r="1.8" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="16.5" cy="16.5" r="1.8" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

export function DashboardMetricGrid({ metrics }: DashboardMetricGridProps) {
  const { locale, messages } = useTranslation();

  return (
    <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
      <DashboardMetricCard
        accent="blue"
        description={messages.dashboard.metrics.totalLeadsDescription}
        icon={<UsersIcon />}
        label={messages.dashboard.metrics.totalLeads}
        value={String(metrics.totalLeads)}
      />
      <DashboardMetricCard
        accent="emerald"
        description={messages.dashboard.metrics.totalClientsDescription}
        icon={<UserCheckIcon />}
        label={messages.dashboard.metrics.totalClients}
        value={String(metrics.totalClients)}
      />
      <DashboardMetricCard
        accent="amber"
        description={messages.dashboard.metrics.openOpportunitiesDescription}
        icon={<CircleDashedIcon />}
        label={messages.dashboard.metrics.openOpportunities}
        value={String(metrics.openOpportunities)}
      />
      <DashboardMetricCard
        accent="emerald"
        description={messages.dashboard.metrics.wonOpportunitiesDescription}
        icon={<CheckCircleIcon />}
        label={messages.dashboard.metrics.wonOpportunities}
        value={String(metrics.wonOpportunities)}
      />
      <DashboardMetricCard
        accent="red"
        description={messages.dashboard.metrics.lostOpportunitiesDescription}
        icon={<XCircleIcon />}
        label={messages.dashboard.metrics.lostOpportunities}
        value={String(metrics.lostOpportunities)}
      />
      <DashboardMetricCard
        accent="blue"
        description={messages.dashboard.metrics.totalPipelineValueDescription}
        featured
        icon={<DollarIcon />}
        label={messages.dashboard.metrics.totalPipelineValue}
        value={formatDashboardCurrency(metrics.totalPipelineValue, locale)}
      />
      <DashboardMetricCard
        accent="violet"
        description={messages.dashboard.metrics.conversionRateDescription}
        icon={<PercentIcon />}
        label={messages.dashboard.metrics.conversionRate}
        value={formatDashboardPercentage(metrics.conversionRate, locale)}
      />
    </section>
  );
}
