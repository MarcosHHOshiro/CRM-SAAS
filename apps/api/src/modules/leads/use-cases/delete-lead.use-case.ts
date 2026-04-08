import { Injectable } from '@nestjs/common';

import { LeadsService } from '../leads.service';

@Injectable()
export class DeleteLeadUseCase {
  constructor(private readonly leadsService: LeadsService) {}

  async execute(organizationId: string, leadId: string) {
    const lead = this.leadsService.ensureLeadExists(
      await this.leadsService.findByIdWithinOrganization(leadId, organizationId),
    );

    await this.leadsService.delete(lead.id);

    return {
      message: 'Lead deleted successfully.',
    };
  }
}

