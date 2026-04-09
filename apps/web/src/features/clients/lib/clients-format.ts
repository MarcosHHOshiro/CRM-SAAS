import type { AppMessages } from '@/i18n/messages/types';

import type { Client, ClientFilters, ClientFormValues, ClientOwnerOption } from '../types/clients';

export function formatClientDate(value: string, locale = 'en-US') {
  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    return locale === 'pt-BR' ? 'Data desconhecida' : 'Unknown date';
  }

  const dateTimeFormatter = new Intl.DateTimeFormat(locale, {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  return dateTimeFormatter.format(parsedDate);
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
