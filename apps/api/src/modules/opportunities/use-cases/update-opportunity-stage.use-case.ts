import { Injectable } from '@nestjs/common';

import type { AuthUserPayload } from '../../auth/interfaces/auth-user-payload.interface';
import type { UpdateOpportunityStageDto } from '../dto/update-opportunity-stage.dto';
import { OpportunitiesService } from '../opportunities.service';

@Injectable()
export class UpdateOpportunityStageUseCase {
  constructor(private readonly opportunitiesService: OpportunitiesService) {}

  async execute(user: AuthUserPayload, opportunityId: string, dto: UpdateOpportunityStageDto) {
    const opportunity = this.opportunitiesService.ensureOpportunityExists(
      await this.opportunitiesService.findByIdWithinOrganization(
        opportunityId,
        user.organizationId,
      ),
    );

    const stageStatus = this.opportunitiesService.resolveStageStatus({
      stage: dto.stage,
    });

    const updatedOpportunity = await this.opportunitiesService.update(opportunity.id, {
      stage: stageStatus.stage,
      status: stageStatus.status,
    });

    return {
      opportunity: this.opportunitiesService.serializeOpportunity(updatedOpportunity),
    };
  }
}
