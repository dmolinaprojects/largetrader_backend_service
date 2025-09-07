import { z } from 'zod';
import { TFloatFilterRequest } from '../../domain';

const FloatFilterBaseSchema = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
});

export const FloatFilterSchema = z
  .object({
    not: FloatFilterBaseSchema.optional(),
  })
  .merge(FloatFilterBaseSchema);

export class FloatFilterDto implements TFloatFilterRequest {
  equals?: number;

  in?: number[];

  notIn?: number[];

  lt?: number;

  lte?: number;

  gt?: number;

  gte?: number;

  not?: Omit<TFloatFilterRequest, 'not'>;
}
