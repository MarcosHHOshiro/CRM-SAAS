import type { AppLocale, AppMessages } from '@/i18n/messages/types';
import type { DashboardActivity, DashboardMetrics } from '../types/dashboard';

export function formatDashboardCurrency(value: string, locale: AppLocale) {
  const parsedValue = Number(value);
  const currencyFormatter = new Intl.NumberFormat(locale, {
    currency: 'USD',
    maximumFractionDigits: 0,
    style: 'currency',
  });

  if (Number.isNaN(parsedValue)) {
    return currencyFormatter.format(0);
  }

  return currencyFormatter.format(parsedValue);
}

export function formatDashboardPercentage(value: number, locale: AppLocale) {
  const percentageFormatter = new Intl.NumberFormat(locale, {
    maximumFractionDigits: 2,
    style: 'percent',
  });

  return percentageFormatter.format(value / 100);
}

export function formatDashboardDateTime(value: string, locale: AppLocale, messages: AppMessages) {
  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    return messages.dashboard.shared.unknownDate;
  }

  const dateTimeFormatter = new Intl.DateTimeFormat(locale, {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  return dateTimeFormatter.format(parsedDate);
}

export function getDashboardActivityLabel(activity: DashboardActivity, messages: AppMessages) {
  const labels: Record<string, string> = {
    CALL: messages.dashboard.activityTypes.CALL,
    EMAIL: messages.dashboard.activityTypes.EMAIL,
    MEETING: messages.dashboard.activityTypes.MEETING,
    NOTE: messages.dashboard.activityTypes.NOTE,
    TASK: messages.dashboard.activityTypes.TASK,
  };

  return labels[activity.type] ?? activity.type;
}

export function getDashboardActivityDescription(activity: DashboardActivity, messages: AppMessages) {
  if (activity.description) {
    return activity.description;
  }

  const relation = getDashboardActivityRelation(activity);
  const activityLabel = getDashboardActivityLabel(activity, messages).toLowerCase();

  if (relation) {
    return `${activityLabel} ${messages.dashboard.shared.linkedTo} ${relation}.`;
  }

  return `${messages.dashboard.shared.newRecorded} ${activityLabel}.`;
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
