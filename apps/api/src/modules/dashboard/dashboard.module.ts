import { Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { GetDashboardSummaryUseCase } from './use-cases/get-dashboard-summary.use-case';

@Module({
  imports: [AuthModule],
  controllers: [DashboardController],
  providers: [DashboardService, GetDashboardSummaryUseCase],
})
export class DashboardModule {}
