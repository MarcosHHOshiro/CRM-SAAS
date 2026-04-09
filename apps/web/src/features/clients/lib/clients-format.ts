import type { Client, ClientFilters, ClientFormValues, ClientOwnerOption } from '../types/clients';

const dateTimeFormatter = new Intl.DateTimeFormat('en-US', {
  dateStyle: 'medium',
  timeStyle: 'short',
});

export function formatClientDate(value: string) {
  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    return 'Unknown date';
  }

  return dateTimeFormatter.format(parsedDate);
}

export function getClientOwnerOptions(users: ClientOwnerOption[]) {
  return [
    { label: 'Unassigned', value: '' },
    ...users.map((user) => ({
      label: `${user.name}${user.isActive ? '' : ' (Inactive)'}`,
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

export function getClientSuccessMessage(success: string | null) {
  const messages: Record<string, string> = {
    created: 'Client created successfully.',
    updated: 'Client updated successfully.',
  };

  return success ? messages[success] ?? null : null;
}
