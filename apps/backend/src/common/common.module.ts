import { Module } from '@nestjs/common';
import { SharedModule } from '../shared/shared.module';
import { GuardsModule } from './guards/guards.module';
import { ResponseInterceptor } from './interceptors/response-interceptor';
import { LoggerModule } from './logger/logger.module';

@Module({
  providers: [ResponseInterceptor],
  imports: [SharedModule, GuardsModule, LoggerModule],
  exports: [GuardsModule, LoggerModule],
})
export class CommonModule {}
