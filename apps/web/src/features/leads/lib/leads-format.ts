import type { AppLocale, AppMessages } from '@/i18n/messages/types';
import type { Lead, LeadFilters, LeadFormValues, LeadOwnerOption, LeadStatus } from '../types/leads';

export function getLeadStatusLabels(messages: AppMessages): Record<LeadStatus, string> {
  return {
    NEW: messages.leads.shared.statusNew,
    QUALIFIED: messages.leads.shared.statusQualified,
    CONTACTED: messages.leads.shared.statusContacted,
    CONVERTED: messages.leads.shared.statusConverted,
    LOST: messages.leads.shared.statusLost,
  };
}

export function getLeadStatusOptions(messages: AppMessages) {
  const leadStatusLabels = getLeadStatusLabels(messages);

  return [
    { label: messages.leads.form.allStatuses, value: '' },
    { label: leadStatusLabels.NEW, value: 'NEW' },
    { label: leadStatusLabels.QUALIFIED, value: 'QUALIFIED' },
    { label: leadStatusLabels.CONTACTED, value: 'CONTACTED' },
    { label: leadStatusLabels.CONVERTED, value: 'CONVERTED' },
    { label: leadStatusLabels.LOST, value: 'LOST' },
  ] as const;
}

export function getLeadFormStatusOptions(messages: AppMessages) {
  return getLeadStatusOptions(messages).filter((option) => option.value !== '');
}

export function formatLeadStatus(status: LeadStatus, messages: AppMessages) {
  return getLeadStatusLabels(messages)[status];
}

export function formatLeadDate(value: string, locale: AppLocale, messages: AppMessages) {
  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    return messages.leads.shared.unknownDate;
  }

  const dateTimeFormatter = new Intl.DateTimeFormat(locale, {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  return dateTimeFormatter.format(parsedDate);
}

export function getLeadOwnerOptions(users: LeadOwnerOption[], messages: AppMessages) {
  return [
    { label: messages.leads.form.allOwners, value: '' },
    ...users.map((user) => ({
      label: `${user.name}${user.isActive ? '' : ` (${messages.leads.form.ownerInactiveSuffix})`}`,
      value: user.id,
    })),
  ];
}

export function getLeadFormOwnerOptions(users: LeadOwnerOption[], messages: AppMessages) {
  return [
    { label: messages.leads.form.ownerUnassigned, value: '' },
    ...users.map((user) => ({
      label: `${user.name}${user.isActive ? '' : ` (${messages.leads.form.ownerInactiveSuffix})`}`,
      value: user.id,
    })),
  ];
}

export function getLeadCanConvert(lead: Lead) {
  return lead.status !== 'CONVERTED' && !lead.clientId;
}

export function buildLeadFilters(searchParams: URLSearchParams): LeadFilters {
  const search = searchParams.get('search')?.trim() ?? '';
  const status = searchParams.get('status')?.trim() ?? '';
  const ownerUserId = searchParams.get('ownerUserId')?.trim() ?? '';

  return {
    ...(search ? { search } : {}),
    ...(status ? { status: status as LeadStatus } : {}),
    ...(ownerUserId ? { ownerUserId } : {}),
  };
}

export function buildLeadFiltersQueryString(filters: {
  ownerUserId?: string;
  search?: string;
  status?: string;
}) {
  const params = new URLSearchParams();

  if (filters.search?.trim()) {
    params.set('search', filters.search.trim());
  }

  if (filters.status?.trim()) {
    params.set('status', filters.status.trim());
  }

  if (filters.ownerUserId?.trim()) {
    params.set('ownerUserId', filters.ownerUserId.trim());
  }

  return params.toString();
}

export function getLeadInitialFormValues(lead?: Lead): LeadFormValues {
  return {
    company: lead?.company ?? '',
    email: lead?.email ?? '',
    name: lead?.name ?? '',
    notes: lead?.notes ?? '',
    ownerUserId: lead?.ownerUserId ?? '',
    phone: lead?.phone ?? '',
    status: lead?.status ?? 'NEW',
  };
}

export function getLeadSuccessMessage(success: string | null, appMessages: AppMessages) {
  const successMessages: Record<string, string> = {
    converted: appMessages.leads.shared.successConverted,
    created: appMessages.leads.shared.successCreated,
    deleted: appMessages.leads.shared.successDeleted,
    updated: appMessages.leads.shared.successUpdated,
  };

  return success ? successMessages[success] ?? null : null;
}
