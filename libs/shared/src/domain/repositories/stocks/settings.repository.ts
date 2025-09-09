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
import { Settings } from '../../models/stocks/settings.model';

export interface SettingsRepository
  extends ITransactionRepository,
    ICreateOneRepository<Settings>,
    ICreateManyRepository<Settings>,
    IUpdateOneRepository<
      | Pick<Settings, 'id'>
      | Pick<Settings, 'name'>,
      Settings
    >,
    IDeleteOneRepository<
      | Pick<Settings, 'id'>
      | Pick<Settings, 'name'>,
      Settings
    >,
    IUpsertOneRepository<
      | Pick<Settings, 'id'>
      | Pick<Settings, 'name'>,
      Settings
    >,
    IFindOneRepository<Settings, Settings>,
    IFindManyRepository<Settings, Settings>,
    ICountManyRepository<Settings> {
  // Métodos específicos del dominio
  findByName(name: string): Promise<Settings | null>;
  findByNamePattern(pattern: string): Promise<Settings[]>;
  updateByName(name: string, value: string): Promise<Settings>;
  upsertByName(name: string, value: string): Promise<Settings>;
}
