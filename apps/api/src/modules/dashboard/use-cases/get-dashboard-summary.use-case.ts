import { Injectable } from '@nestjs/common';

import { DashboardService } from '../dashboard.service';

@Injectable()
export class GetDashboardSummaryUseCase {
  constructor(private readonly dashboardService: DashboardService) {}

  execute(organizationId: string) {
    return this.dashboardService.getSummary(organizationId);
  }
}
