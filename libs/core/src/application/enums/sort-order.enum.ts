// import { registerEnumType } from '@nestjs/graphql';
import { z } from 'zod';

export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
}

// registerEnumType(SortOrder, {
//   name: 'SortOrder',
// });

export const SortOrderValidator = z.nativeEnum(SortOrder);
