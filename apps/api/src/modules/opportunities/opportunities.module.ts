import { Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module';
import { OpportunitiesController } from './opportunities.controller';
import { OpportunitiesService } from './opportunities.service';
import { CreateOpportunityUseCase } from './use-cases/create-opportunity.use-case';
import { GetOpportunityUseCase } from './use-cases/get-opportunity.use-case';
import { ListOpportunitiesUseCase } from './use-cases/list-opportunities.use-case';
import { UpdateOpportunityStageUseCase } from './use-cases/update-opportunity-stage.use-case';
import { UpdateOpportunityUseCase } from './use-cases/update-opportunity.use-case';

@Module({
  imports: [AuthModule],
  controllers: [OpportunitiesController],
  providers: [
    OpportunitiesService,
    CreateOpportunityUseCase,
    ListOpportunitiesUseCase,
    GetOpportunityUseCase,
    UpdateOpportunityUseCase,
    UpdateOpportunityStageUseCase,
  ],
})
export class OpportunitiesModule {}
