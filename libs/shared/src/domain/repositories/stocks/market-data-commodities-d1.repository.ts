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
import { MarketDataCommoditiesD1 } from '../../models/stocks/market-data-commodities-d1.model';

export interface MarketDataCommoditiesD1Repository
  extends ITransactionRepository,
    ICreateOneRepository<MarketDataCommoditiesD1>,
    ICreateManyRepository<MarketDataCommoditiesD1>,
    IUpdateOneRepository<
      | Pick<MarketDataCommoditiesD1, 'id'>
      | Pick<MarketDataCommoditiesD1, 'symbol'>
      | Pick<MarketDataCommoditiesD1, 'quotedate'>,
      MarketDataCommoditiesD1
    >,
    IDeleteOneRepository<
      | Pick<MarketDataCommoditiesD1, 'id'>
      | Pick<MarketDataCommoditiesD1, 'symbol'>
      | Pick<MarketDataCommoditiesD1, 'quotedate'>,
      MarketDataCommoditiesD1
    >,
    IUpsertOneRepository<
      | Pick<MarketDataCommoditiesD1, 'id'>
      | Pick<MarketDataCommoditiesD1, 'symbol'>
      | Pick<MarketDataCommoditiesD1, 'quotedate'>,
      MarketDataCommoditiesD1
    >,
    IFindOneRepository<MarketDataCommoditiesD1, MarketDataCommoditiesD1>,
    IFindManyRepository<MarketDataCommoditiesD1, MarketDataCommoditiesD1>,
    ICountManyRepository<MarketDataCommoditiesD1> {
  findBySymbolAndDateRange(symbol: string, from: Date, to: Date): Promise<MarketDataCommoditiesD1[]>;
  findBySymbol(symbol: string): Promise<MarketDataCommoditiesD1[]>;
  findLatestBySymbol(symbol: string): Promise<MarketDataCommoditiesD1 | null>;
  getDataLimits(symbol: string): Promise<{ earliestDate: number; latestDate: number; totalDataPoints: number }>;
}
