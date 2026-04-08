import { Injectable } from '@nestjs/common';

import { AuthService } from '../../auth/auth.service';
import type { AuthUserPayload } from '../../auth/interfaces/auth-user-payload.interface';
import type { CreateUserDto } from '../dto/create-user.dto';
import { UsersService } from '../users.service';

@Injectable()
export class CreateUserUseCase {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  async execute(actor: AuthUserPayload, dto: CreateUserDto) {
    this.usersService.assertCanCreateRole(actor, dto.role);
    await this.authService.ensureEmailIsAvailable(dto.email);

    const user = await this.usersService.create({
      name: dto.name,
      email: dto.email,
      passwordHash: await this.authService.hashPassword(dto.password),
      role: dto.role,
      organization: {
        connect: {
          id: actor.organizationId,
        },
      },
    });

    return {
      user: this.usersService.serializeUser(user),
    };
  }
}

