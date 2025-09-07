import { z } from 'zod';
import { TEnumFilterRequest } from '../../domain';

const enumFilterBaseSchemaFactory = (values: [string, ...string[]]) =>
  z.object({
    equals: z.enum(values).optional(),
    in: z.enum(values).array().optional(),
    notIn: z.enum(values).array().optional(),
  });

export const enumFilterSchemaFactory = (values: [string, ...string[]]) =>
  z
    .object({
      not: enumFilterBaseSchemaFactory(values).optional(),
    })
    .merge(enumFilterBaseSchemaFactory(values));

export class EnumFilterDto<T> implements TEnumFilterRequest<T> {
  equals?: T;

  in?: T[];

  notIn?: T[];

  not?: Omit<TEnumFilterRequest<T>, 'not'>;
}
