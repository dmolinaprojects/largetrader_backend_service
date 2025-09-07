import { TFindManyWhere } from '../types';
import { TTransactionArgs } from './transaction.repository';

export type TCountManyArgs<TWhere> = {
  where?: TFindManyWhere<TWhere>;
};

export interface ICountManyRepository<TWhere> {
  countMany(
    args?: TCountManyArgs<TWhere>,
    tx?: TTransactionArgs,
  ): Promise<number>;
}
