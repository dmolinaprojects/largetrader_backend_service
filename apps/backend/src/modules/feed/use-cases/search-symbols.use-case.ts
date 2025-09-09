import { Injectable, BadRequestException, Inject } from '@nestjs/common';
import { MarketTickersRepository } from '@app/shared/domain/repositories/stocks/market-tickers.repository';
import { SearchSymbolsDto, SearchSymbolsResponseDto, SymbolSearchResultDto } from '../dto/search-symbols.dto';

@Injectable()
export class SearchSymbolsUseCase {
  constructor(
    @Inject('MarketTickersRepository')
    private readonly marketTickersRepository: MarketTickersRepository,
  ) {}

  async execute(dto: SearchSymbolsDto): Promise<SearchSymbolsResponseDto> {
    const { query, type, limit = '50' } = dto;
    const limitNumber = parseInt(limit, 10);

    if (limitNumber > 100) {
      throw new BadRequestException('El límite máximo es 100 resultados');
    }

    // Buscar símbolos
    const symbols = await this.marketTickersRepository.searchByCodeOrName(query, limitNumber);

    // Filtrar por tipo si se especifica
    const filteredSymbols = type !== 'all' 
      ? symbols.filter(symbol => this.matchesAssetType(symbol.Type, type))
      : symbols;

    // Mapear a DTO de respuesta
    const results: SymbolSearchResultDto[] = filteredSymbols.map(symbol => ({
      symbol: symbol.Code,
      name: symbol.Name,
      type: this.normalizeAssetType(symbol.Type),
      country: symbol.Country,
      exchange: symbol.Exchange,
      currency: symbol.Currency,
    }));

    return {
      results,
      total: results.length,
    };
  }

  private matchesAssetType(symbolType: string, requestedType: string): boolean {
    const typeMap: { [key: string]: string[] } = {
      'stock': ['stock', 'Common Stock', 'ETF', 'Preferred Stock', 'Mutual Fund'],
      'crypto': ['crypto'],
      'forex': ['forex'],
      'index': ['INDEX'],
      'commodity': ['Commodity'],
      'cfd': ['cfd'],
    };

    const validTypes = typeMap[requestedType] || [];
    return validTypes.includes(symbolType);
  }

  private normalizeAssetType(type: string): string {
    const typeMap: { [key: string]: string } = {
      'stock': 'stock',
      'Common Stock': 'stock',
      'ETF': 'stock',
      'Preferred Stock': 'stock',
      'Mutual Fund': 'stock',
      'INDEX': 'index',
      'Commodity': 'commodity',
      'crypto': 'crypto',
      'forex': 'forex',
      'cfd': 'cfd',
    };
    return typeMap[type] || 'stock';
  }
}
