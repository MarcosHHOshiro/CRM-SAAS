import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';

import { CurrentOrganizationId } from '../auth/decorators/current-organization-id.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { AuthUserPayload } from '../auth/interfaces/auth-user-payload.interface';
import { CreateActivityDto } from './dto/create-activity.dto';
import { ListActivitiesQueryDto } from './dto/list-activities-query.dto';
import { CreateActivityUseCase } from './use-cases/create-activity.use-case';
import { ListActivitiesUseCase } from './use-cases/list-activities.use-case';

@UseGuards(JwtAuthGuard)
@Controller('activities')
export class ActivitiesController {
  constructor(
    private readonly createActivityUseCase: CreateActivityUseCase,
    private readonly listActivitiesUseCase: ListActivitiesUseCase,
  ) {}

  @Post()
  createActivity(
    @CurrentUser() user: AuthUserPayload,
    @Body() dto: CreateActivityDto,
  ) {
    return this.createActivityUseCase.execute(user, dto);
  }

  @Get()
  listActivities(
    @CurrentOrganizationId() organizationId: string,
    @Query() query: ListActivitiesQueryDto,
  ) {
    return this.listActivitiesUseCase.execute(organizationId, query);
  }
}
