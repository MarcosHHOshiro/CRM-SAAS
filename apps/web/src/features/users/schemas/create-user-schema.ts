import { z } from 'zod';
import { UserRole } from '@crm-saas/types';
import type { AppMessages } from '@/i18n/messages/types';

export function createUserSchema(messages: AppMessages) {
  return z.object({
    email: z
      .email(messages.users.validation.emailInvalid)
      .transform((value) => value.trim().toLowerCase()),
    name: z
      .string()
      .trim()
      .min(2, messages.users.validation.nameMin)
      .max(120, messages.users.validation.nameMax),
    password: z
      .string()
      .min(8, messages.users.validation.passwordMin)
      .max(72, messages.users.validation.passwordMax),
    role: z.nativeEnum(UserRole),
  });
}
