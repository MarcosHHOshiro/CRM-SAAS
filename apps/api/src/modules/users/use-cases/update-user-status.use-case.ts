import { Injectable } from '@nestjs/common';

import type { AuthUserPayload } from '../../auth/interfaces/auth-user-payload.interface';
import type { UpdateUserStatusDto } from '../dto/update-user-status.dto';
import { UsersService } from '../users.service';

@Injectable()
export class UpdateUserStatusUseCase {
  constructor(private readonly usersService: UsersService) {}

  async execute(actor: AuthUserPayload, userId: string, dto: UpdateUserStatusDto) {
    const targetUser = this.usersService.ensureUserExists(
      await this.usersService.findByIdWithinOrganization(userId, actor.organizationId),
    );

    this.usersService.assertCanManageUser(actor, targetUser);
    this.usersService.assertNotUpdatingOwnStatus(actor, targetUser.id);

    const user = await this.usersService.update(targetUser.id, {
      isActive: dto.isActive,
    });

    return {
      user: this.usersService.serializeUser(user),
    };
  }
}

