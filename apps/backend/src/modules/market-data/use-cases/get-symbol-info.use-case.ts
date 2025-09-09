import { Injectable, Inject } from '@nestjs/common';
import { TickersRepository } from '@app/shared';
import { SymbolInfoResponse } from '@app/shared';

@Injectable()
export class GetSymbolInfoUseCase {
  constructor(
    @Inject('TickersRepository')
    private readonly tickersRepository: TickersRepository,
  ) {}

  async execute(symbol: string): Promise<SymbolInfoResponse | null> {
    const ticker = await this.tickersRepository.findOne({
      where: { tiker: symbol },
    });

    if (!ticker) {
      return null;
    }

    return {
      name: symbol,
      timezone: 'America/New_York',
      minmov: 1,
      minmov2: 0,
      pointvalue: 1,
      data_status: 'streaming',
      has_daily: true,
      has_intraday: false,
      has_no_volume: false,
      description: ticker.name,
      type: ticker.type.toLowerCase(),
      pricescale: 100,
      session: '0930-1630',
      ticker: symbol,
    };
  }
}
