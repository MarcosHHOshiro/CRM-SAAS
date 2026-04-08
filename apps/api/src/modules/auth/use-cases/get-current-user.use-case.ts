import { Injectable, UnauthorizedException } from '@nestjs/common';

import { AuthService } from '../auth.service';
import type { AuthUserPayload } from '../interfaces/auth-user-payload.interface';

@Injectable()
export class GetCurrentUserUseCase {
  constructor(private readonly authService: AuthService) {}

  async execute(userPayload: AuthUserPayload) {
    const user = await this.authService.findUserForSession(
      userPayload.sub,
      userPayload.organizationId,
    );

    if (!user) {
      throw new UnauthorizedException('User not found.');
    }

    return {
      user: this.authService.serializeUser(user),
      organization: this.authService.serializeOrganization(user.organization),
    };
  }
}

