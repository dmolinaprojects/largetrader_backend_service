import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { GetSymbolInfoUseCase } from '../use-cases/get-symbol-info.use-case';
import { SymbolInfoResponse } from '@app/shared';

@ApiTags('Market Data')
@Controller('market-data')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('Authorization')
export class GetSymbolInfoController {
  constructor(private readonly getSymbolInfoUseCase: GetSymbolInfoUseCase) {}

  @Get('symbols')
  @ApiOperation({ summary: 'Get symbol information' })
  @ApiQuery({
    name: 'symbol',
    description: 'Symbol to get info for',
    example: 'AAPL',
  })
  async getSymbolInfo(
    @Query('symbol') symbol: string,
  ): Promise<SymbolInfoResponse | null> {
    return this.getSymbolInfoUseCase.execute(symbol);
  }
}
