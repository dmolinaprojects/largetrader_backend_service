import { Controller, Get, Query, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { GetSymbolInfoUseCase } from '../use-cases/get-symbol-info.use-case';
import { GetSymbolInfoDto, SymbolInfoResponseDto } from '../dto/get-symbol-info.dto';

@ApiTags('Feed')
@Controller('feed')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('Authorization')
export class GetSymbolInfoController {
  constructor(
    private readonly getSymbolInfoUseCase: GetSymbolInfoUseCase,
  ) {}

  @Get('symbols')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get symbol information',
    description: 'Gets detailed metadata for a specific symbol for chart configuration',
  })
  @ApiResponse({
    status: 200,
    description: 'Symbol information retrieved successfully',
    type: SymbolInfoResponseDto,
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
  async getSymbolInfo(@Query() query: GetSymbolInfoDto): Promise<SymbolInfoResponseDto> {
    return await this.getSymbolInfoUseCase.execute(query);
  }
}
