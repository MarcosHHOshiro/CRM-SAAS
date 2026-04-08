import { Injectable } from '@nestjs/common';

import type { AuthUserPayload } from '../../auth/interfaces/auth-user-payload.interface';
import type { UpdateClientDto } from '../dto/update-client.dto';
import { ClientsService } from '../clients.service';

@Injectable()
export class UpdateClientUseCase {
  constructor(private readonly clientsService: ClientsService) {}

  async execute(user: AuthUserPayload, clientId: string, dto: UpdateClientDto) {
    const client = this.clientsService.ensureClientExists(
      await this.clientsService.findByIdWithinOrganization(clientId, user.organizationId),
    );

    if (dto.ownerUserId !== undefined) {
      await this.clientsService.validateOwnerWithinOrganization(
        dto.ownerUserId,
        user.organizationId,
      );
    }

    const updatedClient = await this.clientsService.update(client.id, {
      ...(dto.name !== undefined ? { name: dto.name } : {}),
      ...(dto.email !== undefined ? { email: dto.email || null } : {}),
      ...(dto.phone !== undefined ? { phone: dto.phone || null } : {}),
      ...(dto.company !== undefined ? { company: dto.company || null } : {}),
      ...(dto.ownerUserId !== undefined
        ? dto.ownerUserId
          ? {
              owner: {
                connect: {
                  id: dto.ownerUserId,
                },
              },
            }
          : {
              owner: {
                disconnect: true,
              },
            }
        : {}),
    });

    return {
      client: this.clientsService.serializeClient(updatedClient),
    };
  }
}
