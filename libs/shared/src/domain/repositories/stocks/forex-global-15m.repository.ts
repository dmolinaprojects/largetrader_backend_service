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
  import { ForexGlobal15m } from '../../models/stocks/forex-global-15m.model';
  
  export interface ForexGlobal15mRepository
    extends ITransactionRepository,
      ICreateOneRepository<ForexGlobal15m>,
      ICreateManyRepository<ForexGlobal15m>,
      IUpdateOneRepository<
        | Pick<ForexGlobal15m, 'id'>
        | Pick<ForexGlobal15m, 'symbol'>,
        ForexGlobal15m
      >,
      IDeleteOneRepository<
        | Pick<ForexGlobal15m, 'id'>
        | Pick<ForexGlobal15m, 'symbol'>,
        ForexGlobal15m
      >,
      IUpsertOneRepository<
        | Pick<ForexGlobal15m, 'id'>
        | Pick<ForexGlobal15m, 'symbol'>,
        ForexGlobal15m
      >,
      IFindOneRepository<ForexGlobal15m, ForexGlobal15m>,
      IFindManyRepository<ForexGlobal15m, ForexGlobal15m>,
      ICountManyRepository<ForexGlobal15m> {
    // Métodos específicos del dominio
    findBySymbol(symbol: string): Promise<ForexGlobal15m[]>;
    findBySymbolAndDateRange(symbol: string, from: Date, to: Date): Promise<ForexGlobal15m[]>;
    findLatestBySymbol(symbol: string): Promise<ForexGlobal15m | null>;
    findByDateRange(from: Date, to: Date): Promise<ForexGlobal15m[]>;
  }