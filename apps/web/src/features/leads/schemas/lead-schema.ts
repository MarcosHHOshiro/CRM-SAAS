import { z } from 'zod';
import type { AppMessages } from '@/i18n/messages/types';

import { leadStatuses } from '../types/leads';

export function leadSchema(messages: AppMessages) {
  return z.object({
    company: z.string().trim().max(120, messages.leads.validation.companyMax),
    email: z
      .union([z.literal(''), z.email(messages.leads.validation.emailInvalid)])
      .transform((value) => value.trim().toLowerCase()),
    name: z
      .string()
      .trim()
      .min(2, messages.leads.validation.nameMin)
      .max(120, messages.leads.validation.nameMax),
    notes: z.string().trim().max(2000, messages.leads.validation.notesMax),
    ownerUserId: z.union([z.literal(''), z.uuid(messages.leads.validation.ownerInvalid)]),
    phone: z.string().trim().max(30, messages.leads.validation.phoneMax),
    status: z.enum(leadStatuses),
  });
}
