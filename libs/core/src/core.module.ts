import { Global, Module } from '@nestjs/common';
import { HmacDigestService } from './application/services/hmac-digest.service';

@Global()
@Module({
  providers: [HmacDigestService],
  exports: [HmacDigestService],
})
export class CoreModule {}
