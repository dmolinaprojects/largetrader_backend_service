import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaClient as UsersPrismaClient } from '@prisma/users-client';
import { PrismaClient as StocksPrismaClient } from '@prisma/stocks-client';
import { PrismaUsersRepository } from './infrastructure/repositories/users/prisma-users.repository';
import { PrismaProductsRepository } from './infrastructure/repositories/users/prisma-products.repository';
import { PrismaUserSettingsRepository } from './infrastructure/repositories/users/prisma-user-settings.repository';
import { PrismaOrdersRepository } from './infrastructure/repositories/users/prisma-orders.repository';
import { PrismaSignalsRepository } from './infrastructure/repositories/users/prisma-signals.repository';
import { PrismaSignalsGroupsRepository } from './infrastructure/repositories/users/prisma-signals-groups.repository';
import { PrismaStockInfoRepository } from './infrastructure/repositories/stocks/prisma-stock-info.repository';
import { PrismaStockInfoTechnicalsRepository } from './infrastructure/repositories/stocks/prisma-stock-info-technicals.repository';
import { PrismaTickersRepository } from './infrastructure/repositories/stocks/prisma-tickers.repository';
import { PrismaMarketDataUsaRepository } from './infrastructure/repositories/stocks/prisma-market-data-usa.repository';
import { PrismaForexGlobalD1Repository } from './infrastructure/repositories/stocks/prisma-forex-global-d1.repository';
import { PrismaCryptoGlobalD1Repository } from './infrastructure/repositories/stocks/prisma-crypto-global-d1.repository';
import { PrismaMarketDataIndexesD1Repository } from './infrastructure/repositories/stocks/prisma-market-data-indexes-d1.repository';
import { PrismaMarketDataCommoditiesD1Repository } from './infrastructure/repositories/stocks/prisma-market-data-commodities-d1.repository';
import { PrismaMarketSplitUsaRepository } from './infrastructure/repositories/stocks/prisma-market-split-usa.repository';
import { PrismaMarketTickersRepository } from './infrastructure/repositories/stocks/prisma-market-tickers.repository';
import { PrismaMarketRealTimeUsaRepository } from './infrastructure/repositories/stocks/prisma-market-real-time-usa.repository';
import { PrismaForexGlobal5mRepository } from './infrastructure/repositories/stocks/prisma-forex-global-5m.repository';
import { PrismaForexGlobal15mRepository } from './infrastructure/repositories/stocks/prisma-forex-global-15m.repository';
import { PrismaForexGlobalH1Repository } from './infrastructure/repositories/stocks/prisma-forex-global-h1.repository';
import { PrismaSettingsRepository } from './infrastructure/repositories/stocks/prisma-settings.repository';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: UsersPrismaClient,
      useFactory: () => new UsersPrismaClient(),
    },
    {
      provide: StocksPrismaClient,
      useFactory: () => new StocksPrismaClient(),
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
      provide: 'OrdersRepository',
      useClass: PrismaOrdersRepository,
    },
    {
      provide: 'SignalsRepository',
      useClass: PrismaSignalsRepository,
    },
    {
      provide: 'SignalsGroupsRepository',
      useClass: PrismaSignalsGroupsRepository,
    },
    {
      provide: 'StockInfoRepository',
      useClass: PrismaStockInfoRepository,
    },
    {
      provide: 'StockInfoTechnicalsRepository',
      useClass: PrismaStockInfoTechnicalsRepository,
    },
    {
      provide: 'TickersRepository',
      useClass: PrismaTickersRepository,
    },
    {
      provide: 'MarketDataUsaRepository',
      useClass: PrismaMarketDataUsaRepository,
    },
    {
      provide: 'ForexGlobalD1Repository',
      useClass: PrismaForexGlobalD1Repository,
    },
    {
      provide: 'CryptoGlobalD1Repository',
      useClass: PrismaCryptoGlobalD1Repository,
    },
    {
      provide: 'MarketDataIndexesD1Repository',
      useClass: PrismaMarketDataIndexesD1Repository,
    },
    {
      provide: 'MarketDataCommoditiesD1Repository',
      useClass: PrismaMarketDataCommoditiesD1Repository,
    },
    {
      provide: 'MarketSplitUsaRepository',
      useClass: PrismaMarketSplitUsaRepository,
    },
    {
      provide: 'MarketTickersRepository',
      useClass: PrismaMarketTickersRepository,
    },
    {
      provide: 'MarketRealTimeUsaRepository',
      useClass: PrismaMarketRealTimeUsaRepository,
    },
    {
      provide: 'ForexGlobal5mRepository',
      useClass: PrismaForexGlobal5mRepository,
    },
    {
      provide: 'ForexGlobal15mRepository',
      useClass: PrismaForexGlobal15mRepository,
    },
    {
      provide: 'ForexGlobalH1Repository',
      useClass: PrismaForexGlobalH1Repository,
    },
    {
      provide: 'SettingsRepository',
      useClass: PrismaSettingsRepository,
    },
  ],
  exports: [
    'UsersRepository',
    'ProductsRepository',
    'UserSettingsRepository',
    'OrdersRepository',
    'SignalsRepository',
    'SignalsGroupsRepository',
    'StockInfoRepository',
    'StockInfoTechnicalsRepository',
    'TickersRepository',
    'MarketDataUsaRepository',
    'ForexGlobalD1Repository',
    'CryptoGlobalD1Repository',
    'MarketDataIndexesD1Repository',
    'MarketDataCommoditiesD1Repository',
    'MarketSplitUsaRepository',
    'MarketTickersRepository',
    'MarketRealTimeUsaRepository',
    'ForexGlobal5mRepository',
    'ForexGlobal15mRepository',
    'ForexGlobalH1Repository',
    'SettingsRepository',
  ],
})
export class SharedModule {}
