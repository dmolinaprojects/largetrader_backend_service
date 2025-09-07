import { TFindManyWhere, TSelect, TSortType } from '../types';
import { TTransactionArgs } from './transaction.repository';

export type TFindManyArgsWhere<TWhere> = {
  AND?: TFindManyWhere<TWhere>[];
  OR?: TFindManyWhere<TWhere>[];
  NOT?: TFindManyWhere<TWhere>[];
} & TFindManyWhere<TWhere>;

export type TFindManyArgs<TWhere, TSelectFields> = {
  where?: TFindManyArgsWhere<TWhere>;
  select?: TSelect<TSelectFields>;
  orderBy?: TSortType<TSelectFields>;
  take?: number;
  skip?: number;
};

export interface IFindManyRepository<TWhere, TSelectFields> {
  findMany(
    args?: TFindManyArgs<TWhere, TSelectFields>,
    tx?: TTransactionArgs,
  ): Promise<TSelectFields[]>;
}
