import type { AppLocale, AppMessages } from '@/i18n/messages/types';

import type {
  Opportunity,
  OpportunityClientOption,
  OpportunityFilters,
  OpportunityFormValues,
  OpportunityOwnerOption,
  OpportunityStage,
  OpportunityStatus,
} from '../types/opportunities';

export function getOpportunityStageLabels(messages: AppMessages): Record<OpportunityStage, string> {
  return {
    LOST: messages.opportunities.shared.stageLost,
    NEGOTIATION: messages.opportunities.shared.stageNegotiation,
    NEW: messages.opportunities.shared.stageNew,
    PROPOSAL: messages.opportunities.shared.stageProposal,
    QUALIFICATION: messages.opportunities.shared.stageQualification,
    WON: messages.opportunities.shared.stageWon,
  };
}

export function getOpportunityStatusLabels(messages: AppMessages): Record<OpportunityStatus, string> {
  return {
    LOST: messages.opportunities.shared.statusLost,
    OPEN: messages.opportunities.shared.statusOpen,
    WON: messages.opportunities.shared.statusWon,
  };
}

export function getOpportunityStageOptions(messages: AppMessages) {
  const opportunityStageLabels = getOpportunityStageLabels(messages);

  return [
    { label: messages.opportunities.shared.allStages, value: '' },
    { label: opportunityStageLabels.NEW, value: 'NEW' },
    { label: opportunityStageLabels.QUALIFICATION, value: 'QUALIFICATION' },
    { label: opportunityStageLabels.PROPOSAL, value: 'PROPOSAL' },
    { label: opportunityStageLabels.NEGOTIATION, value: 'NEGOTIATION' },
    { label: opportunityStageLabels.WON, value: 'WON' },
    { label: opportunityStageLabels.LOST, value: 'LOST' },
  ] as const;
}

export function getOpportunityFormStageOptions(messages: AppMessages) {
  return getOpportunityStageOptions(messages).filter((option) => option.value !== '');
}

export function getOpportunityStatusOptions(messages: AppMessages) {
  const opportunityStatusLabels = getOpportunityStatusLabels(messages);

  return [
    { label: messages.opportunities.shared.allStatuses, value: '' },
    { label: opportunityStatusLabels.OPEN, value: 'OPEN' },
    { label: opportunityStatusLabels.WON, value: 'WON' },
    { label: opportunityStatusLabels.LOST, value: 'LOST' },
  ] as const;
}

export function getOpportunitySortOptions(messages: AppMessages) {
  return [
    { label: messages.opportunities.shared.newestFirst, order: 'desc', sortBy: 'createdAt' },
    { label: messages.opportunities.shared.oldestFirst, order: 'asc', sortBy: 'createdAt' },
    { label: messages.opportunities.shared.highestValue, order: 'desc', sortBy: 'estimatedValue' },
    { label: messages.opportunities.shared.lowestValue, order: 'asc', sortBy: 'estimatedValue' },
    { label: messages.opportunities.shared.expectedCloseSort, order: 'asc', sortBy: 'expectedCloseDate' },
  ] as const;
}

export function formatOpportunityCurrency(value: string, locale: AppLocale) {
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

export function formatOpportunityDate(value: string | null, locale: AppLocale, messages: AppMessages) {
  if (!value) {
    return messages.opportunities.shared.unscheduled;
  }

  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    return messages.opportunities.shared.unknownDate;
  }

  const dateTimeFormatter = new Intl.DateTimeFormat(locale, {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  return dateTimeFormatter.format(parsedDate);
}

export function getOpportunityOwnerOptions(users: OpportunityOwnerOption[], messages: AppMessages) {
  return [
    { label: messages.opportunities.shared.allOwners, value: '' },
    ...users.map((user) => ({
      label: `${user.name}${user.isActive ? '' : ` (${messages.opportunities.form.ownerInactiveSuffix})`}`,
      value: user.id,
    })),
  ];
}

export function getOpportunityFormOwnerOptions(users: OpportunityOwnerOption[], messages: AppMessages) {
  return [
    { label: messages.opportunities.form.ownerUnassigned, value: '' },
    ...users.map((user) => ({
      label: `${user.name}${user.isActive ? '' : ` (${messages.opportunities.form.ownerInactiveSuffix})`}`,
      value: user.id,
    })),
  ];
}

export function getOpportunityClientOptions(clients: OpportunityClientOption[], messages: AppMessages) {
  return [
    { label: messages.opportunities.form.clientPlaceholder, value: '' },
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

export function getOpportunitySuccessMessage(success: string | null, appMessages: AppMessages) {
  const successMessages: Record<string, string> = {
    created: appMessages.opportunities.shared.successCreated,
    stageUpdated: appMessages.opportunities.shared.successStageUpdated,
    updated: appMessages.opportunities.shared.successUpdated,
  };

  return success ? successMessages[success] ?? null : null;
}
