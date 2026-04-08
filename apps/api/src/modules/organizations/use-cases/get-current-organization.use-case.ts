import { Injectable } from '@nestjs/common';

import { OrganizationsService } from '../organizations.service';

@Injectable()
export class GetCurrentOrganizationUseCase {
  constructor(private readonly organizationsService: OrganizationsService) {}

  async execute(organizationId: string) {
    const organization = await this.organizationsService.findById(organizationId);

    return {
      organization: this.organizationsService.serializeOrganization(
        this.organizationsService.ensureOrganizationExists(organization),
      ),
    };
  }
}

