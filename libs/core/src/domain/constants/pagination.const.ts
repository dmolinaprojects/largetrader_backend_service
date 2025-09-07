import { TPaginationInput } from '../types';

export const PAGINATION_INPUT_DEFAULT = {
  page: 1,
  elementsByPage: 10,
} satisfies Required<TPaginationInput>;
