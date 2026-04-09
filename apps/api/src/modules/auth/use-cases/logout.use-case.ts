import { Injectable } from '@nestjs/common';

import { AuthService } from '../auth.service';

@Injectable()
export class LogoutUseCase {
  constructor(private readonly authService: AuthService) {}

  async execute(dto: { refreshToken: string }) {
    try {
      const payload = await this.authService.verifyRefreshToken(dto.refreshToken);
      const storedToken = await this.authService.ensureRefreshTokenIsActive(
        dto.refreshToken,
        payload,
      );

      await this.authService.revokeRefreshToken(storedToken);
    } catch {
      await this.authService.revokeRefreshTokenByValue(dto.refreshToken);
    }

    return {
      message: 'Logged out successfully.',
    };
  }
}
