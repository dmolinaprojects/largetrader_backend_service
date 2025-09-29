import { Injectable, Inject } from '@nestjs/common';
import { MarketDataUsaRepository } from '@app/shared';
import { MarketDataQuery, MarketDataResponse } from '@app/shared';
import { MarketDataUsa } from '@app/shared';
import { LogLastTickersRepository } from '@app/shared/domain/repositories/users/log-last-tickers.repository';

@Injectable()
export class GetMarketDataUseCase {
  constructor(
    @Inject('MarketDataUsaRepository')
    private readonly marketDataUsaRepository: MarketDataUsaRepository,
    @Inject('LogLastTickersRepository')
    private readonly logLastTickersRepository: LogLastTickersRepository,
  ) {}

  async execute(query: MarketDataQuery): Promise<MarketDataResponse> {
    const { symbol, from, to, limit, order = 'asc' } = query;

    // Registrar actividad del ticker para TickerMonitorService
    try {
      await this.logLastTickersRepository.upsertTickerActivity(symbol, new Date());
    } catch (error) {
      // No fallar si no se puede registrar la actividad
      console.warn(`Failed to log ticker activity for ${symbol}:`, error);
    }

    const data = await this.marketDataUsaRepository.findMany({
      where: {
        symbol: { equals: symbol },
        quotedate: { gte: from, lte: to },
      },
      take: limit,
      orderBy: { quotedate: order },
    });

    const response: MarketDataResponse = {
      t: [],
      o: [],
      h: [],
      l: [],
      c: [],
      v: [],
      s: 'ok',
    };

    data.forEach((item: MarketDataUsa) => {
      response.t.push(Math.floor(item.quotedate.getTime() / 1000) + 86400); // +1 day in seconds
      response.o.push(item.open);
      response.h.push(item.high);
      response.l.push(item.low);
      response.c.push(item.close);
      response.v.push(item.volume);
    });

    return response;
  }
}
