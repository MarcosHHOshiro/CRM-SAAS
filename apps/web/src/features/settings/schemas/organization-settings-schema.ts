import { z } from 'zod';

export const organizationSettingsSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'O nome da organizacao precisa ter pelo menos 2 caracteres.')
    .max(120, 'O nome da organizacao pode ter no maximo 120 caracteres.'),
});
