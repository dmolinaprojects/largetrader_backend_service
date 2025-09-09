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
import { SignalsGroupsResponseDto } from '../dto/signals-groups-response.dto';
import { GetSignalsGroupsResponseDto } from '../dto/get-signals-groups-response.dto';
import { GetSignalsGroupsHandlerUseCase } from '../handlers/get-signals-groups-handler.use-case';

@ApiTags('Signals Groups')
@Controller('signals/groups')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('Authorization')
export class GetSignalsGroupsController {
  constructor(
    @InjectPinoLogger(GetSignalsGroupsController.name)
    private readonly logger: PinoLogger,
    private readonly getSignalsGroupsHandlerUseCase: GetSignalsGroupsHandlerUseCase,
  ) {}

  @ApiOperation({
    summary: 'Get signals groups',
    description: 'Endpoint to get a list of signals groups',
  })
  @ApiQuery({
    name: 'name',
    description: 'Group name (partial search)',
    example: 'Trading',
    required: false,
  })
  @ApiResponse({
    status: 200,
    description: 'Signals groups list retrieved successfully',
    type: GetSignalsGroupsResponseDto,
  })
  @Get()
  async getSignalsGroups(@Query('name') name?: string): Promise<GetSignalsGroupsResponseDto> {
    this.logger.info(
      `[GetSignalsGroupsController.getSignalsGroups] Getting signals groups - name: ${name}`,
    );

    const response = await this.getSignalsGroupsHandlerUseCase.execute({
      name,
    });

    this.logger.info(
      `[GetSignalsGroupsController.getSignalsGroups] Retrieved ${response.groups.length} groups out of ${response.total} total`,
    );

    return response;
  }
}
