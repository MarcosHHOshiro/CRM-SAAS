import type { AppMessages } from '@/i18n/messages/types';

import type {
  Client,
  ClientDirectoryFilters,
  ClientFilters,
  ClientFormValues,
  ClientOwnerOption,
} from '../types/clients';

export function formatClientDate(value: string, locale = 'en-US') {
  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    return locale === 'pt-BR' ? 'Data desconhecida' : 'Unknown date';
  }

  const dateTimeFormatter = new Intl.DateTimeFormat(locale, {
    dateStyle: 'medium',
  });

  return dateTimeFormatter.format(parsedDate);
}

export function filterClients(clients: Client[], filters: ClientDirectoryFilters) {
  const now = Date.now();

  return clients.filter((client) => {
    if (filters.ownership === 'assigned' && !client.owner) {
      return false;
    }

    if (filters.ownership === 'unassigned' && client.owner) {
      return false;
    }

    if (filters.origin === 'lead' && !client.sourceLead) {
      return false;
    }

    if (filters.origin === 'direct' && client.sourceLead) {
      return false;
    }

    if (filters.period !== 'all') {
      const createdAt = new Date(client.createdAt).getTime();

      if (Number.isNaN(createdAt)) {
        return false;
      }

      const thresholdByPeriod = {
        '30d': 30,
        '90d': 90,
        '365d': 365,
      } as const;

      const maxAgeInDays = thresholdByPeriod[filters.period];
      const elapsedDays = (now - createdAt) / (1000 * 60 * 60 * 24);

      if (elapsedDays > maxAgeInDays) {
        return false;
      }
    }

    return true;
  });
}

export function getClientsMetrics(clients: Client[]) {
  const now = Date.now();

  return {
    newThisMonthCount: clients.filter((client) => {
      const createdAt = new Date(client.createdAt).getTime();

      if (Number.isNaN(createdAt)) {
        return false;
      }

      const elapsedDays = (now - createdAt) / (1000 * 60 * 60 * 24);

      return elapsedDays <= 30;
    }).length,
    totalCount: clients.length,
    unassignedCount: clients.filter((client) => !client.owner).length,
  };
}

export function getClientOwnerOptions(users: ClientOwnerOption[], messages: AppMessages) {
  return [
    { label: messages.clients.form.ownerUnassigned, value: '' },
    ...users.map((user) => ({
      label: `${user.name}${user.isActive ? '' : ` (${messages.clients.form.ownerInactiveSuffix})`}`,
      value: user.id,
    })),
  ];
}

export function buildClientFilters(searchParams: URLSearchParams): ClientFilters {
  const search = searchParams.get('search')?.trim() ?? '';

  return {
    ...(search ? { search } : {}),
  };
}

export function buildClientFiltersQueryString(filters: { search?: string }) {
  const params = new URLSearchParams();

  if (filters.search?.trim()) {
    params.set('search', filters.search.trim());
  }

  return params.toString();
}

export function getClientInitialFormValues(client?: Client): ClientFormValues {
  return {
    company: client?.company ?? '',
    email: client?.email ?? '',
    name: client?.name ?? '',
    ownerUserId: client?.ownerUserId ?? '',
    phone: client?.phone ?? '',
  };
}

export function getClientSuccessMessage(success: string | null, messages: AppMessages) {
  const successMessages: Record<string, string> = {
    created: messages.clients.list.successCreated,
    updated: messages.clients.list.successUpdated,
  };

  return success ? successMessages[success] ?? null : null;
}
