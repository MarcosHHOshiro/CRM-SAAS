import { Injectable } from '@nestjs/common';

import { AuthService } from '../auth.service';

@Injectable()
export class RefreshSessionUseCase {
  constructor(private readonly authService: AuthService) {}

  async execute(dto: { refreshToken: string }) {
    const payload = await this.authService.verifyRefreshToken(dto.refreshToken);
    const storedToken = await this.authService.ensureRefreshTokenIsActive(
      dto.refreshToken,
      payload,
    );

    const user = await this.authService.findUserForSession(
      payload.sub,
      payload.organizationId,
    );
    const activeUser = await this.authService.ensureActiveUser(user);

    await this.authService.revokeRefreshToken(storedToken);

    return this.authService.createSession(activeUser);
  }
}
