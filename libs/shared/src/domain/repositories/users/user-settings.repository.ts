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
import { UserSettings } from '../../models/users/user-settings.model';

export interface UserSettingsRepository
  extends ITransactionRepository,
    ICreateOneRepository<UserSettings>,
    ICreateManyRepository<UserSettings>,
    IUpdateOneRepository<
      | Pick<UserSettings, 'Id'>
      | Pick<UserSettings, 'IdUser'>,
      UserSettings
    >,
    IDeleteOneRepository<
      | Pick<UserSettings, 'Id'>
      | Pick<UserSettings, 'IdUser'>,
      UserSettings
    >,
    IUpsertOneRepository<
      | Pick<UserSettings, 'Id'>
      | Pick<UserSettings, 'IdUser'>,
      UserSettings
    >,
    IFindOneRepository<UserSettings, UserSettings>,
    IFindManyRepository<UserSettings, UserSettings>,
    ICountManyRepository<UserSettings> {
  findByUserId(userId: number): Promise<UserSettings[]>;
  findByUserIdAndName(
    userId: number,
    name: string,
  ): Promise<UserSettings | null>;
  updateUserSetting(
    userId: number,
    name: string,
    value: string,
  ): Promise<UserSettings>;
  deleteUserSettings(userId: number): Promise<void>;
}
