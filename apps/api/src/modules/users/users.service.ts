import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { Prisma, User, UserRole } from '@prisma/client';

import { isPrismaUniqueConstraintError } from '../../common/prisma/prisma-error.util';
import { PrismaService } from '../../prisma/prisma.service';
import type { AuthUserPayload } from '../auth/interfaces/auth-user-payload.interface';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  listByOrganization(organizationId: string) {
    return this.prismaService.user.findMany({
      where: { organizationId },
      orderBy: { createdAt: 'asc' },
    });
  }

  findByIdWithinOrganization(id: string, organizationId: string) {
    return this.prismaService.user.findFirst({
      where: {
        id,
        organizationId,
      },
    });
  }

  async create(data: Prisma.UserCreateInput) {
    try {
      return await this.prismaService.user.create({ data });
    } catch (error) {
      if (isPrismaUniqueConstraintError(error)) {
        throw new ConflictException('Email is already in use.');
      }

      throw error;
    }
  }

  update(id: string, data: Prisma.UserUpdateInput) {
    return this.prismaService.user.update({
      where: { id },
      data,
    });
  }

  ensureUserExists(user: User | null) {
    if (!user) {
      throw new NotFoundException('User not found.');
    }

    return user;
  }

  assertCanCreateRole(actor: AuthUserPayload, targetRole: UserRole) {
    if (actor.role === 'MANAGER' && targetRole === 'OWNER') {
      throw new ForbiddenException('Managers cannot create owner users.');
    }
  }

  assertCanManageUser(actor: AuthUserPayload, targetUser: User) {
    if (targetUser.organizationId !== actor.organizationId) {
      throw new NotFoundException('User not found.');
    }

    if (actor.role === 'MANAGER' && targetUser.role === 'OWNER') {
      throw new ForbiddenException('Managers cannot manage owner users.');
    }
  }

  assertCanAssignRole(actor: AuthUserPayload, role: UserRole) {
    if (actor.role === 'MANAGER' && role === 'OWNER') {
      throw new ForbiddenException('Managers cannot assign owner role.');
    }
  }

  assertNotUpdatingOwnRole(actor: AuthUserPayload, targetUserId: string) {
    if (actor.sub === targetUserId) {
      throw new ForbiddenException('You cannot change your own role.');
    }
  }

  assertNotUpdatingOwnStatus(actor: AuthUserPayload, targetUserId: string) {
    if (actor.sub === targetUserId) {
      throw new ForbiddenException('You cannot change your own active status.');
    }
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
}
