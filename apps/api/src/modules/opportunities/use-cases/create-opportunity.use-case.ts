import { Injectable } from '@nestjs/common';

import type { AuthUserPayload } from '../../auth/interfaces/auth-user-payload.interface';
import type { CreateOpportunityDto } from '../dto/create-opportunity.dto';
import { OpportunitiesService } from '../opportunities.service';

@Injectable()
export class CreateOpportunityUseCase {
  constructor(private readonly opportunitiesService: OpportunitiesService) {}

  async execute(user: AuthUserPayload, dto: CreateOpportunityDto) {
    await this.opportunitiesService.validateOwnerWithinOrganization(
      dto.ownerUserId,
      user.organizationId,
    );

    this.opportunitiesService.ensureClientExists(
      await this.opportunitiesService.findClientByIdWithinOrganization(
        dto.clientId,
        user.organizationId,
      ),
    );

    const stageStatus = this.opportunitiesService.resolveStageStatus({
      stage: dto.stage,
      status: dto.status,
    });

    const opportunity = await this.opportunitiesService.create({
      organization: {
        connect: {
          id: user.organizationId,
        },
      },
      client: {
        connect: {
          id: dto.clientId,
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
      title: dto.title,
      stage: stageStatus.stage,
      status: stageStatus.status,
      value: dto.estimatedValue,
      expectedCloseDate: dto.expectedCloseDate ? new Date(dto.expectedCloseDate) : null,
      notes: dto.notes ?? null,
    });

    return {
      opportunity: this.opportunitiesService.serializeOpportunity(opportunity),
    };
  }
}
