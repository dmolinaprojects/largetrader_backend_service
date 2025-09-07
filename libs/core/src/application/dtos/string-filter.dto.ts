import { z } from 'zod';
import { TStringFilterRequest } from '../../domain';

const StringFilterBaseSchema = z.object({
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

export const StringFilterSchema = z
  .object({
    not: StringFilterBaseSchema.optional(),
  })
  .merge(StringFilterBaseSchema);

export class StringFilterDto implements TStringFilterRequest {
  equals?: string;

  in?: string[];

  notIn?: string[];

  lt?: string;

  lte?: string;

  gt?: string;

  gte?: string;

  contains?: string;

  startsWith?: string;

  endsWith?: string;

  not?: Omit<TStringFilterRequest, 'not'>;
}
