import { Injectable } from '@nestjs/common';

import type { UpdateCurrentOrganizationDto } from '../dto/update-current-organization.dto';
import { OrganizationsService } from '../organizations.service';

@Injectable()
export class UpdateCurrentOrganizationUseCase {
  constructor(private readonly organizationsService: OrganizationsService) {}

  async execute(organizationId: string, dto: UpdateCurrentOrganizationDto) {
    const organization = await this.organizationsService.updateName(
      organizationId,
      dto.name,
    );

    return {
      organization: this.organizationsService.serializeOrganization(organization),
    };
  }
}

