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
import { MarketTickers } from '../../models/stocks/market-tickers.model';

export interface MarketTickersRepository
  extends ITransactionRepository,
    ICreateOneRepository<MarketTickers>,
    ICreateManyRepository<MarketTickers>,
    IUpdateOneRepository<
      | Pick<MarketTickers, 'Id'>
      | Pick<MarketTickers, 'Code'>,
      MarketTickers
    >,
    IDeleteOneRepository<
      | Pick<MarketTickers, 'Id'>
      | Pick<MarketTickers, 'Code'>,
      MarketTickers
    >,
    IUpsertOneRepository<
      | Pick<MarketTickers, 'Id'>
      | Pick<MarketTickers, 'Code'>,
      MarketTickers
    >,
    IFindOneRepository<MarketTickers, MarketTickers>,
    IFindManyRepository<MarketTickers, MarketTickers>,
    ICountManyRepository<MarketTickers> {
  // Métodos específicos del dominio
  findByCode(code: string): Promise<MarketTickers | null>;
  findBySymbol(symbol: string): Promise<MarketTickers | null>;
  findByType(type: string): Promise<MarketTickers[]>;
  findByExchange(exchange: string): Promise<MarketTickers[]>;
  findByCountry(country: string): Promise<MarketTickers[]>;
  findEnabled(): Promise<MarketTickers[]>;
  searchByCodeOrName(query: string, limit?: number): Promise<MarketTickers[]>;
  updateLastUpdate(
    code: string,
    timeframe: 'H1' | 'D1' | 'W1',
    date: Date,
  ): Promise<MarketTickers>;
}
