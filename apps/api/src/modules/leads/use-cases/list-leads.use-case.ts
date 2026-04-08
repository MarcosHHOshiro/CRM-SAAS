import { Injectable } from '@nestjs/common';

import type { ListLeadsQueryDto } from '../dto/list-leads-query.dto';
import { LeadsService } from '../leads.service';

@Injectable()
export class ListLeadsUseCase {
  constructor(private readonly leadsService: LeadsService) {}

  async execute(organizationId: string, query: ListLeadsQueryDto) {
    const leads = await this.leadsService.listWithinOrganization(organizationId, query);

    return {
      leads: leads.map((lead) => this.leadsService.serializeLead(lead)),
    };
  }
}

