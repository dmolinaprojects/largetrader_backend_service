import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { GetMarketDataUseCase } from '../use-cases/get-market-data.use-case';
import { MarketDataQuery, MarketDataResponse } from '@app/shared';

@ApiTags('Market Data')
@Controller('market-data')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('Authorization')
export class GetMarketDataController {
  constructor(private readonly getMarketDataUseCase: GetMarketDataUseCase) {}

  @Get('history')
  @ApiOperation({ summary: 'Get historical market data' })
  @ApiQuery({
    name: 'symbol',
    description: 'Symbol to get data for',
    example: 'AAPL',
  })
  @ApiQuery({
    name: 'from',
    description: 'Start date (timestamp)',
    example: '1640995200',
  })
  @ApiQuery({
    name: 'to',
    description: 'End date (timestamp)',
    example: '1672531200',
  })
  @ApiQuery({
    name: 'resolution',
    description: 'Data resolution',
    example: '1D',
    required: false,
  })
  @ApiQuery({
    name: 'limit',
    description: 'Maximum number of bars',
    example: '100',
    required: false,
  })
  @ApiQuery({
    name: 'order',
    description: 'Order direction',
    example: 'asc',
    required: false,
  })
  async getHistory(
    @Query('symbol') symbol: string,
    @Query('from') from: string,
    @Query('to') to: string,
    @Query('resolution') resolution?: string,
    @Query('limit') limit?: string,
    @Query('order') order?: 'asc' | 'desc',
  ): Promise<MarketDataResponse> {
    const query: MarketDataQuery = {
      symbol,
      from: new Date(parseInt(from) * 1000),
      to: new Date(parseInt(to) * 1000),
      resolution,
      limit: limit ? parseInt(limit) : undefined,
      order,
    };

    return this.getMarketDataUseCase.execute(query);
  }
}
