import { z } from 'zod';
import { TIntFilterRequest } from '../../domain';

const IntFilterBaseSchema = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
});

export const IntFilterSchema = z
  .object({
    not: IntFilterBaseSchema.optional(),
  })
  .merge(IntFilterBaseSchema);

export class IntFilterDto implements TIntFilterRequest {
  equals?: number;

  in?: number[];

  notIn?: number[];

  lt?: number;

  lte?: number;

  gt?: number;

  gte?: number;

  not?: Omit<TIntFilterRequest, 'not'>;
}
