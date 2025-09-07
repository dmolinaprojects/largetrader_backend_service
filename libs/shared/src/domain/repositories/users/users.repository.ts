import { IFindManyRepository, IFindOneRepository, ICreateOneRepository, IUpdateOneRepository, IDeleteOneRepository } from '@app/core';
import { Users } from '../../models/users/users.model';

export interface UsersFilters {
  Id?: number;
  Email?: string;
  Name?: string;
  NickName?: string;
  Company?: string;
  Country?: number;
  City?: string;
  Admin?: boolean;
  Publisher?: boolean;
  Language?: string;
  ActiveCampaign?: boolean;
  Bitrix?: boolean;
  DateFrom?: Date;
  DateTo?: Date;
}

export interface UsersRepository 
  extends IFindManyRepository<UsersFilters, Users>,
          IFindOneRepository<UsersFilters, Users>,
          ICreateOneRepository<Users>,
          IUpdateOneRepository<UsersFilters, Users>,
          IDeleteOneRepository<UsersFilters, Users> {
  
  findByEmail(email: string): Promise<Users | null>;
  findByGoogleId(googleId: string): Promise<Users | null>;
  findByFacebookId(facebookId: string): Promise<Users | null>;
  findByToken(token: string): Promise<Users | null>;
  findByTokenApp(tokenApp: string): Promise<Users | null>;
  findAdmins(): Promise<Users[]>;
  findPublishers(): Promise<Users[]>;
  findByCountry(countryId: number): Promise<Users[]>;
  findByLanguage(language: string): Promise<Users[]>;
  findByActiveCampaign(): Promise<Users[]>;
  findByBitrix(): Promise<Users[]>;
  findRecentUsers(days: number): Promise<Users[]>;
  findUsersByDateRange(startDate: Date, endDate: Date): Promise<Users[]>;
}
