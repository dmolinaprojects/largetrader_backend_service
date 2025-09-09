import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { MarketTickersRepository } from '@app/shared/domain/repositories/stocks/market-tickers.repository';
import { MarketDataUsaRepository } from '@app/shared/domain/repositories/stocks/market-data-usa.repository';
import { CryptoGlobalD1Repository } from '@app/shared/domain/repositories/stocks/crypto-global-d1.repository';
import { ForexGlobalD1Repository } from '@app/shared/domain/repositories/stocks/forex-global-d1.repository';
import { MarketDataIndexesD1Repository } from '@app/shared/domain/repositories/stocks/market-data-indexes-d1.repository';
import { MarketDataCommoditiesD1Repository } from '@app/shared/domain/repositories/stocks/market-data-commodities-d1.repository';
import { GetDataLimitsDto, DataLimitsResponseDto } from '../dto/get-data-limits.dto';

@Injectable()
export class GetDataLimitsUseCase {
  constructor(
    @Inject('MarketTickersRepository')
    private readonly marketTickersRepository: MarketTickersRepository,
    @Inject('MarketDataUsaRepository')
    private readonly marketDataUsaRepository: MarketDataUsaRepository,
    @Inject('CryptoGlobalD1Repository')
    private readonly cryptoGlobalD1Repository: CryptoGlobalD1Repository,
    @Inject('ForexGlobalD1Repository')
    private readonly forexGlobalD1Repository: ForexGlobalD1Repository,
    @Inject('MarketDataIndexesD1Repository')
    private readonly marketDataIndexesD1Repository: MarketDataIndexesD1Repository,
    @Inject('MarketDataCommoditiesD1Repository')
    private readonly marketDataCommoditiesD1Repository: MarketDataCommoditiesD1Repository,
  ) {}

  async execute(query: GetDataLimitsDto): Promise<DataLimitsResponseDto> {
    const { symbol } = query;

    // First, get the symbol info to determine the type
    const symbolInfo = await this.marketTickersRepository.findBySymbol(symbol);
    if (!symbolInfo) {
      throw new NotFoundException(`Symbol ${symbol} not found`);
    }

    console.log(`Found symbol info for ${symbol}:`, {
      type: symbolInfo.Type ,
      exchange: symbolInfo.Exchange,
      enabled: symbolInfo.Enabled
    });

    let earliestDate: number | null = null;
    let latestDate: number | null = null;
    let totalDataPoints = 0;
    let resolution = '1D';

    try {
      // Normalize the asset type
      const normalizedType = this.normalizeAssetType(symbolInfo.Type);
      console.log(`Evaluating conditions for ${symbol}: Type=${symbolInfo.Type} -> ${normalizedType}, Exchange=${symbolInfo.Exchange}`);
      
      if (normalizedType === 'stock' && symbolInfo.Exchange === 'NASDAQ') {
        console.log(`Using marketDataUsaRepository for ${symbol}`);
        const limits = await this.marketDataUsaRepository.getDataLimits(symbol);
        earliestDate = limits.earliestDate;
        latestDate = limits.latestDate;
        totalDataPoints = limits.totalDataPoints;
      } else if (normalizedType === 'crypto') {
        const limits = await this.cryptoGlobalD1Repository.getDataLimits(symbol);
        earliestDate = limits.earliestDate;
        latestDate = limits.latestDate;
        totalDataPoints = limits.totalDataPoints;
      } else if (normalizedType === 'forex') {
        const limits = await this.forexGlobalD1Repository.getDataLimits(symbol);
        earliestDate = limits.earliestDate;
        latestDate = limits.latestDate;
        totalDataPoints = limits.totalDataPoints;
      } else if (normalizedType === 'index') {
        const limits = await this.marketDataIndexesD1Repository.getDataLimits(symbol);
        earliestDate = limits.earliestDate;
        latestDate = limits.latestDate;
        totalDataPoints = limits.totalDataPoints;
      } else if (normalizedType === 'commodity') {
        const limits = await this.marketDataCommoditiesD1Repository.getDataLimits(symbol);
        earliestDate = limits.earliestDate;
        latestDate = limits.latestDate;
        totalDataPoints = limits.totalDataPoints;
      }

      if (earliestDate === null || latestDate === null) {
        throw new NotFoundException(`No historical data found for symbol ${symbol}`);
      }

      return {
        earliestDate,
        latestDate,
        totalDataPoints,
        symbol,
        resolution,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(`Failed to get data limits for symbol ${symbol}: ${error.message}`);
    }
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
