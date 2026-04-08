import { Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CreateUserUseCase } from './use-cases/create-user.use-case';
import { ListUsersUseCase } from './use-cases/list-users.use-case';
import { UpdateUserStatusUseCase } from './use-cases/update-user-status.use-case';
import { UpdateUserUseCase } from './use-cases/update-user.use-case';

@Module({
  imports: [AuthModule],
  controllers: [UsersController],
  providers: [
    UsersService,
    ListUsersUseCase,
    CreateUserUseCase,
    UpdateUserUseCase,
    UpdateUserStatusUseCase,
  ],
})
export class UsersModule {}

