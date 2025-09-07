import { z } from 'zod';
import {
  PAGINATION_INPUT_DEFAULT,
  TPaginationDto,
  TPaginationInput,
} from '../../domain';

export class PaginationDto implements TPaginationDto {
  skip: number;
  take: number;

  constructor({ page, elementsByPage }: Required<TPaginationInput>) {
    this.skip = elementsByPage * (page - 1);
    this.take = elementsByPage;
  }
}

export const PaginationDtoSchema = z
  .object({
    page: z.number().int().positive().default(PAGINATION_INPUT_DEFAULT.page),
    elementsByPage: z
      .number()
      .int()
      .positive()
      .max(100)
      .default(PAGINATION_INPUT_DEFAULT.elementsByPage),
  })
  .transform(
    ({ page, elementsByPage }) => new PaginationDto({ page, elementsByPage }),
  );
