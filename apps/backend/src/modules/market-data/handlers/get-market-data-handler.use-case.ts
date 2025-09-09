import { Injectable } from '@nestjs/common';
import { GetMarketDataUseCase } from '../use-cases/get-market-data.use-case';
import { MarketDataQuery, MarketDataResponse } from '@app/shared';

@Injectable()
export class GetMarketDataHandlerUseCase {
  constructor(private readonly getMarketDataUseCase: GetMarketDataUseCase) {}

  async handle(query: MarketDataQuery): Promise<MarketDataResponse> {
    return this.getMarketDataUseCase.execute(query);
  }
}
