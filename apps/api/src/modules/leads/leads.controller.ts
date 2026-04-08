import {
  Body,
  Controller,
  Delete,
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
import { CreateLeadDto } from './dto/create-lead.dto';
import { ListLeadsQueryDto } from './dto/list-leads-query.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { CreateLeadUseCase } from './use-cases/create-lead.use-case';
import { DeleteLeadUseCase } from './use-cases/delete-lead.use-case';
import { GetLeadUseCase } from './use-cases/get-lead.use-case';
import { ListLeadsUseCase } from './use-cases/list-leads.use-case';
import { UpdateLeadUseCase } from './use-cases/update-lead.use-case';
import { ConvertLeadUseCase } from './use-cases/convert-lead.use-case';

@UseGuards(JwtAuthGuard)
@Controller('leads')
export class LeadsController {
  constructor(
    private readonly createLeadUseCase: CreateLeadUseCase,
    private readonly listLeadsUseCase: ListLeadsUseCase,
    private readonly getLeadUseCase: GetLeadUseCase,
    private readonly updateLeadUseCase: UpdateLeadUseCase,
    private readonly deleteLeadUseCase: DeleteLeadUseCase,
    private readonly convertLeadUseCase: ConvertLeadUseCase,
  ) {}

  @Post()
  createLead(@CurrentUser() user: AuthUserPayload, @Body() dto: CreateLeadDto) {
    return this.createLeadUseCase.execute(user, dto);
  }

  @Get()
  listLeads(
    @CurrentOrganizationId() organizationId: string,
    @Query() query: ListLeadsQueryDto,
  ) {
    return this.listLeadsUseCase.execute(organizationId, query);
  }

  @Get(':id')
  getLead(
    @CurrentOrganizationId() organizationId: string,
    @Param('id', new ParseUUIDPipe()) leadId: string,
  ) {
    return this.getLeadUseCase.execute(organizationId, leadId);
  }

  @Patch(':id')
  updateLead(
    @CurrentUser() user: AuthUserPayload,
    @Param('id', new ParseUUIDPipe()) leadId: string,
    @Body() dto: UpdateLeadDto,
  ) {
    return this.updateLeadUseCase.execute(user, leadId, dto);
  }

  @Delete(':id')
  deleteLead(
    @CurrentOrganizationId() organizationId: string,
    @Param('id', new ParseUUIDPipe()) leadId: string,
  ) {
    return this.deleteLeadUseCase.execute(organizationId, leadId);
  }

  @Post(':id/convert')
  convertLead(
    @CurrentOrganizationId() organizationId: string,
    @Param('id', new ParseUUIDPipe()) leadId: string,
  ) {
    return this.convertLeadUseCase.execute(organizationId, leadId);
  }
}

