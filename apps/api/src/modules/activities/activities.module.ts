import { Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module';
import { ActivitiesController } from './activities.controller';
import { ActivitiesService } from './activities.service';
import { CreateActivityUseCase } from './use-cases/create-activity.use-case';
import { ListActivitiesUseCase } from './use-cases/list-activities.use-case';

@Module({
  imports: [AuthModule],
  controllers: [ActivitiesController],
  providers: [
    ActivitiesService,
    CreateActivityUseCase,
    ListActivitiesUseCase,
  ],
})
export class ActivitiesModule {}
