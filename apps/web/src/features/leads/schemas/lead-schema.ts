import { z } from 'zod';

import { leadStatuses } from '../types/leads';

export const leadSchema = z.object({
  company: z.string().trim().max(120, 'A empresa pode ter no maximo 120 caracteres.'),
  email: z.union([z.literal(''), z.email('Digite um endereco de email valido.')]).transform((value) =>
    value.trim().toLowerCase(),
  ),
  name: z
    .string()
    .trim()
    .min(2, 'O nome do lead precisa ter pelo menos 2 caracteres.')
    .max(120, 'O nome do lead pode ter no maximo 120 caracteres.'),
  notes: z.string().trim().max(2000, 'As notas podem ter no maximo 2000 caracteres.'),
  ownerUserId: z.union([z.literal(''), z.uuid('Escolha um responsavel valido.')]),
  phone: z.string().trim().max(30, 'O telefone pode ter no maximo 30 caracteres.'),
  status: z.enum(leadStatuses),
});
