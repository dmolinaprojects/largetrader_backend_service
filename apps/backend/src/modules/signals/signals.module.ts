import { Module } from '@nestjs/common';
import { SharedModule } from '@app/shared';
import { TokenModule } from '../../shared/token/token.module';
import { GetSignalsController } from './controllers/get-signals.controller';
import { GetSignalsGroupsController } from './controllers/get-signals-groups.controller';
import { GetSignalsHandlerUseCase } from './handlers/get-signals-handler.use-case';
import { GetSignalsGroupsHandlerUseCase } from './handlers/get-signals-groups-handler.use-case';
import { GetSignalsUseCase } from './use-cases/get-signals.use-case';
import { GetSignalsGroupsUseCase } from './use-cases/get-signals-groups.use-case';

@Module({
  imports: [SharedModule, TokenModule,],
  controllers: [GetSignalsController, GetSignalsGroupsController],
  providers: [
    GetSignalsHandlerUseCase,
    GetSignalsGroupsHandlerUseCase,
    GetSignalsUseCase,
    GetSignalsGroupsUseCase,
  ],
  exports: [
    GetSignalsHandlerUseCase,
    GetSignalsGroupsHandlerUseCase,
    GetSignalsUseCase,
    GetSignalsGroupsUseCase,
  ],
})
export class SignalsModule {}
