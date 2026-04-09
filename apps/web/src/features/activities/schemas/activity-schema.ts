import { z } from 'zod';

import { activityTypes } from '../types/activities';

export const activitySchema = z.object({
  clientId: z.union([z.literal(''), z.uuid('Choose a valid client.')]),
  description: z
    .string()
    .trim()
    .min(1, 'Description is required.')
    .max(2000, 'Description must have at most 2000 characters.'),
  leadId: z.union([z.literal(''), z.uuid('Choose a valid lead.')]),
  opportunityId: z.union([z.literal(''), z.uuid('Choose a valid opportunity.')]),
  type: z.enum(activityTypes),
});
