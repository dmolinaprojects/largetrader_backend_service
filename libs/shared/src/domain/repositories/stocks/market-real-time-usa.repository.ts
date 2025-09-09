import {
  ITransactionRepository,
  IFindManyRepository,
  IFindOneRepository,
  ICreateOneRepository,
  ICreateManyRepository,
  IUpdateOneRepository,
  IDeleteOneRepository,
  IUpsertOneRepository,
  ICountManyRepository,
} from '@app/core';
import { MarketRealTimeUsa } from '../../models/stocks/market-real-time-usa.model';

export interface MarketRealTimeUsaRepository
  extends ITransactionRepository,
    ICreateOneRepository<MarketRealTimeUsa>,
    ICreateManyRepository<MarketRealTimeUsa>,
    IUpdateOneRepository<
      | Pick<MarketRealTimeUsa, 'Id'>
      | Pick<MarketRealTimeUsa, 'Ticker'>,
      MarketRealTimeUsa
    >,
    IDeleteOneRepository<
      | Pick<MarketRealTimeUsa, 'Id'>
      | Pick<MarketRealTimeUsa, 'Ticker'>,
      MarketRealTimeUsa
    >,
    IUpsertOneRepository<
      | Pick<MarketRealTimeUsa, 'Id'>
      | Pick<MarketRealTimeUsa, 'Ticker'>,
      MarketRealTimeUsa
    >,
    IFindOneRepository<MarketRealTimeUsa, MarketRealTimeUsa>,
    IFindManyRepository<MarketRealTimeUsa, MarketRealTimeUsa>,
    ICountManyRepository<MarketRealTimeUsa> {
  // Métodos específicos del dominio
  findByTicker(ticker: string): Promise<MarketRealTimeUsa | null>;
  findByType(type: string): Promise<MarketRealTimeUsa[]>;
  findLatestByTicker(ticker: string): Promise<MarketRealTimeUsa | null>;
  updateByTicker(ticker: string, data: Partial<MarketRealTimeUsa>): Promise<MarketRealTimeUsa>;
}
