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
import { StockInfo } from '../../models/stocks/stock-info.model';

export interface StockInfoRepository
  extends ITransactionRepository,
    ICreateOneRepository<StockInfo>,
    ICreateManyRepository<StockInfo>,
    IUpdateOneRepository<
      Pick<StockInfo, 'Id'> | Pick<StockInfo, 'Ticker'>,
      StockInfo
    >,
    IDeleteOneRepository<
      Pick<StockInfo, 'Id'> | Pick<StockInfo, 'Ticker'>,
      StockInfo
    >,
    IUpsertOneRepository<
      Pick<StockInfo, 'Id'> | Pick<StockInfo, 'Ticker'>,
      StockInfo
    >,
    IFindOneRepository<StockInfo, StockInfo>,
    IFindManyRepository<StockInfo, StockInfo>,
    ICountManyRepository<StockInfo> {
  findByTicker(ticker: string): Promise<StockInfo | null>;
  findByExchange(exchange: string): Promise<StockInfo[]>;
  findBySector(sector: string): Promise<StockInfo[]>;
  findByIndustry(industry: string): Promise<StockInfo[]>;
  findActiveStocks(): Promise<StockInfo[]>;
}
