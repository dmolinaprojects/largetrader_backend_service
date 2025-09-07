import { Module } from '@nestjs/common';
import { SharedModule } from '../../shared/shared.module';
import { JwtAuthGuard } from './jwt-auth.guard';

@Module({
  imports: [SharedModule],
  providers: [JwtAuthGuard],
  exports: [JwtAuthGuard],
})
export class GuardsModule {}
