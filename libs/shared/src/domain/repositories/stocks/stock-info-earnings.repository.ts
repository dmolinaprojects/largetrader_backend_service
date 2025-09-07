import { IFindManyRepository, IFindOneRepository, ICreateOneRepository, IUpdateOneRepository, IDeleteOneRepository } from '@app/core';
import { StockInfoEarnings } from '../../models/stocks/stock-info-earnings.model';

export interface StockInfoEarningsFilters {
  Id?: number;
  IdStock?: number;
  DateFrom?: Date;
  DateTo?: Date;
  Currency?: string;
  EpsActualMin?: number;
  EpsActualMax?: number;
  SurpricePercentMin?: number;
  SurpricePercentMax?: number;
}

export interface StockInfoEarningsRepository 
  extends IFindManyRepository<StockInfoEarningsFilters, StockInfoEarnings>,
          IFindOneRepository<StockInfoEarningsFilters, StockInfoEarnings>,
          ICreateOneRepository<StockInfoEarnings>,
          IUpdateOneRepository<StockInfoEarningsFilters, StockInfoEarnings>,
          IDeleteOneRepository<StockInfoEarningsFilters, StockInfoEarnings> {
  
  findByStockId(stockId: number): Promise<StockInfoEarnings[]>;
  findRecentEarnings(days: number): Promise<StockInfoEarnings[]>;
  findPositiveSurprises(): Promise<StockInfoEarnings[]>;
  findNegativeSurprises(): Promise<StockInfoEarnings[]>;
  findByDateRange(startDate: Date, endDate: Date): Promise<StockInfoEarnings[]>;
}
