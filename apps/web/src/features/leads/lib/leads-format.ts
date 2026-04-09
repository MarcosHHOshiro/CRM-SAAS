import type { Lead, LeadFilters, LeadFormValues, LeadOwnerOption, LeadStatus } from '../types/leads';

const dateTimeFormatter = new Intl.DateTimeFormat('en-US', {
  dateStyle: 'medium',
  timeStyle: 'short',
});

export const leadStatusLabels: Record<LeadStatus, string> = {
  NEW: 'New',
  QUALIFIED: 'Qualified',
  CONTACTED: 'Contacted',
  CONVERTED: 'Converted',
  LOST: 'Lost',
};

export const leadStatusOptions = [
  { label: 'All statuses', value: '' },
  { label: leadStatusLabels.NEW, value: 'NEW' },
  { label: leadStatusLabels.QUALIFIED, value: 'QUALIFIED' },
  { label: leadStatusLabels.CONTACTED, value: 'CONTACTED' },
  { label: leadStatusLabels.CONVERTED, value: 'CONVERTED' },
  { label: leadStatusLabels.LOST, value: 'LOST' },
] as const;

export const leadFormStatusOptions = leadStatusOptions.filter((option) => option.value !== '');

export function formatLeadStatus(status: LeadStatus) {
  return leadStatusLabels[status];
}

export function formatLeadDate(value: string) {
  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    return 'Unknown date';
  }

  return dateTimeFormatter.format(parsedDate);
}

export function getLeadOwnerOptions(users: LeadOwnerOption[]) {
  return [
    { label: 'All owners', value: '' },
    ...users.map((user) => ({
      label: `${user.name}${user.isActive ? '' : ' (Inactive)'}`,
      value: user.id,
    })),
  ];
}

export function getLeadFormOwnerOptions(users: LeadOwnerOption[]) {
  return [
    { label: 'Unassigned', value: '' },
    ...users.map((user) => ({
      label: `${user.name}${user.isActive ? '' : ' (Inactive)'}`,
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

export function getLeadSuccessMessage(success: string | null) {
  const messages: Record<string, string> = {
    converted: 'Lead converted into a client successfully.',
    created: 'Lead created successfully.',
    deleted: 'Lead deleted successfully.',
    updated: 'Lead updated successfully.',
  };

  return success ? messages[success] ?? null : null;
}
