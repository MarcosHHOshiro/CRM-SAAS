import { Controller, Get, UseGuards } from '@nestjs/common';

import { CurrentOrganizationId } from '../auth/decorators/current-organization-id.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetDashboardSummaryUseCase } from './use-cases/get-dashboard-summary.use-case';

@UseGuards(JwtAuthGuard)
@Controller('dashboard')
export class DashboardController {
  constructor(
    private readonly getDashboardSummaryUseCase: GetDashboardSummaryUseCase,
  ) {}

  @Get('summary')
  getSummary(@CurrentOrganizationId() organizationId: string) {
    return this.getDashboardSummaryUseCase.execute(organizationId);
  }
}
