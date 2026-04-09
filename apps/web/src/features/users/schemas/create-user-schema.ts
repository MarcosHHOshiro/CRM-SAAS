import { z } from 'zod';
import { UserRole } from '@crm-saas/types';

export const createUserSchema = z.object({
  email: z.email('Enter a valid email address.').transform((value) => value.trim().toLowerCase()),
  name: z
    .string()
    .trim()
    .min(2, 'User name must have at least 2 characters.')
    .max(120, 'User name must have at most 120 characters.'),
  password: z
    .string()
    .min(8, 'Password must have at least 8 characters.')
    .max(72, 'Password must have at most 72 characters.'),
  role: z.nativeEnum(UserRole),
});
