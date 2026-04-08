import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';

import { CurrentOrganizationId } from '../auth/decorators/current-organization-id.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { AuthUserPayload } from '../auth/interfaces/auth-user-payload.interface';
import { CreateOpportunityDto } from './dto/create-opportunity.dto';
import { ListOpportunitiesQueryDto } from './dto/list-opportunities-query.dto';
import { UpdateOpportunityStageDto } from './dto/update-opportunity-stage.dto';
import { UpdateOpportunityDto } from './dto/update-opportunity.dto';
import { CreateOpportunityUseCase } from './use-cases/create-opportunity.use-case';
import { GetOpportunityUseCase } from './use-cases/get-opportunity.use-case';
import { ListOpportunitiesUseCase } from './use-cases/list-opportunities.use-case';
import { UpdateOpportunityStageUseCase } from './use-cases/update-opportunity-stage.use-case';
import { UpdateOpportunityUseCase } from './use-cases/update-opportunity.use-case';

@UseGuards(JwtAuthGuard)
@Controller('opportunities')
export class OpportunitiesController {
  constructor(
    private readonly createOpportunityUseCase: CreateOpportunityUseCase,
    private readonly listOpportunitiesUseCase: ListOpportunitiesUseCase,
    private readonly getOpportunityUseCase: GetOpportunityUseCase,
    private readonly updateOpportunityUseCase: UpdateOpportunityUseCase,
    private readonly updateOpportunityStageUseCase: UpdateOpportunityStageUseCase,
  ) {}

  @Post()
  createOpportunity(
    @CurrentUser() user: AuthUserPayload,
    @Body() dto: CreateOpportunityDto,
  ) {
    return this.createOpportunityUseCase.execute(user, dto);
  }

  @Get()
  listOpportunities(
    @CurrentOrganizationId() organizationId: string,
    @Query() query: ListOpportunitiesQueryDto,
  ) {
    return this.listOpportunitiesUseCase.execute(organizationId, query);
  }

  @Get(':id')
  getOpportunity(
    @CurrentOrganizationId() organizationId: string,
    @Param('id', new ParseUUIDPipe()) opportunityId: string,
  ) {
    return this.getOpportunityUseCase.execute(organizationId, opportunityId);
  }

  @Patch(':id')
  updateOpportunity(
    @CurrentUser() user: AuthUserPayload,
    @Param('id', new ParseUUIDPipe()) opportunityId: string,
    @Body() dto: UpdateOpportunityDto,
  ) {
    return this.updateOpportunityUseCase.execute(user, opportunityId, dto);
  }

  @Patch(':id/stage')
  updateOpportunityStage(
    @CurrentUser() user: AuthUserPayload,
    @Param('id', new ParseUUIDPipe()) opportunityId: string,
    @Body() dto: UpdateOpportunityStageDto,
  ) {
    return this.updateOpportunityStageUseCase.execute(user, opportunityId, dto);
  }
}
