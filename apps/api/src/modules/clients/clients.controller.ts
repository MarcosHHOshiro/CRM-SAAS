import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';

import { CurrentOrganizationId } from '../auth/decorators/current-organization-id.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { AuthUserPayload } from '../auth/interfaces/auth-user-payload.interface';
import { CreateClientDto } from './dto/create-client.dto';
import { ListClientsQueryDto } from './dto/list-clients-query.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { CreateClientUseCase } from './use-cases/create-client.use-case';
import { GetClientUseCase } from './use-cases/get-client.use-case';
import { ListClientsUseCase } from './use-cases/list-clients.use-case';
import { UpdateClientUseCase } from './use-cases/update-client.use-case';

@UseGuards(JwtAuthGuard)
@Controller('clients')
export class ClientsController {
  constructor(
    private readonly createClientUseCase: CreateClientUseCase,
    private readonly listClientsUseCase: ListClientsUseCase,
    private readonly getClientUseCase: GetClientUseCase,
    private readonly updateClientUseCase: UpdateClientUseCase,
  ) {}

  @Post()
  createClient(@CurrentUser() user: AuthUserPayload, @Body() dto: CreateClientDto) {
    return this.createClientUseCase.execute(user, dto);
  }

  @Get()
  listClients(
    @CurrentOrganizationId() organizationId: string,
    @Query() query: ListClientsQueryDto,
  ) {
    return this.listClientsUseCase.execute(organizationId, query);
  }

  @Get(':id')
  getClient(
    @CurrentOrganizationId() organizationId: string,
    @Param('id', new ParseUUIDPipe()) clientId: string,
  ) {
    return this.getClientUseCase.execute(organizationId, clientId);
  }

  @Patch(':id')
  updateClient(
    @CurrentUser() user: AuthUserPayload,
    @Param('id', new ParseUUIDPipe()) clientId: string,
    @Body() dto: UpdateClientDto,
  ) {
    return this.updateClientUseCase.execute(user, clientId, dto);
  }
}
