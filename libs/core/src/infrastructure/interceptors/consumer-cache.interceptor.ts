import { bigintReplacer } from '@app/core/application';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { RmqContext } from '@nestjs/microservices';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { map, Observable, of } from 'rxjs';

@Injectable()
export class ConsumerCacheInterceptor implements NestInterceptor {
  constructor(
    @InjectPinoLogger(ConsumerCacheInterceptor.name)
    private readonly logger: PinoLogger,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const rmqContext = context.switchToRpc().getContext<RmqContext>();
    const message = rmqContext.getMessage();
    const content = (message.content as Buffer).toString('utf-8');
    const payload = JSON.parse(content) as { pattern: string; data: string };
    const data = JSON.parse(payload.data) as {
      transactionHash: string;
      type: string;
      correlationId: string;
      version: string;
      parameters: Record<string, any>;
    };

    this.logger.info(`Event data => ${payload.data}`);

    const eventCacheKey = `${data.transactionHash}-${data.type}`;

    const isCached = await this.cacheManager.get<string>(eventCacheKey);

    if (isCached) {
      const data = JSON.parse(isCached);

      this.logger.info(`Consumer cached: ${eventCacheKey} => ${isCached}`);

      return of(data);
    }

    return next.handle().pipe(
      map(async (data) => {
        this.logger.info(`Consumer no cached: ${eventCacheKey} => ${isCached}`);

        const dataJson = JSON.stringify(data, bigintReplacer);

        await this.cacheManager.set(eventCacheKey, dataJson, 15 * 60 * 1000);

        this.logger.info(`Cached consumer: ${eventCacheKey} => ${dataJson}`);

        return data;
      }),
    );
  }
}
