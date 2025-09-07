import { z } from 'zod';

export const StringFilterBaseValidator = z.object({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
});

export const StringFilterValidator = z
  .object({
    not: StringFilterBaseValidator.optional(),
  })
  .merge(StringFilterBaseValidator);
