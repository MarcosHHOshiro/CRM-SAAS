import { z } from 'zod';
import type { AppMessages } from '@/i18n/messages/types';

import { opportunityStages } from '../types/opportunities';

export function createOpportunitySchema(messages: AppMessages) {
  const opportunitySharedShape = {
    estimatedValue: z
      .string()
      .trim()
      .regex(/^\d+(\.\d{1,2})?$/, messages.opportunities.validation.estimatedValueInvalid),
    expectedCloseDate: z.union([
      z.literal(''),
      z.string().regex(/^\d{4}-\d{2}-\d{2}$/, messages.opportunities.validation.expectedCloseInvalid),
    ]),
    notes: z.string().trim().max(2000, messages.opportunities.validation.notesMax),
    ownerUserId: z.union([z.literal(''), z.uuid(messages.opportunities.validation.ownerInvalid)]),
    title: z
      .string()
      .trim()
      .min(2, messages.opportunities.validation.titleMin)
      .max(160, messages.opportunities.validation.titleMax),
  };

  return z.object({
    ...opportunitySharedShape,
    clientId: z.uuid(messages.opportunities.validation.clientInvalid),
    stage: z.enum(opportunityStages),
  });
}

export function updateOpportunitySchema(messages: AppMessages) {
  const opportunitySharedShape = {
    estimatedValue: z
      .string()
      .trim()
      .regex(/^\d+(\.\d{1,2})?$/, messages.opportunities.validation.estimatedValueInvalid),
    expectedCloseDate: z.union([
      z.literal(''),
      z.string().regex(/^\d{4}-\d{2}-\d{2}$/, messages.opportunities.validation.expectedCloseInvalid),
    ]),
    notes: z.string().trim().max(2000, messages.opportunities.validation.notesMax),
    ownerUserId: z.union([z.literal(''), z.uuid(messages.opportunities.validation.ownerInvalid)]),
    title: z
      .string()
      .trim()
      .min(2, messages.opportunities.validation.titleMin)
      .max(160, messages.opportunities.validation.titleMax),
  };

  return z.object({
    ...opportunitySharedShape,
    clientId: z.string(),
    stage: z.enum(opportunityStages),
  });
}
