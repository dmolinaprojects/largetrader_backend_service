import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { GetTickersHandlerUseCase } from '../handlers/get-tickers-handler.use-case';

@ApiTags('Stocks')
@Controller('stocks')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('Authorization')
export class GetTickersController {
  constructor(
    @InjectPinoLogger(GetTickersController.name)
    private readonly logger: PinoLogger,
    private readonly handler: GetTickersHandlerUseCase,
  ) {}

  @ApiOperation({ summary: 'Search tickers' })
  @ApiQuery({
    name: 'q',
    required: false,
    description: 'Search by code or name',
  })
  @ApiQuery({ name: 'type', required: false })
  @ApiQuery({ name: 'country', required: false })
  @ApiQuery({ name: 'limit', required: false, schema: { default: 20 } })
  @ApiQuery({ name: 'page', required: false, schema: { default: 1 } })
  @ApiResponse({ status: 200 })
  @Get('tickers')
  async getTickers(
    @Query('q') q?: string,
    @Query('type') type?: string,
    @Query('country') country?: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
  ) {
    this.logger.info(
      `[GetTickersController] q=${q} type=${type} country=${country} page=${page} limit=${limit}`,
    );
    return this.handler.execute({ q, type, country, page, limit });
  }
}
