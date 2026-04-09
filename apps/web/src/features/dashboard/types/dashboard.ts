export type DashboardMetrics = {
  totalLeads: number;
  totalClients: number;
  openOpportunities: number;
  wonOpportunities: number;
  lostOpportunities: number;
  totalPipelineValue: string;
  conversionRate: number;
};

export type DashboardActivityAuthor = {
  id: string;
  name: string;
  email: string;
  role: string;
};

export type DashboardActivityLead = {
  id: string;
  name: string;
};

export type DashboardActivityClient = {
  id: string;
  name: string;
};

export type DashboardActivityOpportunity = {
  id: string;
  title: string;
  stage: string;
  status: string;
};

export type DashboardActivity = {
  id: string;
  type: string;
  description: string | null;
  authorUserId: string | null;
  leadId: string | null;
  clientId: string | null;
  opportunityId: string | null;
  author: DashboardActivityAuthor | null;
  lead: DashboardActivityLead | null;
  client: DashboardActivityClient | null;
  opportunity: DashboardActivityOpportunity | null;
  createdAt: string;
};

export type DashboardSummary = {
  metrics: DashboardMetrics;
  recentActivities: DashboardActivity[];
};
