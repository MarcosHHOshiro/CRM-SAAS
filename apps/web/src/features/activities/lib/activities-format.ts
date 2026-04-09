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

const dateTimeFormatter = new Intl.DateTimeFormat('en-US', {
  dateStyle: 'medium',
  timeStyle: 'short',
});

export const activityTypeLabels: Record<ActivityType, string> = {
  CALL: 'Call',
  EMAIL: 'Email',
  MEETING: 'Meeting',
  NOTE: 'Note',
  TASK: 'Task',
};

export const activityTypeOptions = [
  { label: 'All types', value: '' },
  { label: activityTypeLabels.CALL, value: 'CALL' },
  { label: activityTypeLabels.MEETING, value: 'MEETING' },
  { label: activityTypeLabels.EMAIL, value: 'EMAIL' },
  { label: activityTypeLabels.NOTE, value: 'NOTE' },
  { label: activityTypeLabels.TASK, value: 'TASK' },
] as const;

export const activityFormTypeOptions = activityTypeOptions.filter((option) => option.value !== '');

export function formatActivityDate(value: string) {
  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    return 'Unknown date';
  }

  return dateTimeFormatter.format(parsedDate);
}

export function getActivityTypeLabel(type: ActivityType) {
  return activityTypeLabels[type];
}

export function getActivityUserOptions(users: ActivityUserOption[]) {
  return [
    { label: 'All authors', value: '' },
    ...users.map((user) => ({
      label: `${user.name}${user.isActive ? '' : ' (Inactive)'}`,
      value: user.id,
    })),
  ];
}

export function getActivityLeadOptions(leads: ActivityLeadOption[]) {
  return [
    { label: 'All leads', value: '' },
    ...leads.map((lead) => ({
      label: lead.name,
      value: lead.id,
    })),
  ];
}

export function getActivityClientOptions(clients: ActivityClientOption[]) {
  return [
    { label: 'All clients', value: '' },
    ...clients.map((client) => ({
      label: client.company ? `${client.name} - ${client.company}` : client.name,
      value: client.id,
    })),
  ];
}

export function getActivityOpportunityOptions(opportunities: ActivityOpportunityOption[]) {
  return [
    { label: 'All opportunities', value: '' },
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

export function getActivitySuccessMessage(success: string | null) {
  const messages: Record<string, string> = {
    created: 'Activity created successfully.',
  };

  return success ? messages[success] ?? null : null;
}

export function getActivityRelatedEntityLabel(activity: Activity) {
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

  return 'General activity';
}
