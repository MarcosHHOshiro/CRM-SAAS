import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import type {
  Organization,
  Prisma,
  RefreshToken,
  User,
} from '@prisma/client';
import { compare, hash } from 'bcryptjs';
import { createHash, randomUUID } from 'crypto';
import type { StringValue } from 'ms';

import { PrismaService } from '../../prisma/prisma.service';
import type { AuthUserPayload } from './interfaces/auth-user-payload.interface';

type AuthenticatedUserRecord = User & {
  organization: Organization;
};

type AuthSessionResult = {
  accessToken: string;
  accessTokenExpiresAt: Date;
  refreshToken: string;
  refreshTokenExpiresAt: Date;
  user: ReturnType<AuthService['serializeUser']>;
  organization: ReturnType<AuthService['serializeOrganization']>;
};

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async hashPassword(password: string) {
    return hash(password, this.configService.get<number>('BCRYPT_SALT_ROUNDS') ?? 10);
  }

  async comparePassword(password: string, passwordHash: string) {
    return compare(password, passwordHash);
  }

  async findUserByEmail(email: string) {
    return this.prismaService.user.findFirst({
      where: { email },
      include: { organization: true },
    });
  }

  async findUserForSession(userId: string, organizationId: string) {
    return this.prismaService.user.findFirst({
      where: {
        id: userId,
        organizationId,
        isActive: true,
      },
      include: { organization: true },
    });
  }

  async signAccessToken(payload: Omit<AuthUserPayload, 'type'>) {
    return this.jwtService.signAsync(
      { ...payload, type: 'access' satisfies AuthUserPayload['type'] },
      {
        secret: this.configService.getOrThrow<string>('JWT_ACCESS_SECRET'),
        expiresIn: this.configService.getOrThrow<string>(
          'JWT_ACCESS_EXPIRES_IN',
        ) as StringValue,
      },
    );
  }

  async signRefreshToken(payload: Omit<AuthUserPayload, 'type'>) {
    return this.jwtService.signAsync(
      { ...payload, type: 'refresh' satisfies AuthUserPayload['type'] },
      {
        secret: this.configService.getOrThrow<string>('JWT_REFRESH_SECRET'),
        expiresIn: this.configService.getOrThrow<string>(
          'JWT_REFRESH_EXPIRES_IN',
        ) as StringValue,
        jwtid: randomUUID(),
      },
    );
  }

  async verifyRefreshToken(refreshToken: string) {
    const payload = await this.jwtService.verifyAsync<AuthUserPayload>(refreshToken, {
      secret: this.configService.getOrThrow<string>('JWT_REFRESH_SECRET'),
    });

    if (payload.type !== 'refresh') {
      throw new UnauthorizedException('Invalid refresh token.');
    }

    return payload;
  }

  hashToken(token: string) {
    return createHash('sha256').update(token).digest('hex');
  }

  serializeUser(user: User) {
    return {
      id: user.id,
      organizationId: user.organizationId,
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };
  }

  serializeOrganization(organization: Organization) {
    return {
      id: organization.id,
      name: organization.name,
      slug: organization.slug,
      createdAt: organization.createdAt.toISOString(),
      updatedAt: organization.updatedAt.toISOString(),
    };
  }

  async revokeRefreshTokenByValue(refreshToken: string) {
    const tokenHash = this.hashToken(refreshToken);

    const storedToken = await this.prismaService.refreshToken.findFirst({
      where: { tokenHash },
    });

    if (!storedToken || storedToken.revokedAt) {
      return;
    }

    await this.prismaService.refreshToken.update({
      where: { id: storedToken.id },
      data: { revokedAt: new Date() },
    });
  }

  async createSession(
    user: AuthenticatedUserRecord,
    prismaClient: Prisma.TransactionClient | PrismaService = this.prismaService,
  ): Promise<AuthSessionResult> {
    const tokenPayload = {
      sub: user.id,
      organizationId: user.organizationId,
      email: user.email,
      role: user.role,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.signAccessToken(tokenPayload),
      this.signRefreshToken(tokenPayload),
    ]);

    await prismaClient.refreshToken.create({
      data: {
        organizationId: user.organizationId,
        userId: user.id,
        tokenHash: this.hashToken(refreshToken),
        expiresAt: this.decodeExpirationDate(refreshToken),
      },
    });

    const accessTokenExpiresAt = this.decodeExpirationDate(accessToken);
    const refreshTokenExpiresAt = this.decodeExpirationDate(refreshToken);

    return {
      accessToken,
      accessTokenExpiresAt,
      refreshToken,
      refreshTokenExpiresAt,
      user: this.serializeUser(user),
      organization: this.serializeOrganization(user.organization),
    };
  }

  async ensureActiveUser(user: AuthenticatedUserRecord | null) {
    if (!user) {
      throw new UnauthorizedException('Invalid credentials.');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('User is inactive.');
    }

    return user;
  }

  async ensureRefreshTokenIsActive(refreshToken: string, payload: AuthUserPayload) {
    const storedToken = await this.prismaService.refreshToken.findFirst({
      where: { tokenHash: this.hashToken(refreshToken) },
    });

    if (
      !storedToken ||
      storedToken.userId !== payload.sub ||
      storedToken.organizationId !== payload.organizationId ||
      storedToken.revokedAt ||
      storedToken.expiresAt <= new Date()
    ) {
      throw new UnauthorizedException('Refresh token is invalid or expired.');
    }

    return storedToken;
  }

  async revokeRefreshToken(storedToken: RefreshToken) {
    if (storedToken.revokedAt) {
      return;
    }

    await this.prismaService.refreshToken.update({
      where: { id: storedToken.id },
      data: { revokedAt: new Date() },
    });
  }

  buildOrganizationSlug(name: string, providedSlug?: string) {
    const baseSlug = (providedSlug ?? name)
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');

    if (!baseSlug) {
      throw new BadRequestException('Organization slug is invalid.');
    }

    return baseSlug;
  }

  async ensureOrganizationSlugIsAvailable(slug: string) {
    const organization = await this.prismaService.organization.findUnique({
      where: { slug },
    });

    if (organization) {
      throw new ConflictException('Organization slug is already in use.');
    }
  }

  async ensureEmailIsAvailable(email: string) {
    const user = await this.prismaService.user.findFirst({
      where: { email },
    });

    if (user) {
      throw new ConflictException('Email is already in use.');
    }
  }

  private decodeExpirationDate(token: string) {
    const payload = this.jwtService.decode(token);

    if (
      typeof payload !== 'object' ||
      payload === null ||
      !('exp' in payload) ||
      typeof payload.exp !== 'number'
    ) {
      throw new UnauthorizedException('Token expiration could not be determined.');
    }

    return new Date(payload.exp * 1000);
  }
}
