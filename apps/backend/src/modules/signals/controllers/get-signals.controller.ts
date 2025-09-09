import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import {
  ApiOperation,
  ApiTags,
  ApiResponse,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { GetSignalsResponseDto } from '../dto/get-signals-response.dto';
import { GetSignalsHandlerUseCase } from '../handlers/get-signals-handler.use-case';

@ApiTags('Signals')
@Controller('signals')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('Authorization')
export class GetSignalsController {
  constructor(
    @InjectPinoLogger(GetSignalsController.name)
    private readonly logger: PinoLogger,
    private readonly getSignalsHandlerUseCase: GetSignalsHandlerUseCase,
  ) {}

  @ApiOperation({
    summary: 'Get signals with their groups',
    description:
      'Endpoint to get a paginated list of signals with their group information',
  })
  @ApiQuery({
    name: 'page',
    description: 'Page number',
    example: 1,
    required: false,
  })
  @ApiQuery({
    name: 'limit',
    description: 'Number of items per page',
    example: 10,
    required: false,
  })
  @ApiQuery({
    name: 'groupId',
    description: 'Signals group ID',
    example: 1,
    required: false,
  })
  @ApiQuery({
    name: 'ticker',
    description: 'Stock ticker',
    example: 'AAPL',
    required: false,
  })
  @ApiQuery({
    name: 'orderType',
    description: 'Order type',
    example: 'BUY',
    required: false,
  })
  @ApiResponse({
    status: 200,
    description: 'Signals list retrieved successfully',
    type: GetSignalsResponseDto,
  })
  @Get()
  async getSignals(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('groupId') groupId?: number,
    @Query('ticker') ticker?: string,
    @Query('orderType') orderType?: string,
  ): Promise<GetSignalsResponseDto> {
    this.logger.info(
      `[GetSignalsController.getSignals] Getting signals - page: ${page}, limit: ${limit}, groupId: ${groupId}, ticker: ${ticker}, orderType: ${orderType}`,
    );

    const response = await this.getSignalsHandlerUseCase.execute({
      page,
      limit,
      groupId,
      ticker,
      orderType,
    });

    this.logger.info(
      `[GetSignalsController.getSignals] Retrieved ${response.signals.length} signals out of ${response.total} total`,
    );

    return response;
  }
}
