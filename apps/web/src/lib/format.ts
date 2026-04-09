import { UserRole } from '@crm-saas/types';

export function formatUserRole(role: UserRole) {
  const labels: Record<UserRole, string> = {
    [UserRole.OWNER]: 'Owner',
    [UserRole.MANAGER]: 'Manager',
    [UserRole.SALES_REP]: 'Sales rep',
  };

  return labels[role];
}
