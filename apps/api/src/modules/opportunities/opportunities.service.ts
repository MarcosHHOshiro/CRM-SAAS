import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  OpportunityStage,
  OpportunityStatus,
  Prisma,
} from '@prisma/client';

import { PrismaService } from '../../prisma/prisma.service';
import type { ListOpportunitiesQueryDto } from './dto/list-opportunities-query.dto';

type OpportunityRecord = Prisma.OpportunityGetPayload<{
  include: {
    client: true;
    owner: true;
  };
}>;

@Injectable()
export class OpportunitiesService {
  constructor(private readonly prismaService: PrismaService) {}

  async validateOwnerWithinOrganization(
    ownerUserId: string | null | undefined,
    organizationId: string,
  ) {
    if (!ownerUserId) {
      return null;
    }

    const owner = await this.prismaService.user.findFirst({
      where: {
        id: ownerUserId,
        organizationId,
      },
    });

    if (!owner) {
      throw new BadRequestException('Assigned owner must belong to the same organization.');
    }

    return owner;
  }

  async findClientByIdWithinOrganization(id: string, organizationId: string) {
    return this.prismaService.client.findFirst({
      where: {
        id,
        organizationId,
      },
    });
  }

  async findByIdWithinOrganization(id: string, organizationId: string) {
    return this.prismaService.opportunity.findFirst({
      where: {
        id,
        organizationId,
      },
      include: {
        client: true,
        owner: true,
      },
    });
  }

  async listWithinOrganization(
    organizationId: string,
    query: ListOpportunitiesQueryDto,
  ) {
    return this.prismaService.opportunity.findMany({
      where: this.buildListWhereInput(organizationId, query),
      include: {
        client: true,
        owner: true,
      },
      orderBy: this.buildOrderByInput(query),
    });
  }

  async create(data: Prisma.OpportunityCreateInput) {
    return this.prismaService.opportunity.create({
      data,
      include: {
        client: true,
        owner: true,
      },
    });
  }

  async update(id: string, data: Prisma.OpportunityUpdateInput) {
    return this.prismaService.opportunity.update({
      where: { id },
      data,
      include: {
        client: true,
        owner: true,
      },
    });
  }

  ensureClientExists(client: { id: string } | null) {
    if (!client) {
      throw new BadRequestException('Client not found in the current organization.');
    }

    return client;
  }

  ensureOpportunityExists(opportunity: OpportunityRecord | null) {
    if (!opportunity) {
      throw new NotFoundException('Opportunity not found.');
    }

    return opportunity;
  }

  resolveStageStatus(input: {
    stage?: OpportunityStage;
    status?: OpportunityStatus;
  }) {
    const stage = input.stage ?? this.getDefaultStageForStatus(input.status);
    const status = input.status ?? this.getStatusForStage(stage);

    this.assertValidStageStatus(stage, status);

    return { stage, status };
  }

  serializeOpportunity(opportunity: OpportunityRecord) {
    return {
      id: opportunity.id,
      organizationId: opportunity.organizationId,
      clientId: opportunity.clientId,
      ownerUserId: opportunity.ownerId,
      title: opportunity.title,
      stage: opportunity.stage,
      status: opportunity.status,
      estimatedValue: opportunity.value.toString(),
      expectedCloseDate: opportunity.expectedCloseDate?.toISOString() ?? null,
      notes: opportunity.notes,
      client: {
        id: opportunity.client.id,
        name: opportunity.client.name,
        email: opportunity.client.email,
        company: opportunity.client.company,
      },
      owner: opportunity.owner
        ? {
            id: opportunity.owner.id,
            name: opportunity.owner.name,
            email: opportunity.owner.email,
            role: opportunity.owner.role,
            isActive: opportunity.owner.isActive,
          }
        : null,
      createdAt: opportunity.createdAt.toISOString(),
      updatedAt: opportunity.updatedAt.toISOString(),
    };
  }

  private assertValidStageStatus(
    stage: OpportunityStage,
    status: OpportunityStatus,
  ) {
    if (stage === OpportunityStage.WON && status !== OpportunityStatus.WON) {
      throw new BadRequestException('Won stage requires WON status.');
    }

    if (stage === OpportunityStage.LOST && status !== OpportunityStatus.LOST) {
      throw new BadRequestException('Lost stage requires LOST status.');
    }

    if (status === OpportunityStatus.WON && stage !== OpportunityStage.WON) {
      throw new BadRequestException('Won opportunities must remain in the WON stage.');
    }

    if (status === OpportunityStatus.LOST && stage !== OpportunityStage.LOST) {
      throw new BadRequestException('Lost opportunities must remain in the LOST stage.');
    }

    if (
      status === OpportunityStatus.OPEN &&
      (stage === OpportunityStage.WON || stage === OpportunityStage.LOST)
    ) {
      throw new BadRequestException(
        'Open opportunities cannot remain in won or lost stages.',
      );
    }
  }

  private getDefaultStageForStatus(status?: OpportunityStatus) {
    if (status === OpportunityStatus.WON) {
      return OpportunityStage.WON;
    }

    if (status === OpportunityStatus.LOST) {
      return OpportunityStage.LOST;
    }

    return OpportunityStage.NEW;
  }

  private getStatusForStage(stage: OpportunityStage) {
    if (stage === OpportunityStage.WON) {
      return OpportunityStatus.WON;
    }

    if (stage === OpportunityStage.LOST) {
      return OpportunityStatus.LOST;
    }

    return OpportunityStatus.OPEN;
  }

  private buildListWhereInput(
    organizationId: string,
    query: ListOpportunitiesQueryDto,
  ): Prisma.OpportunityWhereInput {
    const search = query.search?.trim();

    return {
      organizationId,
      ...(query.stage ? { stage: query.stage } : {}),
      ...(query.status ? { status: query.status } : {}),
      ...(query.ownerUserId ? { ownerId: query.ownerUserId } : {}),
      ...(search
        ? {
            OR: [
              { title: { contains: search, mode: 'insensitive' } },
              { client: { name: { contains: search, mode: 'insensitive' } } },
              { client: { email: { contains: search, mode: 'insensitive' } } },
              { client: { company: { contains: search, mode: 'insensitive' } } },
            ],
          }
        : {}),
    };
  }

  private buildOrderByInput(
    query: ListOpportunitiesQueryDto,
  ): Prisma.OpportunityOrderByWithRelationInput {
    const direction = query.order ?? 'desc';

    switch (query.sortBy) {
      case 'title':
        return { title: direction };
      case 'stage':
        return { stage: direction };
      case 'status':
        return { status: direction };
      case 'expectedCloseDate':
        return { expectedCloseDate: direction };
      case 'estimatedValue':
        return { value: direction };
      case 'createdAt':
      default:
        return { createdAt: direction };
    }
  }
}
