import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { Prisma } from '@prisma/client';

import { PrismaService } from '../../prisma/prisma.service';
import type { ListClientsQueryDto } from './dto/list-clients-query.dto';

type ClientRecord = Prisma.ClientGetPayload<{
  include: {
    owner: true;
    sourceLead: true;
  };
}>;

type LeadReference = Prisma.LeadGetPayload<{
  include: {
    client: true;
  };
}>;

@Injectable()
export class ClientsService {
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

  async findLeadByIdWithinOrganization(id: string, organizationId: string) {
    return this.prismaService.lead.findFirst({
      where: {
        id,
        organizationId,
      },
      include: {
        client: true,
      },
    });
  }

  async findByIdWithinOrganization(id: string, organizationId: string) {
    return this.prismaService.client.findFirst({
      where: {
        id,
        organizationId,
      },
      include: {
        owner: true,
        sourceLead: true,
      },
    });
  }

  async listWithinOrganization(organizationId: string, query: ListClientsQueryDto) {
    return this.prismaService.client.findMany({
      where: this.buildListWhereInput(organizationId, query),
      include: {
        owner: true,
        sourceLead: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async create(data: Prisma.ClientCreateInput) {
    return this.prismaService.client.create({
      data,
      include: {
        owner: true,
        sourceLead: true,
      },
    });
  }

  async update(id: string, data: Prisma.ClientUpdateInput) {
    return this.prismaService.client.update({
      where: { id },
      data,
      include: {
        owner: true,
        sourceLead: true,
      },
    });
  }

  ensureLeadExists(lead: LeadReference | null) {
    if (!lead) {
      throw new BadRequestException('Lead not found in the current organization.');
    }

    return lead;
  }

  ensureLeadCanBeLinked(lead: LeadReference) {
    if (lead.status === 'CONVERTED' || lead.client) {
      throw new ConflictException('Lead has already been converted.');
    }

    return lead;
  }

  ensureClientExists(client: ClientRecord | null) {
    if (!client) {
      throw new NotFoundException('Client not found.');
    }

    return client;
  }

  serializeClient(client: ClientRecord) {
    return {
      id: client.id,
      organizationId: client.organizationId,
      name: client.name,
      email: client.email,
      phone: client.phone,
      company: client.company,
      ownerUserId: client.ownerId,
      owner: client.owner
        ? {
            id: client.owner.id,
            name: client.owner.name,
            email: client.owner.email,
            role: client.owner.role,
            isActive: client.owner.isActive,
          }
        : null,
      sourceLeadId: client.sourceLeadId,
      sourceLead: client.sourceLead
        ? {
            id: client.sourceLead.id,
            name: client.sourceLead.name,
            status: client.sourceLead.status,
          }
        : null,
      createdAt: client.createdAt.toISOString(),
      updatedAt: client.updatedAt.toISOString(),
    };
  }

  private buildListWhereInput(
    organizationId: string,
    query: ListClientsQueryDto,
  ): Prisma.ClientWhereInput {
    const search = query.search?.trim();

    return {
      organizationId,
      ...(search
        ? {
            OR: [
              { name: { contains: search, mode: 'insensitive' } },
              { email: { contains: search, mode: 'insensitive' } },
              { company: { contains: search, mode: 'insensitive' } },
              { phone: { contains: search, mode: 'insensitive' } },
            ],
          }
        : {}),
    };
  }
}
