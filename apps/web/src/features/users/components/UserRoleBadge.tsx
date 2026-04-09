import type { UserRole } from '@crm-saas/types';

import { userRoleLabels } from '../lib/users-format';

type UserRoleBadgeProps = Readonly<{
  role: UserRole;
}>;

const roleClasses: Record<UserRole, string> = {
  MANAGER: 'bg-sky-100 text-sky-800',
  OWNER: 'bg-amber-100 text-amber-800',
  SALES_REP: 'bg-emerald-100 text-emerald-800',
};

export function UserRoleBadge({ role }: UserRoleBadgeProps) {
  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${roleClasses[role]}`}>
      {userRoleLabels[role]}
    </span>
  );
}
