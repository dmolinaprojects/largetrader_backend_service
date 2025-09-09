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
import { Ticker } from '../../models/stocks/ticker.model';

export interface TickersRepository
  extends ITransactionRepository,
    ICreateOneRepository<Ticker>,
    ICreateManyRepository<Ticker>,
    IUpdateOneRepository<Pick<Ticker, 'id'> | Pick<Ticker, 'tiker'>, Ticker>,
    IDeleteOneRepository<Pick<Ticker, 'id'> | Pick<Ticker, 'tiker'>, Ticker>,
    IUpsertOneRepository<Pick<Ticker, 'id'> | Pick<Ticker, 'tiker'>, Ticker>,
    IFindOneRepository<Ticker, Ticker>,
    IFindManyRepository<Ticker, Ticker>,
    ICountManyRepository<Ticker> {
  count(filters: Partial<Ticker>): Promise<number>;
}
