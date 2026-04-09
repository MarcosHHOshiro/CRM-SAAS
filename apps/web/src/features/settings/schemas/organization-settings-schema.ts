import { z } from 'zod';

export const organizationSettingsSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Organization name must have at least 2 characters.')
    .max(120, 'Organization name must have at most 120 characters.'),
});
