import { Module } from '@nestjs/common';
import { SharedModule } from '@app/shared';

// Controllers
import { GetHistoricalDataController } from './controllers/get-historical-data.controller';
import { SearchSymbolsController } from './controllers/search-symbols.controller';
import { GetSymbolInfoController } from './controllers/get-symbol-info.controller';
import { GetServerTimeController } from './controllers/get-server-time.controller';
import { GetDataLimitsController } from './controllers/get-data-limits.controller';

// Use Cases
import { GetHistoricalDataUseCase } from './use-cases/get-historical-data.use-case';
import { SearchSymbolsUseCase } from './use-cases/search-symbols.use-case';
import { GetSymbolInfoUseCase } from './use-cases/get-symbol-info.use-case';
import { GetServerTimeUseCase } from './use-cases/get-server-time.use-case';
import { GetDataLimitsUseCase } from './use-cases/get-data-limits.use-case';
import { TokenModule } from '../../shared/token/token.module';

@Module({
  imports: [SharedModule, TokenModule],
  controllers: [
    GetHistoricalDataController,
    SearchSymbolsController,
    GetSymbolInfoController,
    GetServerTimeController,
    GetDataLimitsController,
  ],
  providers: [
    GetHistoricalDataUseCase,
    SearchSymbolsUseCase,
    GetSymbolInfoUseCase,
    GetServerTimeUseCase,
    GetDataLimitsUseCase,
  ],
  exports: [
    GetHistoricalDataUseCase,
    SearchSymbolsUseCase,
    GetSymbolInfoUseCase,
    GetServerTimeUseCase,
    GetDataLimitsUseCase,
  ],
})
export class FeedModule {}
