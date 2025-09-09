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
import { MarketDataIndexesD1 } from '../../models/stocks/market-data-indexes-d1.model';

export interface MarketDataIndexesD1Repository
  extends ITransactionRepository,
    ICreateOneRepository<MarketDataIndexesD1>,
    ICreateManyRepository<MarketDataIndexesD1>,
    IUpdateOneRepository<
      | Pick<MarketDataIndexesD1, 'id'>
      | Pick<MarketDataIndexesD1, 'symbol'>
      | Pick<MarketDataIndexesD1, 'quotedate'>,
      MarketDataIndexesD1
    >,
    IDeleteOneRepository<
      | Pick<MarketDataIndexesD1, 'id'>
      | Pick<MarketDataIndexesD1, 'symbol'>
      | Pick<MarketDataIndexesD1, 'quotedate'>,
      MarketDataIndexesD1
    >,
    IUpsertOneRepository<
      | Pick<MarketDataIndexesD1, 'id'>
      | Pick<MarketDataIndexesD1, 'symbol'>
      | Pick<MarketDataIndexesD1, 'quotedate'>,
      MarketDataIndexesD1
    >,
    IFindOneRepository<MarketDataIndexesD1, MarketDataIndexesD1>,
    IFindManyRepository<MarketDataIndexesD1, MarketDataIndexesD1>,
    ICountManyRepository<MarketDataIndexesD1> {
  findBySymbolAndDateRange(symbol: string, from: Date, to: Date): Promise<MarketDataIndexesD1[]>;
  findBySymbol(symbol: string): Promise<MarketDataIndexesD1[]>;
  findLatestBySymbol(symbol: string): Promise<MarketDataIndexesD1 | null>;
  getDataLimits(symbol: string): Promise<{ earliestDate: number; latestDate: number; totalDataPoints: number }>;
}
