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
import { ForexGlobalD1 } from '../../models/stocks/forex-global-d1.model';

export interface ForexGlobalD1Repository
  extends ITransactionRepository,
    ICreateOneRepository<ForexGlobalD1>,
    ICreateManyRepository<ForexGlobalD1>,
    IUpdateOneRepository<
      | Pick<ForexGlobalD1, 'id'>
      | Pick<ForexGlobalD1, 'symbol'>,
      ForexGlobalD1
    >,
    IDeleteOneRepository<
      | Pick<ForexGlobalD1, 'id'>
      | Pick<ForexGlobalD1, 'symbol'>,
      ForexGlobalD1
    >,
    IUpsertOneRepository<
      | Pick<ForexGlobalD1, 'id'>
      | Pick<ForexGlobalD1, 'symbol'>,
      ForexGlobalD1
    >,
    IFindOneRepository<ForexGlobalD1, ForexGlobalD1>,
    IFindManyRepository<ForexGlobalD1, ForexGlobalD1>,
    ICountManyRepository<ForexGlobalD1> {
  // Métodos específicos del dominio
  findBySymbol(symbol: string): Promise<ForexGlobalD1[]>;
  findBySymbolAndDateRange(symbol: string, from: Date, to: Date): Promise<ForexGlobalD1[]>;
  findLatestBySymbol(symbol: string): Promise<ForexGlobalD1 | null>;
  findByDateRange(from: Date, to: Date): Promise<ForexGlobalD1[]>;
  getDataLimits(symbol: string): Promise<{ earliestDate: number; latestDate: number; totalDataPoints: number }>;
}