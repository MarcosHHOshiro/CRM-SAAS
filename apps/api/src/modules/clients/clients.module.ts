import { Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module';
import { ClientsController } from './clients.controller';
import { ClientsService } from './clients.service';
import { CreateClientUseCase } from './use-cases/create-client.use-case';
import { GetClientUseCase } from './use-cases/get-client.use-case';
import { ListClientsUseCase } from './use-cases/list-clients.use-case';
import { UpdateClientUseCase } from './use-cases/update-client.use-case';

@Module({
  imports: [AuthModule],
  controllers: [ClientsController],
  providers: [
    ClientsService,
    CreateClientUseCase,
    ListClientsUseCase,
    GetClientUseCase,
    UpdateClientUseCase,
  ],
})
export class ClientsModule {}
