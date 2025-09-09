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
import { CryptoGlobalD1 } from '../../models/stocks/crypto-global-d1.model';

export interface CryptoGlobalD1Repository
  extends ITransactionRepository,
    ICreateOneRepository<CryptoGlobalD1>,
    ICreateManyRepository<CryptoGlobalD1>,
    IUpdateOneRepository<
      | Pick<CryptoGlobalD1, 'id'>
      | Pick<CryptoGlobalD1, 'Symbol'>
      | Pick<CryptoGlobalD1, 'OpenTime'>,
      CryptoGlobalD1
    >,
    IDeleteOneRepository<
      | Pick<CryptoGlobalD1, 'id'>
      | Pick<CryptoGlobalD1, 'Symbol'>
      | Pick<CryptoGlobalD1, 'OpenTime'>,
      CryptoGlobalD1
    >,
    IUpsertOneRepository<
      | Pick<CryptoGlobalD1, 'id'>
      | Pick<CryptoGlobalD1, 'Symbol'>
      | Pick<CryptoGlobalD1, 'OpenTime'>,
      CryptoGlobalD1
    >,
    IFindOneRepository<CryptoGlobalD1, CryptoGlobalD1>,
    IFindManyRepository<CryptoGlobalD1, CryptoGlobalD1>,
    ICountManyRepository<CryptoGlobalD1> {
  findBySymbolAndDateRange(symbol: string, from: Date, to: Date): Promise<CryptoGlobalD1[]>;
  findBySymbol(symbol: string): Promise<CryptoGlobalD1[]>;
  findLatestBySymbol(symbol: string): Promise<CryptoGlobalD1 | null>;
  getDataLimits(symbol: string): Promise<{ earliestDate: number; latestDate: number; totalDataPoints: number }>;
}
