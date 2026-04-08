import { Injectable } from '@nestjs/common';

import type { AuthUserPayload } from '../../auth/interfaces/auth-user-payload.interface';
import type { UpdateLeadDto } from '../dto/update-lead.dto';
import { LeadsService } from '../leads.service';

@Injectable()
export class UpdateLeadUseCase {
  constructor(private readonly leadsService: LeadsService) {}

  async execute(user: AuthUserPayload, leadId: string, dto: UpdateLeadDto) {
    const lead = this.leadsService.ensureLeadExists(
      await this.leadsService.findByIdWithinOrganization(leadId, user.organizationId),
    );

    if (dto.ownerUserId !== undefined) {
      await this.leadsService.validateOwnerWithinOrganization(
        dto.ownerUserId,
        user.organizationId,
      );
    }

    const updatedLead = await this.leadsService.update(lead.id, {
      ...(dto.name !== undefined ? { name: dto.name } : {}),
      ...(dto.email !== undefined ? { email: dto.email || null } : {}),
      ...(dto.phone !== undefined ? { phone: dto.phone || null } : {}),
      ...(dto.company !== undefined ? { company: dto.company || null } : {}),
      ...(dto.status !== undefined ? { status: dto.status } : {}),
      ...(dto.notes !== undefined ? { notes: dto.notes || null } : {}),
      ...(dto.ownerUserId !== undefined
        ? dto.ownerUserId
          ? {
              owner: {
                connect: {
                  id: dto.ownerUserId,
                },
              },
            }
          : {
              owner: {
                disconnect: true,
              },
            }
        : {}),
    });

    return {
      lead: this.leadsService.serializeLead(updatedLead),
    };
  }
}

