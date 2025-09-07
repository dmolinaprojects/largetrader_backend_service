import { TSelect } from '../types';
import { TTransactionArgs } from './transaction.repository';

export type TFindOneArgs<TWhere, TSelectFields> = {
  where: Partial<TWhere>;
  select?: TSelect<TSelectFields>;
  include?: Record<string, boolean | object>;
  rejectOnNotFound?: boolean | ((error: Error) => Error);
};

export interface IFindOneRepository<TWhere, TSelectFields> {
  findOne(
    args: TFindOneArgs<TWhere, TSelectFields>,
    tx?: TTransactionArgs,
  ): Promise<TSelectFields | null>;
}
