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
import { LogLastTickers } from '../../models/users/log-last-tickers.model';

export interface LogLastTickersRepository
  extends ITransactionRepository,
    ICreateOneRepository<LogLastTickers>,
    ICreateManyRepository<LogLastTickers>,
    IUpdateOneRepository<Pick<LogLastTickers, 'Id'>, LogLastTickers>,
    IDeleteOneRepository<Pick<LogLastTickers, 'Id'>, LogLastTickers>,
    IUpsertOneRepository<Pick<LogLastTickers, 'Id'>, LogLastTickers>,
    IFindOneRepository<LogLastTickers, LogLastTickers>,
    IFindManyRepository<LogLastTickers, LogLastTickers>,
    ICountManyRepository<LogLastTickers> {

  // Métodos específicos del dominio para LogLastTickers
  findActiveTickers(thresholdDate: Date): Promise<LogLastTickers[]>;
  findByTicker(ticker: string): Promise<LogLastTickers | null>;
  findByDateRange(from: Date, to: Date): Promise<LogLastTickers[]>;
  deleteOldEntries(beforeDate: Date): Promise<number>; // Retorna cantidad eliminada
  upsertTickerActivity(ticker: string, date: Date): Promise<LogLastTickers>;
}
