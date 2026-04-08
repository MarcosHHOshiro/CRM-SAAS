import { Injectable } from '@nestjs/common';

import { UsersService } from '../users.service';

@Injectable()
export class ListUsersUseCase {
  constructor(private readonly usersService: UsersService) {}

  async execute(organizationId: string) {
    const users = await this.usersService.listByOrganization(organizationId);

    return {
      users: users.map((user) => this.usersService.serializeUser(user)),
    };
  }
}

