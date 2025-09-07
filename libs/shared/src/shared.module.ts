import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaClient as UsersPrismaClient } from '@prisma/users-client';
import { PrismaUsersRepository } from './infrastructure/repositories/users/prisma-users.repository';
import { PrismaProductsRepository } from './infrastructure/repositories/users/prisma-products.repository';
import { PrismaUserSettingsRepository } from './infrastructure/repositories/users/prisma-user-settings.repository';
import { PrismaUserStocksRepository } from './infrastructure/repositories/users/prisma-user-stocks.repository';
import { PrismaOrdersRepository } from './infrastructure/repositories/users/prisma-orders.repository';
import { PrismaStockInfoRepository } from './infrastructure/repositories/stocks/prisma-stock-info.repository';
import { PrismaStockInfoTechnicalsRepository } from './infrastructure/repositories/stocks/prisma-stock-info-technicals.repository';
import { 
  UsersRepository, 
  ProductsRepository, 
  UserSettingsRepository, 
  UserStocksRepository, 
  OrdersRepository,
  StockInfoRepository,
  StockInfoTechnicalsRepository
} from './domain/repositories';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: UsersPrismaClient,
      useFactory: () => new UsersPrismaClient(),
    },
    {
      provide: 'UsersRepository',
      useClass: PrismaUsersRepository,
    },
    {
      provide: 'ProductsRepository',
      useClass: PrismaProductsRepository,
    },
    {
      provide: 'UserSettingsRepository',
      useClass: PrismaUserSettingsRepository,
    },
    {
      provide: 'UserStocksRepository',
      useClass: PrismaUserStocksRepository,
    },
    {
      provide: 'OrdersRepository',
      useClass: PrismaOrdersRepository,
    },
    {
      provide: 'StockInfoRepository',
      useClass: PrismaStockInfoRepository,
    },
    {
      provide: 'StockInfoTechnicalsRepository',
      useClass: PrismaStockInfoTechnicalsRepository,
    },
  ],
  exports: [
    'UsersRepository',
    'ProductsRepository',
    'UserSettingsRepository',
    'UserStocksRepository',
    'OrdersRepository',
    'StockInfoRepository',
    'StockInfoTechnicalsRepository',
  ],
})
export class SharedModule {}
