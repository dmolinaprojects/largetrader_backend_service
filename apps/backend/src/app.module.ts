import { CoreModule as AppCoreModule, IBaseEvent } from '@app/core';
import { SharedModule as AppSharedModule } from '@app/shared';
import { classes } from '@automapper/classes';
import { AutomapperModule } from '@automapper/nestjs';
import { OpenTelemetryModule } from '@nest-otel/k8s';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Module, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CqrsModule, UnhandledExceptionBus } from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';
import {
  ClientProxy,
  ClientsModule,
  RmqRecord,
  RmqRecordBuilder,
} from '@nestjs/microservices';
import { LoggerModule } from 'nestjs-pino';
import { lastValueFrom, Subject, takeUntil } from 'rxjs';
import { CommonModule } from './common/common.module';

import { SharedModule } from './shared/shared.module';
import { DocsJwtAuthorizer } from './common/middlewares/docs-jwt-authorizer';
import { loggerConfig } from './configuration/index';
import { envValidator } from './env.validator';
import { HealthModule } from './modules/health/health.module';
import { AuthenticationModule } from './modules/authentication/authentication.module';
import { WebSocketModule } from './modules/websocket/websocket.module';
import { SignalsModule } from './modules/signals/signals.module';
import { StocksModule } from './modules/stocks/stocks.module';
import { MarketDataModule } from './modules/market-data/market-data.module';
import { FeedModule } from './modules/feed/feed.module';
import { EODModule } from './modules/eod/eod.module';

@Module({
  controllers: [],
  imports: [
    OpenTelemetryModule.forRoot(),
    LoggerModule.forRoot(loggerConfig),
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      validate: envValidator,
    }),
    AutomapperModule.forRoot({
      strategyInitializer: classes(),
    }),
    CqrsModule.forRoot(),

    AppCoreModule,
    AppSharedModule,
    SharedModule,

    // Essentials
    CommonModule,

    // Other Modules
    AuthenticationModule,
    WebSocketModule,
    SignalsModule,
    StocksModule,
    MarketDataModule,
    FeedModule,
    EODModule,
    HealthModule,
  ],
  providers: [DocsJwtAuthorizer, ConfigService, JwtService],
  exports: [],
})
export class AppModule implements OnModuleInit, OnModuleDestroy {
  private destroy$ = new Subject<void>();

  constructor(
    private readonly unhandledExceptionsBus: UnhandledExceptionBus<
      IBaseEvent<unknown>
    >,
  ) {}

  onModuleInit() {
    this.unhandledExceptionsBus.pipe(takeUntil(this.destroy$));
    /* .subscribe((exceptionInfo) => {
        const cacheKey = `retries:${exceptionInfo.cause.id}`;

        this.cacheManager
          .get<string | undefined>(cacheKey)
          .then((value) => {
            const retryCount = value ? parseInt(value) + 1 : 1;

            if (retryCount <= 10) {
              const delaySeconds = Math.exp(retryCount) / (retryCount + 2);
              const delayMilliseconds = Math.round(delaySeconds * 1000);
              const ttlCache = delayMilliseconds + 5 * 60 * 1000;

              this.cacheManager
                .set(cacheKey, retryCount, ttlCache)
                .catch(console.log);

              const record = new RmqRecordBuilder(
                JSON.stringify(exceptionInfo.cause.data),
              )
                .setOptions({
                  headers: {
                    ['x-delay']: delayMilliseconds.toString(),
                  },
                })
                .build();
            }

            return;
          })
          .catch(console.log);
      });*/
  }

  onModuleDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
