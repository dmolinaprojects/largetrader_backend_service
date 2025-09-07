import KeyvRedis from '@keyv/redis';
import { CacheModuleOptions } from '@nestjs/cache-manager';
import { ConfigService } from '@nestjs/config';

export const cacheConfig: (
  configService: ConfigService,
) => CacheModuleOptions = (configService: ConfigService) => ({
  isGlobal: true,
  stores: [new KeyvRedis(configService.getOrThrow<string>('APP_CACHE_URL'))],
  ttl: parseInt(configService.getOrThrow('APP_CACHE_TTL')),
});
