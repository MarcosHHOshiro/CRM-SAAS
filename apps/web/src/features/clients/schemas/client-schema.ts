import { z } from 'zod';
import type { AppMessages } from '@/i18n/messages/types';

export function createClientSchema(messages: AppMessages) {
  return z.object({
    company: z.string().trim().max(120, messages.clients.validation.companyMax),
    email: z
      .union([z.literal(''), z.email(messages.clients.validation.emailInvalid)])
      .transform((value) => value.trim().toLowerCase()),
    name: z
      .string()
      .trim()
      .min(2, messages.clients.validation.nameMin)
      .max(120, messages.clients.validation.nameMax),
    ownerUserId: z.union([z.literal(''), z.uuid(messages.clients.validation.ownerInvalid)]),
    phone: z.string().trim().max(30, messages.clients.validation.phoneMax),
  });
}
