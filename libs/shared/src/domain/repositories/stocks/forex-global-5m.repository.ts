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
import { ForexGlobal5m } from '../../models/stocks/forex-global-5m.model';

export interface ForexGlobal5mRepository
  extends ITransactionRepository,
    ICreateOneRepository<ForexGlobal5m>,
    ICreateManyRepository<ForexGlobal5m>,
    IUpdateOneRepository<
      | Pick<ForexGlobal5m, 'id'>
      | Pick<ForexGlobal5m, 'symbol'>,
      ForexGlobal5m
    >,
    IDeleteOneRepository<
      | Pick<ForexGlobal5m, 'id'>
      | Pick<ForexGlobal5m, 'symbol'>,
      ForexGlobal5m
    >,
    IUpsertOneRepository<
      | Pick<ForexGlobal5m, 'id'>
      | Pick<ForexGlobal5m, 'symbol'>,
      ForexGlobal5m
    >,
    IFindOneRepository<ForexGlobal5m, ForexGlobal5m>,
    IFindManyRepository<ForexGlobal5m, ForexGlobal5m>,
    ICountManyRepository<ForexGlobal5m> {
  // Métodos específicos del dominio
  findBySymbol(symbol: string): Promise<ForexGlobal5m[]>;
  findBySymbolAndDateRange(symbol: string, from: Date, to: Date): Promise<ForexGlobal5m[]>;
  findLatestBySymbol(symbol: string): Promise<ForexGlobal5m | null>;
  findByDateRange(from: Date, to: Date): Promise<ForexGlobal5m[]>;
}
