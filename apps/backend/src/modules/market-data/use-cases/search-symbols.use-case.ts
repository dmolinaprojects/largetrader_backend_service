import { Injectable, Inject } from '@nestjs/common';
import { TickersRepository } from '@app/shared';

export interface SearchSymbolsQuery {
  query?: string;
  type?: string;
  limit?: number;
}

export interface SearchSymbolsResult {
  symbol: string;
  full_name: string;
  description: string;
  exchange: string;
  type: string;
}

@Injectable()
export class SearchSymbolsUseCase {
  constructor(
    @Inject('TickersRepository')
    private readonly tickersRepository: TickersRepository,
  ) {}

  async execute(query: SearchSymbolsQuery): Promise<SearchSymbolsResult[]> {
    const { query: searchQuery = '', type, limit = 50 } = query;

    const where: any = {};

    if (searchQuery) {
      where.OR = [
        { Code: { contains: searchQuery } },
        { Name: { contains: searchQuery } },
      ];
    }

    if (type) {
      where.Type = type;
    }

    const tickers = await this.tickersRepository.findMany({
      where,
      take: limit,
    });

    return tickers.map((ticker) => ({
      symbol: ticker.tiker,
      full_name: ticker.tiker,
      description: ticker.name || '----',
      exchange: ticker.country,
      type: ticker.type.toLowerCase(),
    }));
  }
}
