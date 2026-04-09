import type { UserRole } from '@crm-saas/types';

export type ClientOwner = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isActive: boolean;
};

export type ClientSourceLead = {
  id: string;
  name: string;
  status: 'NEW' | 'QUALIFIED' | 'CONTACTED' | 'CONVERTED' | 'LOST';
};

export type Client = {
  id: string;
  organizationId: string;
  name: string;
  email: string | null;
  phone: string | null;
  company: string | null;
  ownerUserId: string | null;
  owner: ClientOwner | null;
  sourceLeadId: string | null;
  sourceLead: ClientSourceLead | null;
  createdAt: string;
  updatedAt: string;
};

export type ClientsListResponse = {
  clients: Client[];
};

export type ClientResponse = {
  client: Client;
};

export type ClientFilters = {
  search?: string;
};

export type ClientFormValues = {
  company: string;
  email: string;
  name: string;
  ownerUserId: string;
  phone: string;
};

export type ClientOwnerOption = {
  id: string;
  name: string;
  email: string;
  isActive: boolean;
};
