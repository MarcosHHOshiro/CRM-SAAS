import { UserRole } from '@crm-saas/types';

import type { EditUserFormValues, UserFormValues, UserRecord } from '../types/users';

const dateTimeFormatter = new Intl.DateTimeFormat('en-US', {
  dateStyle: 'medium',
  timeStyle: 'short',
});

export const userRoleLabels: Record<UserRole, string> = {
  [UserRole.MANAGER]: 'Manager',
  [UserRole.OWNER]: 'Owner',
  [UserRole.SALES_REP]: 'Sales rep',
};

export function formatUserDate(value: string) {
  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    return 'Unknown date';
  }

  return dateTimeFormatter.format(parsedDate);
}

export function getAvailableRoleOptions(actorRole: UserRole) {
  const baseOptions = [
    { label: userRoleLabels[UserRole.OWNER], value: UserRole.OWNER },
    { label: userRoleLabels[UserRole.MANAGER], value: UserRole.MANAGER },
    { label: userRoleLabels[UserRole.SALES_REP], value: UserRole.SALES_REP },
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

export function getUsersSuccessMessage(success: string | null) {
  const messages: Record<string, string> = {
    created: 'User created successfully.',
    updated: 'User updated successfully.',
  };

  return success ? messages[success] ?? null : null;
}
