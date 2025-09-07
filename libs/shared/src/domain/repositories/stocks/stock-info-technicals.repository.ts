import { IFindManyRepository, IFindOneRepository, ICreateOneRepository, IUpdateOneRepository, IDeleteOneRepository } from '@app/core';
import { StockInfoTechnicals } from '../../models/stocks/stock-info-technicals.model';

export interface StockInfoTechnicalsFilters {
  Id?: number;
  IdStock?: number;
  PeRatioMin?: number;
  PeRatioMax?: number;
  PegRatioMin?: number;
  PegRatioMax?: number;
  DividendYieldMin?: number;
  DividendYieldMax?: number;
  ProfitMarginMin?: number;
  ProfitMarginMax?: number;
}

export interface StockInfoTechnicalsRepository 
  extends IFindManyRepository<StockInfoTechnicalsFilters, StockInfoTechnicals>,
          IFindOneRepository<StockInfoTechnicalsFilters, StockInfoTechnicals>,
          ICreateOneRepository<StockInfoTechnicals>,
          IUpdateOneRepository<StockInfoTechnicalsFilters, StockInfoTechnicals>,
          IDeleteOneRepository<StockInfoTechnicalsFilters, StockInfoTechnicals> {
  
  findByStockId(stockId: number): Promise<StockInfoTechnicals | null>;
  findHighPERatioStocks(minPeRatio: number): Promise<StockInfoTechnicals[]>;
  findHighDividendStocks(minDividendYield: number): Promise<StockInfoTechnicals[]>;
  findProfitableStocks(minProfitMargin: number): Promise<StockInfoTechnicals[]>;
}
