import { z } from 'zod';

import { opportunityStages } from '../types/opportunities';

const opportunitySharedShape = {
  estimatedValue: z
    .string()
    .trim()
    .regex(/^\d+(\.\d{1,2})?$/, 'Enter a valid amount with up to 2 decimal places.'),
  expectedCloseDate: z.union([
    z.literal(''),
    z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Enter a valid close date.'),
  ]),
  notes: z.string().trim().max(2000, 'Notes must have at most 2000 characters.'),
  ownerUserId: z.union([z.literal(''), z.uuid('Choose a valid owner.')]),
  title: z
    .string()
    .trim()
    .min(2, 'Opportunity title must have at least 2 characters.')
    .max(160, 'Opportunity title must have at most 160 characters.'),
};

export const createOpportunitySchema = z.object({
  ...opportunitySharedShape,
  clientId: z.uuid('Choose a valid client.'),
  stage: z.enum(opportunityStages),
});

export const updateOpportunitySchema = z.object({
  ...opportunitySharedShape,
  clientId: z.string(),
  stage: z.enum(opportunityStages),
});
