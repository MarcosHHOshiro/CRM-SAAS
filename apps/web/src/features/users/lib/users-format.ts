import { UserRole } from '@crm-saas/types';
import type { AppMessages } from '@/i18n/messages/types';
import type { AppLocale } from '@/i18n/messages/types';

import type { EditUserFormValues, UserFormValues, UserRecord } from '../types/users';
export function formatUserDate(value: string, locale: AppLocale) {
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

export function getAvailableRoleOptions(actorRole: UserRole, messages: AppMessages) {
  const baseOptions = [
    { label: messages.roles.OWNER, value: UserRole.OWNER },
    { label: messages.roles.MANAGER, value: UserRole.MANAGER },
    { label: messages.roles.SALES_REP, value: UserRole.SALES_REP },
  ];

  if (actorRole === UserRole.MANAGER) {
    return baseOptions.filter((option) => option.value !== UserRole.OWNER);
  }

  return baseOptions;
}

export function getCreateUserInitialValues(): UserFormValues {
  return {
    email: '',
    name: '',
    password: '',
    role: UserRole.SALES_REP,
  };
}

export function getEditUserInitialValues(user: UserRecord): EditUserFormValues {
  return {
    name: user.name,
    role: user.role,
  };
}

export function getUsersSuccessMessage(success: string | null, appMessages: AppMessages) {
  const successMessages: Record<string, string> = {
    created: appMessages.users.list.successCreated,
    updated: appMessages.users.list.successUpdated,
  };

  return success ? successMessages[success] ?? null : null;
}
