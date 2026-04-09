import { z } from 'zod';

export const loginSchema = z.object({
  email: z.email('Enter a valid email address.').transform((value) => value.trim().toLowerCase()),
  password: z
    .string()
    .min(8, 'Password must have at least 8 characters.')
    .max(72, 'Password must have at most 72 characters.'),
});
