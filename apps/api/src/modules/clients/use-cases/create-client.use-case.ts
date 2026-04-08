import { Injectable } from '@nestjs/common';
import { LeadStatus } from '@prisma/client';

import { PrismaService } from '../../../prisma/prisma.service';
import type { AuthUserPayload } from '../../auth/interfaces/auth-user-payload.interface';
import type { CreateClientDto } from '../dto/create-client.dto';
import { ClientsService } from '../clients.service';

@Injectable()
export class CreateClientUseCase {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly clientsService: ClientsService,
  ) {}

  async execute(user: AuthUserPayload, dto: CreateClientDto) {
    await this.clientsService.validateOwnerWithinOrganization(
      dto.ownerUserId,
      user.organizationId,
    );

    if (dto.leadId) {
      const lead = this.clientsService.ensureLeadExists(
        await this.clientsService.findLeadByIdWithinOrganization(dto.leadId, user.organizationId),
      );

      this.clientsService.ensureLeadCanBeLinked(lead);

      const result = await this.prismaService.$transaction(async (prismaClient) => {
        const client = await prismaClient.client.create({
          data: {
            organizationId: user.organizationId,
            ownerId: dto.ownerUserId ?? null,
            sourceLeadId: lead.id,
            name: dto.name,
            email: dto.email ?? null,
            phone: dto.phone ?? null,
            company: dto.company ?? null,
          },
          include: {
            owner: true,
            sourceLead: true,
          },
        });

        await prismaClient.lead.update({
          where: { id: lead.id },
          data: {
            status: LeadStatus.CONVERTED,
          },
        });

        return client;
      });

      return {
        client: this.clientsService.serializeClient(result),
      };
    }

    const client = await this.clientsService.create({
      organization: {
        connect: {
          id: user.organizationId,
        },
      },
      ...(dto.ownerUserId
        ? {
            owner: {
              connect: {
                id: dto.ownerUserId,
              },
            },
          }
        : {}),
      name: dto.name,
      email: dto.email ?? null,
      phone: dto.phone ?? null,
      company: dto.company ?? null,
    });

    return {
      client: this.clientsService.serializeClient(client),
    };
  }
}
