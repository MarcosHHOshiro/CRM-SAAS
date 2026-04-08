import type { UserRole } from '@prisma/client';

export interface AuthUserPayload {
  sub: string;
  organizationId: string;
  email: string;
  role: UserRole;
  type: 'access' | 'refresh';
}

