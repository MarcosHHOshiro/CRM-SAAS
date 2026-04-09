import { UserRole } from '@crm-saas/types';

export function formatUserRole(role: UserRole) {
  const labels: Record<UserRole, string> = {
    [UserRole.OWNER]: 'Proprietario',
    [UserRole.MANAGER]: 'Gerente',
    [UserRole.SALES_REP]: 'Representante comercial',
  };

  return labels[role];
}
