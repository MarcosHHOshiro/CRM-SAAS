import { ConflictException, Injectable } from '@nestjs/common';
import { UserRole } from '@prisma/client';

import { PrismaService } from '../../../prisma/prisma.service';
import { AuthService } from '../auth.service';
import type { RegisterDto } from '../dto/register.dto';

@Injectable()
export class RegisterUseCase {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly authService: AuthService,
  ) {}

  async execute(dto: RegisterDto) {
    const organizationSlug = this.authService.buildOrganizationSlug(
      dto.organizationName,
      dto.organizationSlug,
    );

    await Promise.all([
      this.authService.ensureOrganizationSlugIsAvailable(organizationSlug),
      this.authService.ensureEmailIsAvailable(dto.email),
    ]);

    try {
      return await this.prismaService.$transaction(async (prismaClient) => {
        const organization = await prismaClient.organization.create({
          data: {
            name: dto.organizationName,
            slug: organizationSlug,
          },
        });

        const user = await prismaClient.user.create({
          data: {
            organizationId: organization.id,
            name: dto.name,
            email: dto.email,
            passwordHash: await this.authService.hashPassword(dto.password),
            role: UserRole.OWNER,
          },
          include: {
            organization: true,
          },
        });

        return this.authService.createSession(user, prismaClient);
      });
    } catch (error) {
      if (this.isUniqueConstraintError(error)) {
        throw new ConflictException('Organization or email already exists.');
      }

      throw error;
    }
  }

  private isUniqueConstraintError(error: unknown) {
    return (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      error.code === 'P2002'
    );
  }
}

