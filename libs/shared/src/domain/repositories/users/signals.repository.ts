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
import { Signals } from '../../models/users/signals.model';


export interface SignalsRepository
  extends ITransactionRepository,
    ICreateOneRepository<Signals>,
    ICreateManyRepository<Signals>,
    IUpdateOneRepository<
      Pick<Signals, 'Id'> | Pick<Signals, 'IdGroup'>,
      Signals
    >,
    IDeleteOneRepository<
      Pick<Signals, 'Id'> | Pick<Signals, 'IdGroup'>,
      Signals
    >,
    IUpsertOneRepository<
      Pick<Signals, 'Id'> | Pick<Signals, 'IdGroup'>,
      Signals
    >,
    IFindOneRepository<Signals, Signals>,
    IFindManyRepository<Signals, Signals>,
    ICountManyRepository<Signals> {
  findByGroup(groupId: number): Promise<Signals[]>;
  findByTicker(ticker: string): Promise<Signals[]>;
  findByOrderType(orderType: string): Promise<Signals[]>;
  findByDateRange(startDate: Date, endDate: Date): Promise<Signals[]>;
  findByPriceRange(minPrice: number, maxPrice: number): Promise<Signals[]>;
  findRecentSignals(days: number): Promise<Signals[]>;
  findSignalsByGroupAndTicker(
    groupId: number,
    ticker: string,
  ): Promise<Signals[]>;
  findSignalsByGroupAndDateRange(
    groupId: number,
    startDate: Date,
    endDate: Date,
  ): Promise<Signals[]>;
  countSignalsByGroup(groupId: number): Promise<number>;
  countSignalsByTicker(ticker: string): Promise<number>;
}
