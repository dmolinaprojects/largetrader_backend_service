import {
  ITransactionRepository,
  ICreateOneRepository,
  ICreateManyRepository,
  IUpdateOneRepository,
  IDeleteOneRepository,
  IUpsertOneRepository,
  IFindOneRepository,
  IFindManyRepository,
  ICountManyRepository,
} from '@app/core';
import { MarketSplitUsa } from '../../models/stocks/market-split-usa.model';

export interface MarketSplitUsaRepository
  extends ITransactionRepository,
    ICreateOneRepository<MarketSplitUsa>,
    ICreateManyRepository<MarketSplitUsa>,
    IUpdateOneRepository<
      Pick<MarketSplitUsa, 'Id'> | Pick<MarketSplitUsa, 'Code'>,
      MarketSplitUsa
    >,
    IDeleteOneRepository<
      Pick<MarketSplitUsa, 'Id'> | Pick<MarketSplitUsa, 'Code'>,
      MarketSplitUsa
    >,
    IUpsertOneRepository<
      Pick<MarketSplitUsa, 'Id'> | Pick<MarketSplitUsa, 'Code'>,
      MarketSplitUsa
    >,
    IFindOneRepository<MarketSplitUsa, MarketSplitUsa>,
    IFindManyRepository<MarketSplitUsa, MarketSplitUsa>,
    ICountManyRepository<MarketSplitUsa> {
  count(filters: MarketSplitUsa): Promise<number>;
  findByCode(code: string): Promise<MarketSplitUsa[]>;
}
