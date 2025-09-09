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
import { Users } from '../../models/users/users.model';

export interface UsersRepository
  extends ITransactionRepository,
    ICreateOneRepository<Users>,
    ICreateManyRepository<Users>,
    IUpdateOneRepository<
      Pick<Users, 'Id'> | Pick<Users, 'Email'> | Pick<Users, 'GoogleId'>,
      Users
    >,
    IDeleteOneRepository<
      Pick<Users, 'Id'> | Pick<Users, 'Email'> | Pick<Users, 'GoogleId'>,
      Users
    >,
    IUpsertOneRepository<
      Pick<Users, 'Id'> | Pick<Users, 'Email'> | Pick<Users, 'GoogleId'>,
      Users
    >,
    IFindOneRepository<Users, Users>,
    IFindManyRepository<Users, Users>,
    ICountManyRepository<Users> {
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
