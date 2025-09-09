import { Injectable, Inject } from '@nestjs/common';
import { MarketDataUsaRepository } from '@app/shared';
import { MarketDataQuery, MarketDataResponse } from '@app/shared';
import { MarketDataUsa } from '@app/shared';

@Injectable()
export class GetMarketDataUseCase {
  constructor(
    @Inject('MarketDataUsaRepository')
    private readonly marketDataUsaRepository: MarketDataUsaRepository,
  ) {}

  async execute(query: MarketDataQuery): Promise<MarketDataResponse> {
    const { symbol, from, to, limit, order = 'asc' } = query;

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
