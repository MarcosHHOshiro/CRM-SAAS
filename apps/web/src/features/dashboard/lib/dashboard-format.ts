import type { DashboardActivity, DashboardMetrics } from '../types/dashboard';

const currencyFormatter = new Intl.NumberFormat('en-US', {
  currency: 'USD',
  maximumFractionDigits: 0,
  style: 'currency',
});

const percentageFormatter = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 2,
  style: 'percent',
});

const dateTimeFormatter = new Intl.DateTimeFormat('en-US', {
  dateStyle: 'medium',
  timeStyle: 'short',
});

export function formatDashboardCurrency(value: string) {
  const parsedValue = Number(value);

  if (Number.isNaN(parsedValue)) {
    return currencyFormatter.format(0);
  }

  return currencyFormatter.format(parsedValue);
}

export function formatDashboardPercentage(value: number) {
  return percentageFormatter.format(value / 100);
}

export function formatDashboardDateTime(value: string) {
  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    return 'Unknown date';
  }

  return dateTimeFormatter.format(parsedDate);
}

export function getDashboardActivityLabel(activity: DashboardActivity) {
  const labels: Record<string, string> = {
    CALL: 'Call',
    EMAIL: 'Email',
    MEETING: 'Meeting',
    NOTE: 'Note',
    TASK: 'Task',
  };

  return labels[activity.type] ?? activity.type;
}

export function getDashboardActivityDescription(activity: DashboardActivity) {
  if (activity.description) {
    return activity.description;
  }

  const relation = getDashboardActivityRelation(activity);
  const activityLabel = getDashboardActivityLabel(activity).toLowerCase();

  if (relation) {
    return `${activityLabel} linked to ${relation}.`;
  }

  return `New ${activityLabel} activity recorded.`;
}

export function getDashboardActivityRelation(activity: DashboardActivity) {
  if (activity.opportunity) {
    return activity.opportunity.title;
  }

  if (activity.client) {
    return activity.client.name;
  }

  if (activity.lead) {
    return activity.lead.name;
  }

  return null;
}

export function getDashboardIsEmpty(metrics: DashboardMetrics, activitiesCount: number) {
  return (
    metrics.totalLeads === 0 &&
    metrics.totalClients === 0 &&
    metrics.openOpportunities === 0 &&
    metrics.wonOpportunities === 0 &&
    metrics.lostOpportunities === 0 &&
    Number(metrics.totalPipelineValue) === 0 &&
    activitiesCount === 0
  );
}
