import { TFindManyWhere } from '../types';
import { TTransactionArgs } from './transaction.repository';

export type TDeleteManyArgs<TWhere> = {
  where: TFindManyWhere<TWhere>;
};

export interface IDeleteManyRepository<TWhere> {
  deleteMany(
    args: TDeleteManyArgs<TWhere>,
    tx?: TTransactionArgs,
  ): Promise<void>;
}
