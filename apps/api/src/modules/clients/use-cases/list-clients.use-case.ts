import { Injectable } from '@nestjs/common';

import type { ListClientsQueryDto } from '../dto/list-clients-query.dto';
import { ClientsService } from '../clients.service';

@Injectable()
export class ListClientsUseCase {
  constructor(private readonly clientsService: ClientsService) {}

  async execute(organizationId: string, query: ListClientsQueryDto) {
    const clients = await this.clientsService.listWithinOrganization(organizationId, query);

    return {
      clients: clients.map((client) => this.clientsService.serializeClient(client)),
    };
  }
}
