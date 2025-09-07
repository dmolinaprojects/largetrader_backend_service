import { z } from 'zod';
import { TDateTimeFilterRequest } from '../../domain';

const DateTimeFilterBaseSchema = z.object({
  equals: z.date().optional(),
  in: z.date().array().optional(),
  notIn: z.date().array().optional(),
  lt: z.date().optional(),
  lte: z.date().optional(),
  gt: z.date().optional(),
  gte: z.date().optional(),
});

export const DateTimeFilterSchema = z
  .object({
    not: DateTimeFilterBaseSchema.optional(),
  })
  .merge(DateTimeFilterBaseSchema);

export class DateTimeFilterDto implements TDateTimeFilterRequest {
  equals?: Date;

  in?: Date[];

  notIn?: Date[];

  lt?: Date;

  lte?: Date;

  gt?: Date;

  gte?: Date;

  not?: Omit<DateTimeFilterDto, 'not'>;
}
