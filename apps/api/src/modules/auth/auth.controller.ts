import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Request, Response } from 'express';

import { CurrentUser } from './decorators/current-user.decorator';
import { LoginDto } from './dto/login.dto';
import { LogoutDto } from './dto/logout.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { RegisterDto } from './dto/register.dto';
import {
  REFRESH_TOKEN_COOKIE,
  clearAuthCookies,
  getCookieValue,
  setAuthCookies,
} from './auth-cookie';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import type { AuthUserPayload } from './interfaces/auth-user-payload.interface';
import { GetCurrentUserUseCase } from './use-cases/get-current-user.use-case';
import { LoginUseCase } from './use-cases/login.use-case';
import { LogoutUseCase } from './use-cases/logout.use-case';
import { RefreshSessionUseCase } from './use-cases/refresh-session.use-case';
import { RegisterUseCase } from './use-cases/register.use-case';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly configService: ConfigService,
    private readonly registerUseCase: RegisterUseCase,
    private readonly loginUseCase: LoginUseCase,
    private readonly refreshSessionUseCase: RefreshSessionUseCase,
    private readonly logoutUseCase: LogoutUseCase,
    private readonly getCurrentUserUseCase: GetCurrentUserUseCase,
  ) {}

  @Post('register')
  async register(
    @Body() dto: RegisterDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const session = await this.registerUseCase.execute(dto);

    setAuthCookies(response, this.configService, session);

    return {
      user: session.user,
      organization: session.organization,
    };
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const session = await this.loginUseCase.execute(dto);

    setAuthCookies(response, this.configService, session);

    return {
      user: session.user,
      organization: session.organization,
    };
  }

  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  async refresh(
    @Body() dto: RefreshTokenDto,
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const session = await this.refreshSessionUseCase.execute({
      refreshToken: this.resolveRefreshToken(request, dto.refreshToken),
    });

    setAuthCookies(response, this.configService, session);

    return {
      user: session.user,
      organization: session.organization,
    };
  }

  @HttpCode(HttpStatus.OK)
  @Post('logout')
  async logout(
    @Body() dto: LogoutDto,
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const result = await this.logoutUseCase.execute({
      refreshToken: this.resolveRefreshToken(request, dto.refreshToken),
    });

    clearAuthCookies(response, this.configService);

    return result;
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  me(@CurrentUser() user: AuthUserPayload) {
    return this.getCurrentUserUseCase.execute(user);
  }

  private resolveRefreshToken(request: Request, refreshTokenFromBody?: string) {
    return (
      refreshTokenFromBody ||
      getCookieValue(request, REFRESH_TOKEN_COOKIE) ||
      ''
    );
  }
}
