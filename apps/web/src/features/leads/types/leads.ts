import type { UserRole } from '@crm-saas/types';

export const leadStatuses = ['NEW', 'QUALIFIED', 'CONTACTED', 'CONVERTED', 'LOST'] as const;

export type LeadStatus = (typeof leadStatuses)[number];

export type LeadOwner = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isActive: boolean;
};

export type Lead = {
  id: string;
  organizationId: string;
  name: string;
  email: string | null;
  phone: string | null;
  company: string | null;
  status: LeadStatus;
  notes: string | null;
  ownerUserId: string | null;
  owner: LeadOwner | null;
  clientId: string | null;
  createdAt: string;
  updatedAt: string;
};

export type LeadClient = {
  id: string;
  organizationId: string;
  name: string;
  email: string | null;
  phone: string | null;
  company: string | null;
  ownerUserId: string | null;
  sourceLeadId: string | null;
  createdAt: string;
  updatedAt: string;
};

export type LeadsListResponse = {
  leads: Lead[];
};

export type LeadResponse = {
  lead: Lead;
};

export type ConvertLeadResponse = {
  client: LeadClient;
  lead: Lead;
};

export type LeadFilters = {
  ownerUserId?: string;
  search?: string;
  status?: LeadStatus;
};

export type LeadFormValues = {
  company: string;
  email: string;
  name: string;
  notes: string;
  ownerUserId: string;
  phone: string;
  status: LeadStatus;
};

export type LeadOwnerOption = {
  id: string;
  name: string;
  email: string;
  isActive: boolean;
};
