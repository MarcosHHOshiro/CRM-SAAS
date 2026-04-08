import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { Client, Prisma } from '@prisma/client';

import { PrismaService } from '../../prisma/prisma.service';
import type { ListLeadsQueryDto } from './dto/list-leads-query.dto';

type LeadRecord = Prisma.LeadGetPayload<{
  include: {
    owner: true;
    client: true;
  };
}>;

@Injectable()
export class LeadsService {
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

  async findByIdWithinOrganization(id: string, organizationId: string) {
    return this.prismaService.lead.findFirst({
      where: {
        id,
        organizationId,
      },
      include: {
        owner: true,
        client: true,
      },
    });
  }

  async listWithinOrganization(organizationId: string, query: ListLeadsQueryDto) {
    return this.prismaService.lead.findMany({
      where: this.buildListWhereInput(organizationId, query),
      include: {
        owner: true,
        client: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async create(data: Prisma.LeadCreateInput) {
    return this.prismaService.lead.create({
      data,
      include: {
        owner: true,
        client: true,
      },
    });
  }

  async update(id: string, data: Prisma.LeadUpdateInput) {
    return this.prismaService.lead.update({
      where: { id },
      data,
      include: {
        owner: true,
        client: true,
      },
    });
  }

  async delete(id: string) {
    return this.prismaService.lead.delete({
      where: { id },
      include: {
        owner: true,
        client: true,
      },
    });
  }

  ensureLeadExists(lead: LeadRecord | null) {
    if (!lead) {
      throw new NotFoundException('Lead not found.');
    }

    return lead;
  }

  ensureLeadCanBeConverted(lead: LeadRecord) {
    if (lead.status === 'CONVERTED' || lead.client) {
      throw new ConflictException('Lead has already been converted.');
    }

    return lead;
  }

  serializeLead(lead: LeadRecord) {
    return {
      id: lead.id,
      organizationId: lead.organizationId,
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      company: lead.company,
      status: lead.status,
      notes: lead.notes,
      ownerUserId: lead.ownerId,
      owner: lead.owner
        ? {
            id: lead.owner.id,
            name: lead.owner.name,
            email: lead.owner.email,
            role: lead.owner.role,
            isActive: lead.owner.isActive,
          }
        : null,
      clientId: lead.client?.id ?? null,
      createdAt: lead.createdAt.toISOString(),
      updatedAt: lead.updatedAt.toISOString(),
    };
  }

  serializeClient(client: Client) {
    return {
      id: client.id,
      organizationId: client.organizationId,
      name: client.name,
      email: client.email,
      phone: client.phone,
      company: client.company,
      ownerUserId: client.ownerId,
      sourceLeadId: client.sourceLeadId,
      createdAt: client.createdAt.toISOString(),
      updatedAt: client.updatedAt.toISOString(),
    };
  }

  private buildListWhereInput(
    organizationId: string,
    query: ListLeadsQueryDto,
  ): Prisma.LeadWhereInput {
    const search = query.search?.trim();

    return {
      organizationId,
      ...(query.status ? { status: query.status } : {}),
      ...(query.ownerUserId ? { ownerId: query.ownerUserId } : {}),
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
