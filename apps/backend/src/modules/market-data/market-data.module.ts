import { Module } from '@nestjs/common';
import { SharedModule } from '@app/shared';
import { CommonModule } from '../../common/common.module';
import { GetMarketDataController } from './controllers/get-market-data.controller';
import { GetMarketConfigController } from './controllers/get-market-config.controller';
import { GetSymbolInfoController } from './controllers/get-symbol-info.controller';
import { SearchSymbolsController } from './controllers/search-symbols.controller';
import { GetMarketDataHandlerUseCase } from './handlers/get-market-data-handler.use-case';
import { GetMarketConfigHandlerUseCase } from './handlers/get-market-config-handler.use-case';
import { GetSymbolInfoHandlerUseCase } from './handlers/get-symbol-info-handler.use-case';
import { SearchSymbolsHandlerUseCase } from './handlers/search-symbols-handler.use-case';
import { GetMarketDataUseCase } from './use-cases/get-market-data.use-case';
import { GetMarketConfigUseCase } from './use-cases/get-market-config.use-case';
import { GetSymbolInfoUseCase } from './use-cases/get-symbol-info.use-case';
import { SearchSymbolsUseCase } from './use-cases/search-symbols.use-case';
import { TokenModule } from '../../shared/token/token.module';

@Module({
  imports: [SharedModule, CommonModule, TokenModule],
  controllers: [
    GetMarketDataController,
    GetMarketConfigController,
    GetSymbolInfoController,
    SearchSymbolsController,
  ],
  providers: [
    GetMarketDataHandlerUseCase,
    GetMarketConfigHandlerUseCase,
    GetSymbolInfoHandlerUseCase,
    SearchSymbolsHandlerUseCase,
    GetMarketDataUseCase,
    GetMarketConfigUseCase,
    GetSymbolInfoUseCase,
    SearchSymbolsUseCase,
  ],
  exports: [
    GetMarketDataUseCase,
    GetMarketConfigUseCase,
    GetSymbolInfoUseCase,
    SearchSymbolsUseCase,
  ],
})
export class MarketDataModule {}
