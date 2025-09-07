import { z } from 'zod';

export const IntFilterBaseValidator = z.object({
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
});

export const IntFilterValidator = z
  .object({
    not: IntFilterBaseValidator.optional(),
  })
  .merge(IntFilterBaseValidator);
