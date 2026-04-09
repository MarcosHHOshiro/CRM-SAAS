import { z } from 'zod';

export const registerSchema = z.object({
  organizationName: z
    .string()
    .trim()
    .min(2, 'Organization name must have at least 2 characters.')
    .max(120, 'Organization name must have at most 120 characters.'),
  organizationSlug: z
    .string()
    .trim()
    .toLowerCase()
    .regex(/^[a-z0-9-]+$/, 'Use only lowercase letters, numbers, and hyphens.')
    .min(2, 'Slug must have at least 2 characters.')
    .max(80, 'Slug must have at most 80 characters.')
    .optional()
    .or(z.literal('')),
  name: z
    .string()
    .trim()
    .min(2, 'Your name must have at least 2 characters.')
    .max(120, 'Your name must have at most 120 characters.'),
  email: z.email('Enter a valid email address.').transform((value) => value.trim().toLowerCase()),
  password: z
    .string()
    .min(8, 'Password must have at least 8 characters.')
    .max(72, 'Password must have at most 72 characters.'),
});
