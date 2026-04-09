import { z } from 'zod';
import { UserRole } from '@crm-saas/types';
import type { AppMessages } from '@/i18n/messages/types';

export function editUserSchema(messages: AppMessages) {
  return z.object({
    name: z
      .string()
      .trim()
      .min(2, messages.users.validation.nameMin)
      .max(120, messages.users.validation.nameMax),
    role: z.nativeEnum(UserRole),
  });
}
