import { Injectable } from '@nestjs/common';

import { ClientsService } from '../clients.service';

@Injectable()
export class GetClientUseCase {
  constructor(private readonly clientsService: ClientsService) {}

  async execute(organizationId: string, clientId: string) {
    const client = this.clientsService.ensureClientExists(
      await this.clientsService.findByIdWithinOrganization(clientId, organizationId),
    );

    return {
      client: this.clientsService.serializeClient(client),
    };
  }
}
