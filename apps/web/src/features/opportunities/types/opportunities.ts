import type { UserRole } from '@crm-saas/types';

export const opportunityStages = [
  'NEW',
  'QUALIFICATION',
  'PROPOSAL',
  'NEGOTIATION',
  'WON',
  'LOST',
] as const;

export const opportunityStatuses = ['OPEN', 'WON', 'LOST'] as const;

export type OpportunityStage = (typeof opportunityStages)[number];
export type OpportunityStatus = (typeof opportunityStatuses)[number];

export type OpportunityOwner = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isActive: boolean;
};

export type OpportunityClient = {
  id: string;
  name: string;
  email: string | null;
  company: string | null;
};

export type Opportunity = {
  id: string;
  organizationId: string;
  clientId: string;
  ownerUserId: string | null;
  title: string;
  stage: OpportunityStage;
  status: OpportunityStatus;
  estimatedValue: string;
  expectedCloseDate: string | null;
  notes: string | null;
  client: OpportunityClient;
  owner: OpportunityOwner | null;
  createdAt: string;
  updatedAt: string;
};

export type OpportunitiesListResponse = {
  opportunities: Opportunity[];
};

export type OpportunityGroup = {
  stage: OpportunityStage;
  opportunities: Opportunity[];
};

export type OpportunitiesGroupedResponse = {
  groups: OpportunityGroup[];
};

export type OpportunityResponse = {
  opportunity: Opportunity;
};

export type OpportunityFilters = {
  order?: 'asc' | 'desc';
  ownerUserId?: string;
  search?: string;
  sortBy?:
    | 'createdAt'
    | 'title'
    | 'stage'
    | 'status'
    | 'expectedCloseDate'
    | 'estimatedValue';
  stage?: OpportunityStage;
  status?: OpportunityStatus;
};

export type OpportunityFormValues = {
  clientId: string;
  estimatedValue: string;
  expectedCloseDate: string;
  notes: string;
  ownerUserId: string;
  stage: OpportunityStage;
  title: string;
};

export type OpportunityOwnerOption = {
  id: string;
  name: string;
  email: string;
  isActive: boolean;
};

export type OpportunityClientOption = {
  id: string;
  name: string;
  company: string | null;
};
