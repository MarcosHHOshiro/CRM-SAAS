export enum UserRole {
  OWNER = 'OWNER',
  MANAGER = 'MANAGER',
  SALES_REP = 'SALES_REP',
}

export interface OrganizationScopedEntity {
  id: string;
  organizationId: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthenticatedUser {
  id: string;
  organizationId: string;
  email: string;
  role: UserRole;
}

