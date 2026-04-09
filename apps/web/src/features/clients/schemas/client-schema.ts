import { z } from 'zod';

export const clientSchema = z.object({
  company: z.string().trim().max(120, 'Company must have at most 120 characters.'),
  email: z.union([z.literal(''), z.email('Enter a valid email address.')]).transform((value) =>
    value.trim().toLowerCase(),
  ),
  name: z
    .string()
    .trim()
    .min(2, 'Client name must have at least 2 characters.')
    .max(120, 'Client name must have at most 120 characters.'),
  ownerUserId: z.union([z.literal(''), z.uuid('Choose a valid owner.')]),
  phone: z.string().trim().max(30, 'Phone must have at most 30 characters.'),
});
