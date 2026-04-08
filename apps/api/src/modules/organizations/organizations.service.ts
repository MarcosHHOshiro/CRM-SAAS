import { Injectable, NotFoundException } from '@nestjs/common';
import type { Organization } from '@prisma/client';

import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class OrganizationsService {
  constructor(private readonly prismaService: PrismaService) {}

  async findById(id: string) {
    return this.prismaService.organization.findUnique({
      where: { id },
    });
  }

  async updateName(id: string, name: string) {
    return this.prismaService.organization.update({
      where: { id },
      data: { name },
    });
  }

  ensureOrganizationExists(organization: Organization | null) {
    if (!organization) {
      throw new NotFoundException('Organization not found.');
    }

    return organization;
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
}

