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
import { StockInfoEarnings } from '../../models/stocks/stock-info-earnings.model';

export interface StockInfoEarningsRepository
  extends ITransactionRepository,
    ICreateOneRepository<StockInfoEarnings>,
    ICreateManyRepository<StockInfoEarnings>,
    IUpdateOneRepository<
      Pick<StockInfoEarnings, 'Id'> | Pick<StockInfoEarnings, 'IdStock'>,
      StockInfoEarnings
    >,
    IDeleteOneRepository<
      Pick<StockInfoEarnings, 'Id'> | Pick<StockInfoEarnings, 'IdStock'>,
      StockInfoEarnings
    >,
    IUpsertOneRepository<
      Pick<StockInfoEarnings, 'Id'> | Pick<StockInfoEarnings, 'IdStock'>,
      StockInfoEarnings
    >,
    IFindOneRepository<StockInfoEarnings, StockInfoEarnings>,
    IFindManyRepository<StockInfoEarnings, StockInfoEarnings>,
    ICountManyRepository<StockInfoEarnings> {
  findByStockId(stockId: number): Promise<StockInfoEarnings[]>;
  findRecentEarnings(days: number): Promise<StockInfoEarnings[]>;
  findPositiveSurprises(): Promise<StockInfoEarnings[]>;
  findNegativeSurprises(): Promise<StockInfoEarnings[]>;
  findByDateRange(startDate: Date, endDate: Date): Promise<StockInfoEarnings[]>;
}
