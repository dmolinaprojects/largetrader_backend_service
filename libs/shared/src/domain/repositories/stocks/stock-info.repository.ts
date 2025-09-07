import { IFindManyRepository, IFindOneRepository, ICreateOneRepository, IUpdateOneRepository, IDeleteOneRepository } from '@app/core';
import { StockInfo } from '../../models/stocks/stock-info.model';

export interface StockInfoFilters {
  Id?: number;
  Ticker?: string;
  Name?: string;
  Country?: string;
  Exchange?: string;
  Currency?: string;
  Type?: string;
  Sector?: string;
  Industry?: string;
  IsDelisted?: boolean;
}

export interface StockInfoRepository 
  extends IFindManyRepository<StockInfoFilters, StockInfo>,
          IFindOneRepository<StockInfoFilters, StockInfo>,
          ICreateOneRepository<StockInfo>,
          IUpdateOneRepository<StockInfoFilters, StockInfo>,
          IDeleteOneRepository<StockInfoFilters, StockInfo> {
  
  findByTicker(ticker: string): Promise<StockInfo | null>;
  findByExchange(exchange: string): Promise<StockInfo[]>;
  findBySector(sector: string): Promise<StockInfo[]>;
  findByIndustry(industry: string): Promise<StockInfo[]>;
  findActiveStocks(): Promise<StockInfo[]>;
}
