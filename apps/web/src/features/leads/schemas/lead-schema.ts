import { z } from 'zod';

import { leadStatuses } from '../types/leads';

export const leadSchema = z.object({
  company: z.string().trim().max(120, 'Company must have at most 120 characters.'),
  email: z.union([z.literal(''), z.email('Enter a valid email address.')]).transform((value) =>
    value.trim().toLowerCase(),
  ),
  name: z
    .string()
    .trim()
    .min(2, 'Lead name must have at least 2 characters.')
    .max(120, 'Lead name must have at most 120 characters.'),
  notes: z.string().trim().max(2000, 'Notes must have at most 2000 characters.'),
  ownerUserId: z.union([z.literal(''), z.uuid('Choose a valid owner.')]),
  phone: z.string().trim().max(30, 'Phone must have at most 30 characters.'),
  status: z.enum(leadStatuses),
});
