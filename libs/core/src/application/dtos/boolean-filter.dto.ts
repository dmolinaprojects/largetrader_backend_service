import { z } from 'zod';
import { TBooleanFilterRequest } from '../../domain';

const BooleanFilterBaseSchema = z.object({
  equals: z.boolean().optional(),
});

export const BooleanFilterSchema = z
  .object({
    not: BooleanFilterBaseSchema.optional(),
  })
  .merge(BooleanFilterBaseSchema);

export class BooleanFilterDto implements TBooleanFilterRequest {
  equals?: boolean;
  not?: Omit<TBooleanFilterRequest, 'not'>;
}
