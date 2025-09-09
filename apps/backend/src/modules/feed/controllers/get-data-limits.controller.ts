import { Controller, Get, Query, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { GetDataLimitsUseCase } from '../use-cases/get-data-limits.use-case';
import { GetDataLimitsDto, DataLimitsResponseDto } from '../dto/get-data-limits.dto';

@ApiTags('Feed')
@Controller('feed')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('Authorization')
export class GetDataLimitsController {
  constructor(
    private readonly getDataLimitsUseCase: GetDataLimitsUseCase,
  ) {}

  @Get('data-limits')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get data limits for a symbol',
    description: 'Gets the earliest and latest available dates for historical data of a specific symbol',
  })
  @ApiResponse({
    status: 200,
    description: 'Data limits retrieved successfully',
    type: DataLimitsResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid parameters',
  })
  @ApiResponse({
    status: 404,
    description: 'Symbol not found or no data available',
  })
  @ApiQuery({ name: 'symbol', description: 'Symbol code', example: 'AAPL' })
  async getDataLimits(@Query() query: GetDataLimitsDto): Promise<DataLimitsResponseDto> {
    return await this.getDataLimitsUseCase.execute(query);
  }
}
