import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SharedModule } from '../../shared/shared.module';

// Controllers
import { EODHistoricalDataController } from './controllers/eod-historical-data.controller';
import { EODTickersController } from './controllers/eod-tickers.controller';
import { EODFundamentalsController } from './controllers/eod-fundamentals.controller';
import { EODRealTimeController } from './controllers/eod-real-time.controller';
import { EODNewsEventsController } from './controllers/eod-news-events.controller';
import { EODDailyBulkController } from './controllers/eod-daily-bulk.controller';
import { EODSyncController } from './controllers/eod-sync.controller';

// Use Cases (todos los use cases con lógica de negocio)
import { GetEODHistoricalDataUseCase } from './use-cases/get-eod-historical-data.use-case';
import { GetEODTickersUseCase } from './use-cases/get-eod-tickers.use-case';
import { GetEODExchangesUseCase } from './use-cases/get-eod-exchanges.use-case';
import { GetEODFundamentalsUseCase } from './use-cases/get-eod-fundamentals.use-case';
import { GetEODDelayedDataUseCase } from './use-cases/get-eod-delayed-data.use-case';
import { GetEODEconomicEventsUseCase } from './use-cases/get-eod-economic-events.use-case';
import { GetEODDailyBulkUseCase } from './use-cases/get-eod-daily-bulk.use-case';
import { GetEODHolidaysUseCase } from './use-cases/get-eod-holidays.use-case';
import { GetEODSplitsUseCase } from './use-cases/get-eod-splits.use-case';
import { GetEODRealTimeDataUseCase } from './use-cases/get-eod-real-time-data.use-case';
import { SyncEODTickersUseCase } from './use-cases/sync-eod-tickers.use-case';
import { SyncEODExchangesUseCase } from './use-cases/sync-eod-exchanges.use-case';
import { SyncEODHistoricalDataUseCase } from './use-cases/sync-eod-historical-data.use-case';


// Services eliminados - ahora se usan solo use cases

@Module({
  imports: [ConfigModule, SharedModule],
  controllers: [
    EODHistoricalDataController,
    EODTickersController,
    EODFundamentalsController,
    EODRealTimeController,
    EODNewsEventsController,
    EODDailyBulkController,
    EODSyncController,
  ],
      providers: [
        // Use Cases (todos los use cases)
        GetEODHistoricalDataUseCase,
        GetEODTickersUseCase,
        GetEODExchangesUseCase,
        GetEODFundamentalsUseCase,
        GetEODDelayedDataUseCase,
        GetEODEconomicEventsUseCase,
        GetEODDailyBulkUseCase,
        GetEODHolidaysUseCase,
        GetEODSplitsUseCase,
        GetEODRealTimeDataUseCase,
        SyncEODTickersUseCase,
        SyncEODExchangesUseCase,
        SyncEODHistoricalDataUseCase,
      ],
      exports: [
        GetEODHistoricalDataUseCase,
        GetEODTickersUseCase,
        GetEODExchangesUseCase,
        GetEODFundamentalsUseCase,
        GetEODDelayedDataUseCase,
        GetEODEconomicEventsUseCase,
        GetEODDailyBulkUseCase,
        GetEODHolidaysUseCase,
        GetEODSplitsUseCase,
        GetEODRealTimeDataUseCase,
        SyncEODTickersUseCase,
        SyncEODExchangesUseCase,
        SyncEODHistoricalDataUseCase,
      ],
})
export class EODModule {}
