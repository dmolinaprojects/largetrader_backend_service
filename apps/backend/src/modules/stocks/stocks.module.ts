import { Module } from '@nestjs/common';
import { SharedModule } from '@app/shared';
import { CommonModule } from '../../common/common.module';
import { GetTickersController } from './controllers/get-tickers.controller';
import { GetTickersHandlerUseCase } from './handlers/get-tickers-handler.use-case';
import { GetTickersUseCase } from './use-cases/get-tickers.use-case';
import { TokenModule } from '../../shared/token/token.module';

@Module({
  imports: [SharedModule, CommonModule, TokenModule],
  controllers: [GetTickersController],
  providers: [GetTickersHandlerUseCase, GetTickersUseCase],
  exports: [GetTickersUseCase],
})
export class StocksModule {}
