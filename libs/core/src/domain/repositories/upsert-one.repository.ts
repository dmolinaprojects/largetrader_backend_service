import { TSelect } from '../types';
import { TTransactionArgs } from './transaction.repository';

export type TUpsertOneArgs<
  TWhere,
  TData,
  TSelectFields extends TData = TData,
> = {
  where: TWhere;
  create: TData;
  update: Partial<TData>;
  select?: TSelect<TSelectFields>;
};

export interface IUpsertOneRepository<
  TWhere,
  TData,
  TSelectFields extends TData = TData,
> {
  upsertOne(
    args: TUpsertOneArgs<TWhere, TData>,
    tx?: TTransactionArgs,
  ): Promise<TSelectFields>;
}
