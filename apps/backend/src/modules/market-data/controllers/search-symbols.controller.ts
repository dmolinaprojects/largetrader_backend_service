import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import {
  SearchSymbolsUseCase,
  SearchSymbolsQuery,
  SearchSymbolsResult,
} from '../use-cases/search-symbols.use-case';

@ApiTags('Market Data')
@Controller('market-data')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('Authorization')
export class SearchSymbolsController {
  constructor(private readonly searchSymbolsUseCase: SearchSymbolsUseCase) {}

  @Get('search')
  @ApiOperation({ summary: 'Search symbols' })
  @ApiQuery({
    name: 'query',
    description: 'Search query',
    example: 'AAPL',
    required: false,
  })
  @ApiQuery({
    name: 'type',
    description: 'Symbol type',
    example: 'stock',
    required: false,
  })
  @ApiQuery({
    name: 'limit',
    description: 'Maximum number of results',
    example: '50',
    required: false,
  })
  async searchSymbols(
    @Query('query') query?: string,
    @Query('type') type?: string,
    @Query('limit') limit?: string,
  ): Promise<SearchSymbolsResult[]> {
    const searchQuery: SearchSymbolsQuery = {
      query,
      type,
      limit: limit ? parseInt(limit) : undefined,
    };

    return this.searchSymbolsUseCase.execute(searchQuery);
  }
}
