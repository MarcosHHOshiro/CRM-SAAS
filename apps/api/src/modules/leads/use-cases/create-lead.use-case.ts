import { Injectable } from '@nestjs/common';
import { LeadStatus } from '@prisma/client';

import type { AuthUserPayload } from '../../auth/interfaces/auth-user-payload.interface';
import type { CreateLeadDto } from '../dto/create-lead.dto';
import { LeadsService } from '../leads.service';

@Injectable()
export class CreateLeadUseCase {
  constructor(private readonly leadsService: LeadsService) {}

  async execute(user: AuthUserPayload, dto: CreateLeadDto) {
    await this.leadsService.validateOwnerWithinOrganization(
      dto.ownerUserId,
      user.organizationId,
    );

    const lead = await this.leadsService.create({
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
      status: dto.status ?? LeadStatus.NEW,
      notes: dto.notes ?? null,
    });

    return {
      lead: this.leadsService.serializeLead(lead),
    };
  }
}

