import { Injectable } from '@nestjs/common';

import { OpportunitiesService } from '../opportunities.service';

@Injectable()
export class GetOpportunityUseCase {
  constructor(private readonly opportunitiesService: OpportunitiesService) {}

  async execute(organizationId: string, opportunityId: string) {
    const opportunity = this.opportunitiesService.ensureOpportunityExists(
      await this.opportunitiesService.findByIdWithinOrganization(
        opportunityId,
        organizationId,
      ),
    );

    return {
      opportunity: this.opportunitiesService.serializeOpportunity(opportunity),
    };
  }
}
