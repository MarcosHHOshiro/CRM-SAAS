import type { AppLocale, AppMessages } from '@/i18n/messages/types';

import type {
  Activity,
  ActivityClientOption,
  ActivityFilters,
  ActivityFormValues,
  ActivityLeadOption,
  ActivityOpportunityOption,
  ActivityType,
  ActivityUserOption,
} from '../types/activities';

export function getActivityTypeLabels(messages: AppMessages): Record<ActivityType, string> {
  return {
    CALL: messages.activities.shared.typeCall,
    EMAIL: messages.activities.shared.typeEmail,
    MEETING: messages.activities.shared.typeMeeting,
    NOTE: messages.activities.shared.typeNote,
    TASK: messages.activities.shared.typeTask,
  };
}

export function getActivityTypeOptions(messages: AppMessages) {
  const activityTypeLabels = getActivityTypeLabels(messages);

  return [
    { label: messages.activities.shared.allTypes, value: '' },
    { label: activityTypeLabels.CALL, value: 'CALL' },
    { label: activityTypeLabels.MEETING, value: 'MEETING' },
    { label: activityTypeLabels.EMAIL, value: 'EMAIL' },
    { label: activityTypeLabels.NOTE, value: 'NOTE' },
    { label: activityTypeLabels.TASK, value: 'TASK' },
  ] as const;
}

export function getActivityFormTypeOptions(messages: AppMessages) {
  return getActivityTypeOptions(messages).filter((option) => option.value !== '');
}

export function formatActivityDate(value: string, locale: AppLocale, messages: AppMessages) {
  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    return messages.activities.shared.unknownDate;
  }

  const dateTimeFormatter = new Intl.DateTimeFormat(locale, {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  return dateTimeFormatter.format(parsedDate);
}

export function getActivityTypeLabel(type: ActivityType, messages: AppMessages) {
  return getActivityTypeLabels(messages)[type];
}

export function getActivityUserOptions(users: ActivityUserOption[], messages: AppMessages) {
  return [
    { label: messages.activities.shared.allAuthors, value: '' },
    ...users.map((user) => ({
      label: `${user.name}${user.isActive ? '' : ` (${messages.activities.shared.inactiveSuffix})`}`,
      value: user.id,
    })),
  ];
}

export function getActivityLeadOptions(leads: ActivityLeadOption[], messages: AppMessages) {
  return [
    { label: messages.activities.shared.allLeads, value: '' },
    ...leads.map((lead) => ({
      label: lead.name,
      value: lead.id,
    })),
  ];
}

export function getActivityClientOptions(clients: ActivityClientOption[], messages: AppMessages) {
  return [
    { label: messages.activities.shared.allClients, value: '' },
    ...clients.map((client) => ({
      label: client.company ? `${client.name} - ${client.company}` : client.name,
      value: client.id,
    })),
  ];
}

export function getActivityOpportunityOptions(opportunities: ActivityOpportunityOption[], messages: AppMessages) {
  return [
    { label: messages.activities.shared.allOpportunities, value: '' },
    ...opportunities.map((opportunity) => ({
      label: opportunity.title,
      value: opportunity.id,
    })),
  ];
}

export function buildActivityFilters(searchParams: URLSearchParams): ActivityFilters {
  const type = searchParams.get('type')?.trim() ?? '';
  const authorUserId = searchParams.get('authorUserId')?.trim() ?? '';
  const leadId = searchParams.get('leadId')?.trim() ?? '';
  const clientId = searchParams.get('clientId')?.trim() ?? '';
  const opportunityId = searchParams.get('opportunityId')?.trim() ?? '';

  return {
    ...(type ? { type: type as ActivityType } : {}),
    ...(authorUserId ? { authorUserId } : {}),
    ...(leadId ? { leadId } : {}),
    ...(clientId ? { clientId } : {}),
    ...(opportunityId ? { opportunityId } : {}),
  };
}

export function buildActivityFiltersQueryString(filters: {
  authorUserId?: string;
  clientId?: string;
  leadId?: string;
  opportunityId?: string;
  type?: string;
}) {
  const params = new URLSearchParams();

  if (filters.type?.trim()) {
    params.set('type', filters.type.trim());
  }

  if (filters.authorUserId?.trim()) {
    params.set('authorUserId', filters.authorUserId.trim());
  }

  if (filters.leadId?.trim()) {
    params.set('leadId', filters.leadId.trim());
  }

  if (filters.clientId?.trim()) {
    params.set('clientId', filters.clientId.trim());
  }

  if (filters.opportunityId?.trim()) {
    params.set('opportunityId', filters.opportunityId.trim());
  }

  return params.toString();
}

export function getActivityInitialFormValues(): ActivityFormValues {
  return {
    clientId: '',
    description: '',
    leadId: '',
    opportunityId: '',
    type: 'NOTE',
  };
}

export function getActivitySuccessMessage(success: string | null, appMessages: AppMessages) {
  const successMessages: Record<string, string> = {
    created: appMessages.activities.shared.successCreated,
  };

  return success ? successMessages[success] ?? null : null;
}

export function getActivityRelatedEntityLabel(activity: Activity, messages: AppMessages) {
  if (activity.opportunity) {
    return activity.opportunity.title;
  }

  if (activity.client) {
    return activity.client.company
      ? `${activity.client.name} - ${activity.client.company}`
      : activity.client.name;
  }

  if (activity.lead) {
    return activity.lead.name;
  }

  return messages.activities.shared.generalActivity;
}
