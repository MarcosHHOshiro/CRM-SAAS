import { Injectable, UnauthorizedException } from '@nestjs/common';

import { AuthService } from '../auth.service';
import type { LoginDto } from '../dto/login.dto';

@Injectable()
export class LoginUseCase {
  constructor(private readonly authService: AuthService) {}

  async execute(dto: LoginDto) {
    const user = await this.authService.findUserByEmail(dto.email);
    const activeUser = await this.authService.ensureActiveUser(user);
    const passwordMatches = await this.authService.comparePassword(
      dto.password,
      activeUser.passwordHash,
    );

    if (!passwordMatches) {
      throw new UnauthorizedException('Invalid credentials.');
    }

    return this.authService.createSession(activeUser);
  }
}

