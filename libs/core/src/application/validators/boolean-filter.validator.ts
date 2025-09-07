import { z } from 'zod';

export const BooleanFilterBaseValidator = z.object({
  equals: z.boolean().optional(),
});

export const BooleanFilterValidator = z
  .object({
    not: BooleanFilterBaseValidator.optional(),
  })
  .merge(BooleanFilterBaseValidator);
