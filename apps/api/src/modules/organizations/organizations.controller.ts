import { Controller, Get, Patch, Body, UseGuards } from '@nestjs/common';
import { UserRole } from '@prisma/client';

import { CurrentOrganizationId } from '../auth/decorators/current-organization-id.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import type { UpdateCurrentOrganizationDto } from './dto/update-current-organization.dto';
import { GetCurrentOrganizationUseCase } from './use-cases/get-current-organization.use-case';
import { UpdateCurrentOrganizationUseCase } from './use-cases/update-current-organization.use-case';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('organizations')
export class OrganizationsController {
  constructor(
    private readonly getCurrentOrganizationUseCase: GetCurrentOrganizationUseCase,
    private readonly updateCurrentOrganizationUseCase: UpdateCurrentOrganizationUseCase,
  ) {}

  @Get('me')
  getCurrentOrganization(@CurrentOrganizationId() organizationId: string) {
    return this.getCurrentOrganizationUseCase.execute(organizationId);
  }

  @Roles(UserRole.OWNER)
  @Patch('me')
  updateCurrentOrganization(
    @CurrentOrganizationId() organizationId: string,
    @Body() dto: UpdateCurrentOrganizationDto,
  ) {
    return this.updateCurrentOrganizationUseCase.execute(organizationId, dto);
  }
}

