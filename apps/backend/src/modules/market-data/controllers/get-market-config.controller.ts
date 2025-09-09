import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { GetMarketConfigUseCase } from '../use-cases/get-market-config.use-case';
import { MarketConfigResponse } from '@app/shared';

@ApiTags('Market Data')
@Controller('market-data')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('Authorization')
export class GetMarketConfigController {
  constructor(
    private readonly getMarketConfigUseCase: GetMarketConfigUseCase,
  ) {}

  @Get('config')
  @ApiOperation({ summary: 'Get market configuration' })
  getConfig(): MarketConfigResponse {
    return this.getMarketConfigUseCase.execute();
  }
}
