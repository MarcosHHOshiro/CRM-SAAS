import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ActivityType, Prisma } from '@prisma/client';

import { PrismaService } from '../../prisma/prisma.service';
import type { CreateActivityDto } from './dto/create-activity.dto';
import type { ListActivitiesQueryDto } from './dto/list-activities-query.dto';

type ActivityRecord = Prisma.ActivityGetPayload<{
  include: {
    user: true;
    lead: true;
    client: true;
    opportunity: {
      include: {
        client: true;
      };
    };
  };
}>;

@Injectable()
export class ActivitiesService {
  constructor(private readonly prismaService: PrismaService) {}

  async listWithinOrganization(
    organizationId: string,
    query: ListActivitiesQueryDto,
  ) {
    return this.prismaService.activity.findMany({
      where: this.buildListWhereInput(organizationId, query),
      include: {
        user: true,
        lead: true,
        client: true,
        opportunity: {
          include: {
            client: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async create(data: Prisma.ActivityCreateInput) {
    return this.prismaService.activity.create({
      data,
      include: {
        user: true,
        lead: true,
        client: true,
        opportunity: {
          include: {
            client: true,
          },
        },
      },
    });
  }

  async resolveRelatedEntities(
    organizationId: string,
    input: Pick<CreateActivityDto, 'leadId' | 'clientId' | 'opportunityId'>,
  ) {
    const [lead, client, opportunity] = await Promise.all([
      input.leadId
        ? this.prismaService.lead.findFirst({
            where: {
              id: input.leadId,
              organizationId,
            },
          })
        : Promise.resolve(null),
      input.clientId
        ? this.prismaService.client.findFirst({
            where: {
              id: input.clientId,
              organizationId,
            },
          })
        : Promise.resolve(null),
      input.opportunityId
        ? this.prismaService.opportunity.findFirst({
            where: {
              id: input.opportunityId,
              organizationId,
            },
          })
        : Promise.resolve(null),
    ]);

    if (input.leadId && !lead) {
      throw new BadRequestException('Lead not found in the current organization.');
    }

    if (input.clientId && !client) {
      throw new BadRequestException('Client not found in the current organization.');
    }

    if (input.opportunityId && !opportunity) {
      throw new BadRequestException(
        'Opportunity not found in the current organization.',
      );
    }

    if (opportunity && input.clientId && opportunity.clientId !== input.clientId) {
      throw new BadRequestException(
        'Opportunity must belong to the provided client.',
      );
    }

    return {
      leadId: lead?.id ?? null,
      clientId: input.clientId ?? opportunity?.clientId ?? null,
      opportunityId: opportunity?.id ?? null,
    };
  }

  buildTitle(type: ActivityType) {
    switch (type) {
      case ActivityType.CALL:
        return 'Call';
      case ActivityType.EMAIL:
        return 'Email';
      case ActivityType.MEETING:
        return 'Meeting';
      case ActivityType.TASK:
        return 'Task';
      case ActivityType.NOTE:
      default:
        return 'Note';
    }
  }

  serializeActivity(activity: ActivityRecord) {
    return {
      id: activity.id,
      organizationId: activity.organizationId,
      authorUserId: activity.userId,
      type: activity.type,
      description: activity.description,
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
            status: activity.lead.status,
          }
        : null,
      client: activity.client
        ? {
            id: activity.client.id,
            name: activity.client.name,
            company: activity.client.company,
          }
        : null,
      opportunity: activity.opportunity
        ? {
            id: activity.opportunity.id,
            title: activity.opportunity.title,
            stage: activity.opportunity.stage,
            status: activity.opportunity.status,
            clientId: activity.opportunity.clientId,
          }
        : null,
      createdAt: activity.createdAt.toISOString(),
      updatedAt: activity.updatedAt.toISOString(),
    };
  }

  ensureActivityExists(activity: ActivityRecord | null) {
    if (!activity) {
      throw new NotFoundException('Activity not found.');
    }

    return activity;
  }

  private buildListWhereInput(
    organizationId: string,
    query: ListActivitiesQueryDto,
  ): Prisma.ActivityWhereInput {
    return {
      organizationId,
      ...(query.type ? { type: query.type } : {}),
      ...(query.authorUserId ? { userId: query.authorUserId } : {}),
      ...(query.leadId ? { leadId: query.leadId } : {}),
      ...(query.clientId ? { clientId: query.clientId } : {}),
      ...(query.opportunityId ? { opportunityId: query.opportunityId } : {}),
    };
  }
}
