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
import { ForexGlobalH1 } from '../../models/stocks/forex-global-h1.model';

export interface ForexGlobalH1Repository
  extends ITransactionRepository,
    ICreateOneRepository<ForexGlobalH1>,
    ICreateManyRepository<ForexGlobalH1>,
    IUpdateOneRepository<
      | Pick<ForexGlobalH1, 'id'>
      | Pick<ForexGlobalH1, 'symbol'>,
      ForexGlobalH1
    >,
    IDeleteOneRepository<
      | Pick<ForexGlobalH1, 'id'>
      | Pick<ForexGlobalH1, 'symbol'>,
      ForexGlobalH1
    >,
    IUpsertOneRepository<
      | Pick<ForexGlobalH1, 'id'>
      | Pick<ForexGlobalH1, 'symbol'>,
      ForexGlobalH1
    >,
    IFindOneRepository<ForexGlobalH1, ForexGlobalH1>,
    IFindManyRepository<ForexGlobalH1, ForexGlobalH1>,
    ICountManyRepository<ForexGlobalH1> {
  // Métodos específicos del dominio
  findBySymbol(symbol: string): Promise<ForexGlobalH1[]>;
  findBySymbolAndDateRange(symbol: string, from: Date, to: Date): Promise<ForexGlobalH1[]>;
  findLatestBySymbol(symbol: string): Promise<ForexGlobalH1 | null>;
  findByDateRange(from: Date, to: Date): Promise<ForexGlobalH1[]>;
}
