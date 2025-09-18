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
import { RealTimeData } from '../../models/stocks/real-time-data.model';

export interface RealTimeDataRepository
  extends ITransactionRepository,
    ICreateOneRepository<RealTimeData>,
    ICreateManyRepository<RealTimeData>,
    IUpdateOneRepository<Pick<RealTimeData, 'id'>, RealTimeData>,
    IDeleteOneRepository<Pick<RealTimeData, 'id'>, RealTimeData>,
    IUpsertOneRepository<Pick<RealTimeData, 'id'>, RealTimeData>,
    IFindOneRepository<RealTimeData, RealTimeData>,
    IFindManyRepository<RealTimeData, RealTimeData>,
    ICountManyRepository<RealTimeData> {
  
  // Métodos específicos del dominio para datos en tiempo real
  findByTicker(ticker: string): Promise<RealTimeData[]>;
  findByTickers(tickers: string[]): Promise<RealTimeData[]>;
  findLatestByTicker(ticker: string): Promise<RealTimeData | null>;
  findLatestData(limit?: number): Promise<RealTimeData[]>;
  findTickersWithBidAskSpread(minSpread?: number): Promise<RealTimeData[]>;
  deleteByTicker(ticker: string): Promise<number>; // Retorna cantidad eliminada
  bulkInsert(data: Array<Omit<RealTimeData, 'id'>>): Promise<void>;
}
