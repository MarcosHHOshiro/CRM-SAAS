import { Injectable } from '@nestjs/common';
import { OpportunityStatus } from '@prisma/client';

import { PrismaService } from '../../prisma/prisma.service';

const RECENT_ACTIVITIES_LIMIT = 10;

@Injectable()
export class DashboardService {
  constructor(private readonly prismaService: PrismaService) {}

  async getSummary(organizationId: string) {
    const [
      totalLeads,
      totalClients,
      openOpportunities,
      wonOpportunities,
      lostOpportunities,
      openPipelineAggregate,
      convertedLeads,
      recentActivities,
    ] = await Promise.all([
      this.prismaService.lead.count({
        where: { organizationId },
      }),
      this.prismaService.client.count({
        where: { organizationId },
      }),
      this.prismaService.opportunity.count({
        where: {
          organizationId,
          status: OpportunityStatus.OPEN,
        },
      }),
      this.prismaService.opportunity.count({
        where: {
          organizationId,
          status: OpportunityStatus.WON,
        },
      }),
      this.prismaService.opportunity.count({
        where: {
          organizationId,
          status: OpportunityStatus.LOST,
        },
      }),
      this.prismaService.opportunity.aggregate({
        where: {
          organizationId,
          status: OpportunityStatus.OPEN,
        },
        _sum: {
          value: true,
        },
      }),
      this.prismaService.lead.count({
        where: {
          organizationId,
          status: 'CONVERTED',
        },
      }),
      this.prismaService.activity.findMany({
        where: { organizationId },
        include: {
          user: true,
          lead: true,
          client: true,
          opportunity: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: RECENT_ACTIVITIES_LIMIT,
      }),
    ]);

    const conversionRate =
      totalLeads === 0 ? 0 : Number(((convertedLeads / totalLeads) * 100).toFixed(2));

    return {
      metrics: {
        totalLeads,
        totalClients,
        openOpportunities,
        wonOpportunities,
        lostOpportunities,
        totalPipelineValue: openPipelineAggregate._sum.value?.toString() ?? '0',
        conversionRate,
      },
      recentActivities: recentActivities.map((activity) => ({
        id: activity.id,
        type: activity.type,
        description: activity.description,
        authorUserId: activity.userId,
        leadId: activity.leadId,
        clientId: activity.clientId,
        opportunityId: activity.opportunityId,
        author: activity.user
          ? {
              id: activity.user.id,
              name: activity.user.name,
              email: activity.user.email,
              role: activity.user.role,
            }
          : null,
        lead: activity.lead
          ? {
              id: activity.lead.id,
              name: activity.lead.name,
            }
          : null,
        client: activity.client
          ? {
              id: activity.client.id,
              name: activity.client.name,
            }
          : null,
        opportunity: activity.opportunity
          ? {
              id: activity.opportunity.id,
              title: activity.opportunity.title,
              stage: activity.opportunity.stage,
              status: activity.opportunity.status,
            }
          : null,
        createdAt: activity.createdAt.toISOString(),
      })),
    };
  }
}
