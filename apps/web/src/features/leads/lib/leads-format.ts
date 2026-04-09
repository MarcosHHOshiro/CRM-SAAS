import type { Lead, LeadFilters, LeadFormValues, LeadOwnerOption, LeadStatus } from '../types/leads';

const dateTimeFormatter = new Intl.DateTimeFormat('en-US', {
  dateStyle: 'medium',
  timeStyle: 'short',
});

export const leadStatusLabels: Record<LeadStatus, string> = {
  NEW: 'Novo',
  QUALIFIED: 'Qualificado',
  CONTACTED: 'Contatado',
  CONVERTED: 'Convertido',
  LOST: 'Perdido',
};

export const leadStatusOptions = [
  { label: 'Todos os status', value: '' },
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
    return 'Data desconhecida';
  }

  return dateTimeFormatter.format(parsedDate);
}

export function getLeadOwnerOptions(users: LeadOwnerOption[]) {
  return [
    { label: 'Todos os responsaveis', value: '' },
    ...users.map((user) => ({
      label: `${user.name}${user.isActive ? '' : ' (Inativo)'}`,
      value: user.id,
    })),
  ];
}

export function getLeadFormOwnerOptions(users: LeadOwnerOption[]) {
  return [
    { label: 'Sem responsavel', value: '' },
    ...users.map((user) => ({
      label: `${user.name}${user.isActive ? '' : ' (Inativo)'}`,
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
    converted: 'Lead convertido em cliente com sucesso.',
    created: 'Lead criado com sucesso.',
    deleted: 'Lead removido com sucesso.',
    updated: 'Lead atualizado com sucesso.',
  };

  return success ? messages[success] ?? null : null;
}
