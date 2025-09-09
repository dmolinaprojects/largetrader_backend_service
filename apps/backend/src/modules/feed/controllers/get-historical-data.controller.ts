import { Controller, Get, Query, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { GetHistoricalDataUseCase } from '../use-cases/get-historical-data.use-case';
import { GetHistoricalDataDto, HistoricalDataResponseDto } from '../dto/get-historical-data.dto';

@ApiTags('Feed')
@Controller('feed')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('Authorization')
export class GetHistoricalDataController {
  constructor(
    private readonly getHistoricalDataUseCase: GetHistoricalDataUseCase,
  ) {}

  @Get('history')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get historical data for a symbol',
    description: 'Gets historical OHLCV data for a specific symbol within a date range and timeframe',
  })
  @ApiResponse({
    status: 200,
    description: 'Historical data retrieved successfully',
    type: HistoricalDataResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid parameters',
  })
  @ApiResponse({
    status: 404,
    description: 'Symbol not found',
  })
  @ApiQuery({ name: 'symbol', description: 'Symbol code', example: 'AAPL' })
  @ApiQuery({ name: 'resolution', description: 'Timeframe resolution', example: '1D' })
  @ApiQuery({ name: 'from', description: 'Start date timestamp', example: 1640995200 })
  @ApiQuery({ name: 'to', description: 'End date timestamp', example: 1672531200 })
  @ApiQuery({ name: 'countback', description: 'Bar limit (optional)', example: 1000, required: false })
  async getHistoricalData(@Query() query: GetHistoricalDataDto): Promise<HistoricalDataResponseDto> {
    return await this.getHistoricalDataUseCase.execute(query);
  }
}
