import { Injectable } from '@nestjs/common';
import { OpportunityStage } from '@prisma/client';

import type { ListOpportunitiesQueryDto } from '../dto/list-opportunities-query.dto';
import { OpportunitiesService } from '../opportunities.service';

const STAGE_ORDER: OpportunityStage[] = [
  OpportunityStage.NEW,
  OpportunityStage.QUALIFICATION,
  OpportunityStage.PROPOSAL,
  OpportunityStage.NEGOTIATION,
  OpportunityStage.WON,
  OpportunityStage.LOST,
];

@Injectable()
export class ListOpportunitiesUseCase {
  constructor(private readonly opportunitiesService: OpportunitiesService) {}

  async execute(organizationId: string, query: ListOpportunitiesQueryDto) {
    const opportunities = await this.opportunitiesService.listWithinOrganization(
      organizationId,
      query,
    );

    const serializedOpportunities = opportunities.map((opportunity) =>
      this.opportunitiesService.serializeOpportunity(opportunity),
    );

    if (query.groupBy === 'stage') {
      return {
        groups: STAGE_ORDER.map((stage) => ({
          stage,
          opportunities: serializedOpportunities.filter(
            (opportunity) => opportunity.stage === stage,
          ),
        })),
      };
    }

    return {
      opportunities: serializedOpportunities,
    };
  }
}
