import { Injectable } from '@nestjs/common';

import { LeadsService } from '../leads.service';

@Injectable()
export class GetLeadUseCase {
  constructor(private readonly leadsService: LeadsService) {}

  async execute(organizationId: string, leadId: string) {
    const lead = this.leadsService.ensureLeadExists(
      await this.leadsService.findByIdWithinOrganization(leadId, organizationId),
    );

    return {
      lead: this.leadsService.serializeLead(lead),
    };
  }
}

