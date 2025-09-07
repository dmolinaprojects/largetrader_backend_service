import { z } from 'zod';

export const DateTimeFilterBaseValidator = z.object({
  equals: z.date().optional(),
  in: z.date().array().optional(),
  notIn: z.date().array().optional(),
  lt: z.date().optional(),
  lte: z.date().optional(),
  gt: z.date().optional(),
  gte: z.date().optional(),
});

export const DateTimeFilterValidator = z
  .object({
    not: DateTimeFilterBaseValidator.optional(),
  })
  .merge(DateTimeFilterBaseValidator);
