import type { UserRole } from '@crm-saas/types';

export const activityTypes = ['CALL', 'MEETING', 'EMAIL', 'NOTE', 'TASK'] as const;

export type ActivityType = (typeof activityTypes)[number];

export type ActivityAuthor = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
};

export type ActivityLead = {
  id: string;
  name: string;
  status: 'NEW' | 'QUALIFIED' | 'CONTACTED' | 'CONVERTED' | 'LOST';
};

export type ActivityClient = {
  id: string;
  name: string;
  company: string | null;
};

export type ActivityOpportunity = {
  id: string;
  title: string;
  stage: 'NEW' | 'QUALIFICATION' | 'PROPOSAL' | 'NEGOTIATION' | 'WON' | 'LOST';
  status: 'OPEN' | 'WON' | 'LOST';
  clientId: string;
};

export type Activity = {
  id: string;
  organizationId: string;
  authorUserId: string | null;
  type: ActivityType;
  description: string;
  leadId: string | null;
  clientId: string | null;
  opportunityId: string | null;
  author: ActivityAuthor | null;
  lead: ActivityLead | null;
  client: ActivityClient | null;
  opportunity: ActivityOpportunity | null;
  createdAt: string;
  updatedAt: string;
};

export type ActivitiesResponse = {
  activities: Activity[];
};

export type ActivityResponse = {
  activity: Activity;
};

export type ActivityFilters = {
  authorUserId?: string;
  clientId?: string;
  leadId?: string;
  opportunityId?: string;
  type?: ActivityType;
};

export type ActivityFormValues = {
  clientId: string;
  description: string;
  leadId: string;
  opportunityId: string;
  type: ActivityType;
};

export type ActivityUserOption = {
  id: string;
  name: string;
  email: string;
  isActive: boolean;
};

export type ActivityLeadOption = {
  id: string;
  name: string;
  status: string;
};

export type ActivityClientOption = {
  id: string;
  name: string;
  company: string | null;
};

export type ActivityOpportunityOption = {
  id: string;
  title: string;
  clientId: string;
  stage: string;
  status: string;
};
