import { Injectable } from '@nestjs/common';

import type { AuthUserPayload } from '../../auth/interfaces/auth-user-payload.interface';
import type { UpdateOpportunityDto } from '../dto/update-opportunity.dto';
import { OpportunitiesService } from '../opportunities.service';

@Injectable()
export class UpdateOpportunityUseCase {
  constructor(private readonly opportunitiesService: OpportunitiesService) {}

  async execute(user: AuthUserPayload, opportunityId: string, dto: UpdateOpportunityDto) {
    const opportunity = this.opportunitiesService.ensureOpportunityExists(
      await this.opportunitiesService.findByIdWithinOrganization(
        opportunityId,
        user.organizationId,
      ),
    );

    if (dto.ownerUserId !== undefined) {
      await this.opportunitiesService.validateOwnerWithinOrganization(
        dto.ownerUserId,
        user.organizationId,
      );
    }

    const updatedOpportunity = await this.opportunitiesService.update(opportunity.id, {
      ...(dto.title !== undefined ? { title: dto.title } : {}),
      ...(dto.estimatedValue !== undefined ? { value: dto.estimatedValue } : {}),
      ...(dto.expectedCloseDate !== undefined
        ? {
            expectedCloseDate: dto.expectedCloseDate
              ? new Date(dto.expectedCloseDate)
              : null,
          }
        : {}),
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
      opportunity: this.opportunitiesService.serializeOpportunity(updatedOpportunity),
    };
  }
}
