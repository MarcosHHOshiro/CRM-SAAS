import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UserRole } from '@prisma/client';

import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import type { AuthUserPayload } from '../auth/interfaces/auth-user-payload.interface';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserStatusDto } from './dto/update-user-status.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserUseCase } from './use-cases/create-user.use-case';
import { ListUsersUseCase } from './use-cases/list-users.use-case';
import { UpdateUserStatusUseCase } from './use-cases/update-user-status.use-case';
import { UpdateUserUseCase } from './use-cases/update-user.use-case';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.OWNER, UserRole.MANAGER)
@Controller('users')
export class UsersController {
  constructor(
    private readonly listUsersUseCase: ListUsersUseCase,
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
    private readonly updateUserStatusUseCase: UpdateUserStatusUseCase,
  ) {}

  @Get()
  listUsers(@CurrentUser() user: AuthUserPayload) {
    return this.listUsersUseCase.execute(user.organizationId);
  }

  @Post()
  createUser(@CurrentUser() user: AuthUserPayload, @Body() dto: CreateUserDto) {
    return this.createUserUseCase.execute(user, dto);
  }

  @Patch(':id')
  updateUser(
    @CurrentUser() user: AuthUserPayload,
    @Param('id', new ParseUUIDPipe()) userId: string,
    @Body() dto: UpdateUserDto,
  ) {
    return this.updateUserUseCase.execute(user, userId, dto);
  }

  @Patch(':id/status')
  updateUserStatus(
    @CurrentUser() user: AuthUserPayload,
    @Param('id', new ParseUUIDPipe()) userId: string,
    @Body() dto: UpdateUserStatusDto,
  ) {
    return this.updateUserStatusUseCase.execute(user, userId, dto);
  }
}

