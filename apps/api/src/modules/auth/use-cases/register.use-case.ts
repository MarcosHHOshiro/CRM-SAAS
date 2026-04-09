import { ConflictException, Injectable } from '@nestjs/common';
import { UserRole } from '@prisma/client';

import { isPrismaUniqueConstraintError } from '../../../common/prisma/prisma-error.util';
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
      if (isPrismaUniqueConstraintError(error)) {
        throw new ConflictException('Organization or email already exists.');
      }

      throw error;
    }
  }
}
