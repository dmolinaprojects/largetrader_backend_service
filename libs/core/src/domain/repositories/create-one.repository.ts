import { TSelect } from '../types';
import { TTransactionArgs } from './transaction.repository';

export type TCreateOneArgs<TData, TSelectFields extends TData = TData> = {
  data: TData;
  select?: TSelect<TSelectFields>;
};

export interface ICreateOneRepository<TData> {
  createOne(args: TCreateOneArgs<TData>, tx?: TTransactionArgs): Promise<TData>;
}
