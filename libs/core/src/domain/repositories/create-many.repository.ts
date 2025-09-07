import { TTransactionArgs } from './transaction.repository';

export type TCreateManyArgs<TData> = {
  data: TData[];
};

export interface ICreateManyRepository<TData> {
  createMany(
    args: TCreateManyArgs<TData>,
    tx?: TTransactionArgs,
  ): Promise<void>;
}
