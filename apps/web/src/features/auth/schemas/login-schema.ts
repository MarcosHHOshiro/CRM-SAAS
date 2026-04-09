import { z } from 'zod';
import type { AppMessages } from '@/i18n/messages/types';

export function createLoginSchema(messages: AppMessages) {
  return z.object({
    email: z
      .email(messages.auth.validation.emailInvalid)
      .transform((value) => value.trim().toLowerCase()),
    password: z
      .string()
      .min(8, messages.auth.validation.passwordMin)
      .max(72, messages.auth.validation.passwordMax),
  });
}
