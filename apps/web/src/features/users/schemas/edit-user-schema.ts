import { z } from 'zod';
import { UserRole } from '@crm-saas/types';

export const editUserSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'User name must have at least 2 characters.')
    .max(120, 'User name must have at most 120 characters.'),
  role: z.nativeEnum(UserRole),
});
