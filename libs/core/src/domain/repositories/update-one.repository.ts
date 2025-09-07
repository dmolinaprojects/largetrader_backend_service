import { TSelect } from '../types';
import { TTransactionArgs } from './transaction.repository';

export type TUpdateOneArgs<
  TWhere,
  TData,
  TSelectFields extends TData = TData,
> = {
  where: TWhere;
  data: Partial<TData>;
  select?: TSelect<TSelectFields>;
};

export interface IUpdateOneRepository<
  TWhere,
  TData,
  TSelectFields extends TData = TData,
> {
  updateOne(
    args: TUpdateOneArgs<TWhere, TData>,
    tx?: TTransactionArgs,
  ): Promise<TSelectFields>;
}
