import { Controller, Get, Query, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { SearchSymbolsUseCase } from '../use-cases/search-symbols.use-case';
import { SearchSymbolsDto, SearchSymbolsResponseDto } from '../dto/search-symbols.dto';

@ApiTags('Feed')
@Controller('feed')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('Authorization')
export class SearchSymbolsController {
  constructor(
    private readonly searchSymbolsUseCase: SearchSymbolsUseCase,
  ) {}

  @Get('search')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Search financial symbols',
    description: 'Searches financial symbols by code or name with asset type filters',
  })
  @ApiResponse({
    status: 200,
    description: 'Symbol search completed successfully',
    type: SearchSymbolsResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid parameters',
  })
  @ApiQuery({ name: 'query', description: 'Search term', example: 'AAPL' })
  @ApiQuery({ name: 'type', description: 'Asset type', example: 'stock' })
  @ApiQuery({ name: 'limit', description: 'Results limit', example: '50', required: false })
  async searchSymbols(@Query() query: SearchSymbolsDto): Promise<SearchSymbolsResponseDto> {
    return await this.searchSymbolsUseCase.execute(query);
  }
}
