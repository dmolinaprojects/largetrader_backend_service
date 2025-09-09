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
import { MarketDataUsa } from '../../models/stocks/market-data-usa.model';

export interface MarketDataUsaRepository
  extends ITransactionRepository,
    ICreateOneRepository<MarketDataUsa>,
    ICreateManyRepository<MarketDataUsa>,
    IUpdateOneRepository<
      | Pick<MarketDataUsa, 'id'>
      | Pick<MarketDataUsa, 'symbol'>
      | Pick<MarketDataUsa, 'quotedate'>,
      MarketDataUsa
    >,
    IDeleteOneRepository<
      | Pick<MarketDataUsa, 'id'>
      | Pick<MarketDataUsa, 'symbol'>
      | Pick<MarketDataUsa, 'quotedate'>,
      MarketDataUsa
    >,
    IUpsertOneRepository<
      | Pick<MarketDataUsa, 'id'>
      | Pick<MarketDataUsa, 'symbol'>
      | Pick<MarketDataUsa, 'quotedate'>,
      MarketDataUsa
    >,
    IFindOneRepository<MarketDataUsa, MarketDataUsa>,
    IFindManyRepository<MarketDataUsa, MarketDataUsa>,
    ICountManyRepository<MarketDataUsa> {
  findBySymbolAndDateRange(symbol: string, from: Date, to: Date): Promise<MarketDataUsa[]>;
  findBySymbol(symbol: string): Promise<MarketDataUsa[]>;
  findLatestBySymbol(symbol: string): Promise<MarketDataUsa | null>;
  getDataLimits(symbol: string): Promise<{ earliestDate: number; latestDate: number; totalDataPoints: number }>;
}
