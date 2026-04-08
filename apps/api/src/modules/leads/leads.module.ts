import { Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module';
import { LeadsController } from './leads.controller';
import { LeadsService } from './leads.service';
import { ConvertLeadUseCase } from './use-cases/convert-lead.use-case';
import { CreateLeadUseCase } from './use-cases/create-lead.use-case';
import { DeleteLeadUseCase } from './use-cases/delete-lead.use-case';
import { GetLeadUseCase } from './use-cases/get-lead.use-case';
import { ListLeadsUseCase } from './use-cases/list-leads.use-case';
import { UpdateLeadUseCase } from './use-cases/update-lead.use-case';

@Module({
  imports: [AuthModule],
  controllers: [LeadsController],
  providers: [
    LeadsService,
    CreateLeadUseCase,
    ListLeadsUseCase,
    GetLeadUseCase,
    UpdateLeadUseCase,
    DeleteLeadUseCase,
    ConvertLeadUseCase,
  ],
})
export class LeadsModule {}

