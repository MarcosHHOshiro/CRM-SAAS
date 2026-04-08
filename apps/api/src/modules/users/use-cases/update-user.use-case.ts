import { Injectable } from '@nestjs/common';

import type { AuthUserPayload } from '../../auth/interfaces/auth-user-payload.interface';
import type { UpdateUserDto } from '../dto/update-user.dto';
import { UsersService } from '../users.service';

@Injectable()
export class UpdateUserUseCase {
  constructor(private readonly usersService: UsersService) {}

  async execute(actor: AuthUserPayload, userId: string, dto: UpdateUserDto) {
    const targetUser = this.usersService.ensureUserExists(
      await this.usersService.findByIdWithinOrganization(userId, actor.organizationId),
    );

    this.usersService.assertCanManageUser(actor, targetUser);

    if (dto.role) {
      this.usersService.assertCanAssignRole(actor, dto.role);
      this.usersService.assertNotUpdatingOwnRole(actor, targetUser.id);
    }

    const user = await this.usersService.update(targetUser.id, {
      ...(dto.name ? { name: dto.name } : {}),
      ...(dto.role ? { role: dto.role } : {}),
    });

    return {
      user: this.usersService.serializeUser(user),
    };
  }
}

