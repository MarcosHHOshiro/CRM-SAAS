import { Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module';
import { OrganizationsController } from './organizations.controller';
import { OrganizationsService } from './organizations.service';
import { GetCurrentOrganizationUseCase } from './use-cases/get-current-organization.use-case';
import { UpdateCurrentOrganizationUseCase } from './use-cases/update-current-organization.use-case';

@Module({
  imports: [AuthModule],
  controllers: [OrganizationsController],
  providers: [
    OrganizationsService,
    GetCurrentOrganizationUseCase,
    UpdateCurrentOrganizationUseCase,
  ],
})
export class OrganizationsModule {}

