import { z } from 'zod';
import type { AppMessages } from '@/i18n/messages/types';

import { activityTypes } from '../types/activities';

export function activitySchema(messages: AppMessages) {
  return z.object({
    clientId: z.union([z.literal(''), z.uuid(messages.activities.validation.clientInvalid)]),
    description: z
      .string()
      .trim()
      .min(1, messages.activities.validation.descriptionRequired)
      .max(2000, messages.activities.validation.descriptionMax),
    leadId: z.union([z.literal(''), z.uuid(messages.activities.validation.leadInvalid)]),
    opportunityId: z.union([
      z.literal(''),
      z.uuid(messages.activities.validation.opportunityInvalid),
    ]),
    type: z.enum(activityTypes),
  });
}
