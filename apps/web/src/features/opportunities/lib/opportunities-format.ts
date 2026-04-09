import type {
  Opportunity,
  OpportunityClientOption,
  OpportunityFilters,
  OpportunityFormValues,
  OpportunityOwnerOption,
  OpportunityStage,
  OpportunityStatus,
} from '../types/opportunities';

const currencyFormatter = new Intl.NumberFormat('en-US', {
  currency: 'USD',
  maximumFractionDigits: 0,
  style: 'currency',
});

const dateTimeFormatter = new Intl.DateTimeFormat('en-US', {
  dateStyle: 'medium',
  timeStyle: 'short',
});

export const opportunityStageLabels: Record<OpportunityStage, string> = {
  LOST: 'Lost',
  NEGOTIATION: 'Negotiation',
  NEW: 'New',
  PROPOSAL: 'Proposal',
  QUALIFICATION: 'Qualification',
  WON: 'Won',
};

export const opportunityStatusLabels: Record<OpportunityStatus, string> = {
  LOST: 'Lost',
  OPEN: 'Open',
  WON: 'Won',
};

export const opportunityStageOptions = [
  { label: 'All stages', value: '' },
  { label: opportunityStageLabels.NEW, value: 'NEW' },
  { label: opportunityStageLabels.QUALIFICATION, value: 'QUALIFICATION' },
  { label: opportunityStageLabels.PROPOSAL, value: 'PROPOSAL' },
  { label: opportunityStageLabels.NEGOTIATION, value: 'NEGOTIATION' },
  { label: opportunityStageLabels.WON, value: 'WON' },
  { label: opportunityStageLabels.LOST, value: 'LOST' },
] as const;

export const opportunityFormStageOptions = opportunityStageOptions.filter(
  (option) => option.value !== '',
);

export const opportunityStatusOptions = [
  { label: 'All statuses', value: '' },
  { label: opportunityStatusLabels.OPEN, value: 'OPEN' },
  { label: opportunityStatusLabels.WON, value: 'WON' },
  { label: opportunityStatusLabels.LOST, value: 'LOST' },
] as const;

export const opportunitySortOptions = [
  { label: 'Newest first', order: 'desc', sortBy: 'createdAt' },
  { label: 'Oldest first', order: 'asc', sortBy: 'createdAt' },
  { label: 'Highest value', order: 'desc', sortBy: 'estimatedValue' },
  { label: 'Lowest value', order: 'asc', sortBy: 'estimatedValue' },
  { label: 'Expected close date', order: 'asc', sortBy: 'expectedCloseDate' },
] as const;

export function formatOpportunityCurrency(value: string) {
  const parsedValue = Number(value);

  if (Number.isNaN(parsedValue)) {
    return currencyFormatter.format(0);
  }

  return currencyFormatter.format(parsedValue);
}

export function formatOpportunityDate(value: string | null) {
  if (!value) {
    return 'Not scheduled';
  }

  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    return 'Unknown date';
  }

  return dateTimeFormatter.format(parsedDate);
}

export function getOpportunityOwnerOptions(users: OpportunityOwnerOption[]) {
  return [
    { label: 'All owners', value: '' },
    ...users.map((user) => ({
      label: `${user.name}${user.isActive ? '' : ' (Inactive)'}`,
      value: user.id,
    })),
  ];
}

export function getOpportunityFormOwnerOptions(users: OpportunityOwnerOption[]) {
  return [
    { label: 'Unassigned', value: '' },
    ...users.map((user) => ({
      label: `${user.name}${user.isActive ? '' : ' (Inactive)'}`,
      value: user.id,
    })),
  ];
}

export function getOpportunityClientOptions(clients: OpportunityClientOption[]) {
  return [
    { label: 'Select a client', value: '' },
    ...clients.map((client) => ({
      label: client.company ? `${client.name} - ${client.company}` : client.name,
      value: client.id,
    })),
  ];
}

export function buildOpportunityFilters(searchParams: URLSearchParams): OpportunityFilters {
  const search = searchParams.get('search')?.trim() ?? '';
  const stage = searchParams.get('stage')?.trim() ?? '';
  const status = searchParams.get('status')?.trim() ?? '';
  const ownerUserId = searchParams.get('ownerUserId')?.trim() ?? '';
  const sortBy = searchParams.get('sortBy')?.trim() ?? '';
  const order = searchParams.get('order')?.trim() ?? '';

  return {
    ...(search ? { search } : {}),
    ...(stage ? { stage: stage as OpportunityStage } : {}),
    ...(status ? { status: status as OpportunityStatus } : {}),
    ...(ownerUserId ? { ownerUserId } : {}),
    ...(sortBy
      ? {
          sortBy: sortBy as NonNullable<OpportunityFilters['sortBy']>,
        }
      : {}),
    ...(order ? { order: order as NonNullable<OpportunityFilters['order']> } : {}),
  };
}

export function buildOpportunityFiltersQueryString(filters: {
  order?: string;
  ownerUserId?: string;
  search?: string;
  sortBy?: string;
  stage?: string;
  status?: string;
}) {
  const params = new URLSearchParams();

  if (filters.search?.trim()) {
    params.set('search', filters.search.trim());
  }

  if (filters.stage?.trim()) {
    params.set('stage', filters.stage.trim());
  }

  if (filters.status?.trim()) {
    params.set('status', filters.status.trim());
  }

  if (filters.ownerUserId?.trim()) {
    params.set('ownerUserId', filters.ownerUserId.trim());
  }

  if (filters.sortBy?.trim()) {
    params.set('sortBy', filters.sortBy.trim());
  }

  if (filters.order?.trim()) {
    params.set('order', filters.order.trim());
  }

  return params.toString();
}

export function getOpportunityInitialFormValues(
  opportunity?: Opportunity,
): OpportunityFormValues {
  return {
    clientId: opportunity?.clientId ?? '',
    estimatedValue: opportunity?.estimatedValue ?? '',
    expectedCloseDate: opportunity?.expectedCloseDate?.slice(0, 10) ?? '',
    notes: opportunity?.notes ?? '',
    ownerUserId: opportunity?.ownerUserId ?? '',
    stage: opportunity?.stage ?? 'NEW',
    title: opportunity?.title ?? '',
  };
}

export function getOpportunitySuccessMessage(success: string | null) {
  const messages: Record<string, string> = {
    created: 'Opportunity created successfully.',
    stageUpdated: 'Opportunity stage updated successfully.',
    updated: 'Opportunity updated successfully.',
  };

  return success ? messages[success] ?? null : null;
}
