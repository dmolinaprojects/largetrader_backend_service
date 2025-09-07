import { IFindManyRepository, IFindOneRepository, ICreateOneRepository, IUpdateOneRepository, IDeleteOneRepository } from '@app/core';
import { UserStocks } from '../../models/users/user-stocks.model';

export interface UserStocksFilters {
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
}

export interface UserStocksRepository 
  extends IFindManyRepository<UserStocksFilters, UserStocks>,
          IFindOneRepository<UserStocksFilters, UserStocks>,
          ICreateOneRepository<UserStocks>,
          IUpdateOneRepository<UserStocksFilters, UserStocks>,
          IDeleteOneRepository<UserStocksFilters, UserStocks> {
  
  findByEmail(email: string): Promise<UserStocks | null>;
  findByGoogleId(googleId: string): Promise<UserStocks | null>;
  findByFacebookId(facebookId: string): Promise<UserStocks | null>;
  findByToken(token: string): Promise<UserStocks | null>;
  findAdmins(): Promise<UserStocks[]>;
  findPublishers(): Promise<UserStocks[]>;
  findByCountry(countryId: number): Promise<UserStocks[]>;
  findByLanguage(language: string): Promise<UserStocks[]>;
}
