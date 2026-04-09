import type { UserRole } from '@crm-saas/types';

export type UserRecord = {
  id: string;
  organizationId: string;
  name: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type UsersResponse = {
  users: UserRecord[];
};

export type UserResponse = {
  user: UserRecord;
};

export type UserFormValues = {
  email: string;
  name: string;
  password: string;
  role: UserRole;
};

export type EditUserFormValues = {
  name: string;
  role: UserRole;
};
