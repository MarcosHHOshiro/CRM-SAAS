import type { UserRole } from '@crm-saas/types';

export type SessionOrganization = {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
};

export type SessionUser = {
  id: string;
  organizationId: string;
  name: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CurrentSession = {
  user: SessionUser;
  organization: SessionOrganization;
};

export type LoginValues = {
  email: string;
  password: string;
};

export type RegisterValues = {
  organizationName: string;
  organizationSlug?: string;
  name: string;
  email: string;
  password: string;
};
