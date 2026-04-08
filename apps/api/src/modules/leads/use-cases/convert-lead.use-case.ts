import { Injectable } from '@nestjs/common';
import { LeadStatus } from '@prisma/client';

import { PrismaService } from '../../../prisma/prisma.service';
import { LeadsService } from '../leads.service';

@Injectable()
export class ConvertLeadUseCase {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly leadsService: LeadsService,
  ) {}

  async execute(organizationId: string, leadId: string) {
    const lead = this.leadsService.ensureLeadExists(
      await this.leadsService.findByIdWithinOrganization(leadId, organizationId),
    );

    this.leadsService.ensureLeadCanBeConverted(lead);

    const result = await this.prismaService.$transaction(async (prismaClient) => {
      const client = await prismaClient.client.create({
        data: {
          organizationId: lead.organizationId,
          ownerId: lead.ownerId,
          sourceLeadId: lead.id,
          name: lead.name,
          email: lead.email,
          phone: lead.phone,
          company: lead.company,
        },
      });

      const updatedLead = await prismaClient.lead.update({
        where: { id: lead.id },
        data: {
          status: LeadStatus.CONVERTED,
        },
        include: {
          owner: true,
          client: true,
        },
      });

      return {
        client,
        lead: updatedLead,
      };
    });

    return {
      lead: this.leadsService.serializeLead(result.lead),
      client: this.leadsService.serializeClient(result.client),
    };
  }
}

