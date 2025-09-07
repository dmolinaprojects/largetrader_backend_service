import { z } from 'zod';

export const FloatFilterBaseValidator = z.object({
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
});

export const FloatFilterValidator = z
  .object({
    not: FloatFilterBaseValidator.optional(),
  })
  .merge(FloatFilterBaseValidator);
