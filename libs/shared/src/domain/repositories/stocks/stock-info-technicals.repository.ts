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
import { StockInfoTechnicals } from '../../models/stocks/stock-info-technicals.model';

export interface StockInfoTechnicalsRepository
  extends ITransactionRepository,
    ICreateOneRepository<StockInfoTechnicals>,
    ICreateManyRepository<StockInfoTechnicals>,
    IUpdateOneRepository<
      Pick<StockInfoTechnicals, 'Id'> | Pick<StockInfoTechnicals, 'IdStock'>,
      StockInfoTechnicals
    >,
    IDeleteOneRepository<
      Pick<StockInfoTechnicals, 'Id'> | Pick<StockInfoTechnicals, 'IdStock'>,
      StockInfoTechnicals
    >,
    IUpsertOneRepository<
      Pick<StockInfoTechnicals, 'Id'> | Pick<StockInfoTechnicals, 'IdStock'>,
      StockInfoTechnicals
    >,
    IFindOneRepository<StockInfoTechnicals, StockInfoTechnicals>,
    IFindManyRepository<StockInfoTechnicals, StockInfoTechnicals>,
    ICountManyRepository<StockInfoTechnicals> {
  findByStockId(stockId: number): Promise<StockInfoTechnicals | null>;
  findHighPERatioStocks(minPeRatio: number): Promise<StockInfoTechnicals[]>;
  findHighDividendStocks(
    minDividendYield: number,
  ): Promise<StockInfoTechnicals[]>;
  findProfitableStocks(minProfitMargin: number): Promise<StockInfoTechnicals[]>;
}
