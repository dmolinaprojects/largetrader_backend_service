import { TSelect } from '../types';
import { TTransactionArgs } from './transaction.repository';

export type TDeleteOneArgs<TWhere, TSelectFields> = {
  where: TWhere;
  select?: TSelect<TSelectFields>;
};

export interface IDeleteOneRepository<TWhere, TSelectFields> {
  deleteOne(
    args: TDeleteOneArgs<TWhere, TSelectFields>,
    tx?: TTransactionArgs,
  ): Promise<TSelectFields>;
}
