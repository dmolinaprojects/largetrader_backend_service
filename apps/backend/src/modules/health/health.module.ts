import { Module } from '@nestjs/common';
import { SharedModule } from '../../shared/shared.module';
import { HealthController } from './controllers/health.controller';

@Module({
  controllers: [HealthController],
  imports: [SharedModule],
})
export class HealthModule {}
