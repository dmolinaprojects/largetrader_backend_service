import { IFindManyRepository, IFindOneRepository, ICreateOneRepository, IUpdateOneRepository, IDeleteOneRepository } from '@app/core';
import { UserSettings } from '../../models/users/user-settings.model';

export interface UserSettingsFilters {
  Id?: number;
  IdUser?: number;
  Name?: string;
}

export interface UserSettingsRepository 
  extends IFindManyRepository<UserSettingsFilters, UserSettings>,
          IFindOneRepository<UserSettingsFilters, UserSettings>,
          ICreateOneRepository<UserSettings>,
          IUpdateOneRepository<UserSettingsFilters, UserSettings>,
          IDeleteOneRepository<UserSettingsFilters, UserSettings> {
  
  findByUserId(userId: number): Promise<UserSettings[]>;
  findByUserIdAndName(userId: number, name: string): Promise<UserSettings | null>;
  updateUserSetting(userId: number, name: string, value: string): Promise<UserSettings>;
  deleteUserSettings(userId: number): Promise<void>;
}
