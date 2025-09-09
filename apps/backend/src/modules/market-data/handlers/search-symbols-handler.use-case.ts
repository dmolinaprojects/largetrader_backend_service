import { Injectable } from '@nestjs/common';
import {
  SearchSymbolsUseCase,
  SearchSymbolsQuery,
  SearchSymbolsResult,
} from '../use-cases/search-symbols.use-case';

@Injectable()
export class SearchSymbolsHandlerUseCase {
  constructor(private readonly searchSymbolsUseCase: SearchSymbolsUseCase) {}

  async handle(query: SearchSymbolsQuery): Promise<SearchSymbolsResult[]> {
    return this.searchSymbolsUseCase.execute(query);
  }
}
