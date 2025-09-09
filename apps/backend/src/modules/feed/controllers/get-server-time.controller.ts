import { Controller, Get, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { GetServerTimeUseCase } from '../use-cases/get-server-time.use-case';

@ApiTags('Feed')
@Controller('feed')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('Authorization')
export class GetServerTimeController {
  constructor(
    private readonly getServerTimeUseCase: GetServerTimeUseCase,
  ) {}

  @Get('time')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get server timestamp',
    description: 'Gets the current server timestamp for synchronization',
  })
  @ApiResponse({
    status: 200,
    description: 'Server timestamp retrieved successfully',
    schema: {
      type: 'number',
      example: 1640995200,
    },
  })
  async getServerTime(): Promise<number> {
    return await this.getServerTimeUseCase.execute();
  }
}
