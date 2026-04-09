import { z } from 'zod';
import type { AppMessages } from '@/i18n/messages/types';

export function createRegisterSchema(messages: AppMessages) {
  return z.object({
    organizationName: z
      .string()
      .trim()
      .min(2, messages.auth.validation.organizationNameMin)
      .max(120, messages.auth.validation.organizationNameMax),
    organizationSlug: z
      .string()
      .trim()
      .toLowerCase()
      .regex(/^[a-z0-9-]+$/, messages.auth.validation.organizationSlugPattern)
      .min(2, messages.auth.validation.organizationSlugMin)
      .max(80, messages.auth.validation.organizationSlugMax)
      .optional()
      .or(z.literal('')),
    name: z
      .string()
      .trim()
      .min(2, messages.auth.validation.nameMin)
      .max(120, messages.auth.validation.nameMax),
    email: z
      .email(messages.auth.validation.emailInvalid)
      .transform((value) => value.trim().toLowerCase()),
    password: z
      .string()
      .min(8, messages.auth.validation.passwordMin)
      .max(72, messages.auth.validation.passwordMax),
  });
}
