import { Injectable } from '@nestjs/common';
import { GetMarketConfigUseCase } from '../use-cases/get-market-config.use-case';
import { MarketConfigResponse } from '@app/shared';

@Injectable()
export class GetMarketConfigHandlerUseCase {
  constructor(
    private readonly getMarketConfigUseCase: GetMarketConfigUseCase,
  ) {}

  handle(): MarketConfigResponse {
    return this.getMarketConfigUseCase.execute();
  }
}
