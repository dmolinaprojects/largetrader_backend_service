import { Injectable, NotFoundException, BadRequestException, Inject } from '@nestjs/common';
import { MarketTickersRepository } from '@app/shared/domain/repositories/stocks/market-tickers.repository';
import { MarketDataUsaRepository } from '@app/shared/domain/repositories/stocks/market-data-usa.repository';
import { MarketSplitUsaRepository } from '@app/shared/domain/repositories/stocks/market-split-usa.repository';
import { MarketRealTimeUsaRepository } from '@app/shared/domain/repositories/stocks/market-real-time-usa.repository';
import { CryptoGlobalD1Repository } from '@app/shared/domain/repositories/stocks/crypto-global-d1.repository';
import { ForexGlobalD1Repository } from '@app/shared/domain/repositories/stocks/forex-global-d1.repository';
import { ForexGlobal5mRepository } from '@app/shared/domain/repositories/stocks/forex-global-5m.repository';
import { ForexGlobal15mRepository } from '@app/shared/domain/repositories/stocks/forex-global-15m.repository';
import { ForexGlobalH1Repository } from '@app/shared/domain/repositories/stocks/forex-global-h1.repository';
import { MarketDataIndexesD1Repository } from '@app/shared/domain/repositories/stocks/market-data-indexes-d1.repository';
import { MarketDataCommoditiesD1Repository } from '@app/shared/domain/repositories/stocks/market-data-commodities-d1.repository';
import { LogLastTickersRepository } from '@app/shared/domain/repositories/users/log-last-tickers.repository';
import { GetHistoricalDataDto, HistoricalDataResponseDto } from '../dto/get-historical-data.dto';

@Injectable()
export class GetHistoricalDataUseCase {
  constructor(
    @Inject('MarketTickersRepository')
    private readonly marketTickersRepository: MarketTickersRepository,
    @Inject('MarketDataUsaRepository')
    private readonly marketDataUsaRepository: MarketDataUsaRepository,
    @Inject('MarketSplitUsaRepository')
    private readonly marketSplitUsaRepository: MarketSplitUsaRepository,
    @Inject('MarketRealTimeUsaRepository')
    private readonly marketRealTimeUsaRepository: MarketRealTimeUsaRepository,
    @Inject('CryptoGlobalD1Repository')
    private readonly cryptoGlobalD1Repository: CryptoGlobalD1Repository,
    @Inject('ForexGlobalD1Repository')
    private readonly forexGlobalD1Repository: ForexGlobalD1Repository,
    @Inject('ForexGlobal5mRepository')
    private readonly forexGlobal5mRepository: ForexGlobal5mRepository,
    @Inject('ForexGlobal15mRepository')
    private readonly forexGlobal15mRepository: ForexGlobal15mRepository,
    @Inject('ForexGlobalH1Repository')
    private readonly forexGlobalH1Repository: ForexGlobalH1Repository,
    @Inject('MarketDataIndexesD1Repository')
    private readonly marketDataIndexesD1Repository: MarketDataIndexesD1Repository,
    @Inject('MarketDataCommoditiesD1Repository')
    private readonly marketDataCommoditiesD1Repository: MarketDataCommoditiesD1Repository,
    @Inject('LogLastTickersRepository')
    private readonly logLastTickersRepository: LogLastTickersRepository,
  ) {}

  async execute(dto: GetHistoricalDataDto): Promise<HistoricalDataResponseDto> {
    const { symbol, resolution, from, to, countback } = dto;

    // Validar símbolo
    const ticker = await this.marketTickersRepository.findByCode(symbol);
    if (!ticker) {
      throw new NotFoundException(`Símbolo ${symbol} no encontrado`);
    }

    // Registrar actividad del ticker para TickerMonitorService
    try {
      await this.logLastTickersRepository.upsertTickerActivity(symbol, new Date());
    } catch (error) {
      // No fallar si no se puede registrar la actividad
      console.warn(`Failed to log ticker activity for ${symbol}:`, error);
    }

    // Determinar tipo de activo
    const assetType = this.determineAssetType(ticker.Type);

    // Convertir timestamps a fechas
    const dateFrom = new Date(from * 1000);
    const dateTo = new Date(to * 1000);

    // Obtener datos según el tipo de activo
    switch (assetType) {
      case 'stock':
        return await this.getStockData(symbol, dateFrom, dateTo, resolution, countback);
      case 'crypto':
        return await this.getCryptoData(symbol, dateFrom, dateTo, resolution, countback);
      case 'forex':
        return await this.getForexData(symbol, dateFrom, dateTo, resolution, countback);
      case 'index':
        return await this.getIndexData(symbol, dateFrom, dateTo, resolution, countback);
      case 'commodity':
        return await this.getCommodityData(symbol, dateFrom, dateTo, resolution, countback);
      default:
        throw new BadRequestException(`Tipo de activo no soportado: ${assetType}`);
    }
  }

  private determineAssetType(type: string): string {
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
      'cfd': 'forex',
    };
    return typeMap[type] || 'stock';
  }

  private async getStockData(
    symbol: string,
    dateFrom: Date,
    dateTo: Date,
    resolution: string,
    countback?: number,
  ): Promise<HistoricalDataResponseDto> {
    // Obtener datos históricos
    const historicalData = await this.marketDataUsaRepository.findBySymbolAndDateRange(
      symbol,
      dateFrom,
      dateTo,
    );

    // Obtener splits
    const splits = await this.marketSplitUsaRepository.findByCode(symbol);

    // Aplicar splits
    const adjustedData = this.applySplits(historicalData, splits);

    // Limitar resultados si es necesario
    const limitedData = countback ? adjustedData.slice(-countback) : adjustedData;

    // Formatear respuesta
    return this.formatResponse(limitedData);
  }

  private async getCryptoData(
    symbol: string,
    dateFrom: Date,
    dateTo: Date,
    resolution: string,
    countback?: number,
  ): Promise<HistoricalDataResponseDto> {
    const data = await this.cryptoGlobalD1Repository.findBySymbolAndDateRange(
      symbol,
      dateFrom,
      dateTo,
    );

    // Aplicar escalado de precios (dividir por 1000)
    const scaledData = data.map(item => ({
      ...item,
      Open: item.Open / 1000,
      High: item.High / 1000,
      Low: item.Low / 1000,
      Close: item.Close / 1000,
    }));

    const limitedData = countback ? scaledData.slice(-countback) : scaledData;

    return this.formatCryptoResponse(limitedData);
  }

  private async getForexData(
    symbol: string,
    dateFrom: Date,
    dateTo: Date,
    resolution: string,
    countback?: number,
  ): Promise<HistoricalDataResponseDto> {
    let data;
    
    switch (resolution) {
      case '1D':
        data = await this.forexGlobalD1Repository.findBySymbolAndDateRange(symbol, dateFrom, dateTo);
        break;
      case '5':
        data = await this.forexGlobal5mRepository.findBySymbolAndDateRange(symbol, dateFrom, dateTo);
        break;
      case '15':
        data = await this.forexGlobal15mRepository.findBySymbolAndDateRange(symbol, dateFrom, dateTo);
        break;
      case '60':
        data = await this.forexGlobalH1Repository.findBySymbolAndDateRange(symbol, dateFrom, dateTo);
        break;
      default:
        throw new BadRequestException(`Resolución no soportada para forex: ${resolution}`);
    }

    // Filtrar solo días laborables
    const filteredData = data.filter(item => {
      const dayOfWeek = new Date(item.quotedate).getDay();
      return dayOfWeek >= 1 && dayOfWeek <= 5; // Lunes a Viernes
    });

    const limitedData = countback ? filteredData.slice(-countback) : filteredData;

    return this.formatForexResponse(limitedData);
  }

  private async getIndexData(
    symbol: string,
    dateFrom: Date,
    dateTo: Date,
    resolution: string,
    countback?: number,
  ): Promise<HistoricalDataResponseDto> {
    // Equivalencia SPX -> GSPC
    const actualSymbol = symbol === 'SPX' ? 'GSPC' : symbol;

    const data = await this.marketDataIndexesD1Repository.findBySymbolAndDateRange(
      actualSymbol,
      dateFrom,
      dateTo,
    );

    const limitedData = countback ? data.slice(-countback) : data;

    return this.formatResponse(limitedData);
  }

  private async getCommodityData(
    symbol: string,
    dateFrom: Date,
    dateTo: Date,
    resolution: string,
    countback?: number,
  ): Promise<HistoricalDataResponseDto> {
    const data = await this.marketDataCommoditiesD1Repository.findBySymbolAndDateRange(
      symbol,
      dateFrom,
      dateTo,
    );

    const limitedData = countback ? data.slice(-countback) : data;

    return this.formatCommodityResponse(limitedData);
  }

  private applySplits(historicalData: any[], splits: any[]): any[] {
    if (splits.length === 0) return historicalData;

    let totalSplit = 1;
    let splitIndex = 0;

    return historicalData.map(item => {
      // Aplicar splits acumulados
      while (splitIndex < splits.length && 
             new Date(splits[splitIndex].Date) < new Date(item.quotedate)) {
        totalSplit *= splits[splitIndex].Split;
        splitIndex++;
      }

      return {
        ...item,
        open: item.open * totalSplit,
        high: item.high * totalSplit,
        low: item.low * totalSplit,
        close: item.close * totalSplit,
        volume: item.volume * totalSplit,
      };
    });
  }

  private formatResponse(data: any[]): HistoricalDataResponseDto {
    return {
      s: 'ok',
      t: data.map(item => Math.floor(new Date(item.quotedate).getTime() / 1000) + 86400),
      o: data.map(item => item.open),
      h: data.map(item => item.high),
      l: data.map(item => item.low),
      c: data.map(item => item.close),
      v: data.map(item => item.volume || 0),
    };
  }

  private formatCryptoResponse(data: any[]): HistoricalDataResponseDto {
    return {
      s: 'ok',
      t: data.map(item => Math.floor(new Date(item.OpenTime).getTime() / 1000) + 86400),
      o: data.map(item => item.Open),
      h: data.map(item => item.High),
      l: data.map(item => item.Low),
      c: data.map(item => item.Close),
      v: data.map(item => item.Volume || 0),
    };
  }

  private formatForexResponse(data: any[]): HistoricalDataResponseDto {
    return {
      s: 'ok',
      t: data.map(item => Math.floor(new Date(item.quotedate).getTime() / 1000)),
      o: data.map(item => item.open),
      h: data.map(item => item.high),
      l: data.map(item => item.low),
      c: data.map(item => item.close),
      v: data.map(item => 0), // Forex no tiene volumen
    };
  }

  private formatCommodityResponse(data: any[]): HistoricalDataResponseDto {
    return {
      s: 'ok',
      t: data.map(item => Math.floor(new Date(item.quotedate).getTime() / 1000) + 86400),
      o: data.map(item => item.open),
      h: data.map(item => item.high),
      l: data.map(item => item.low),
      c: data.map(item => item.close),
      v: data.map(item => 0), // Commodities no tienen volumen
    };
  }
}
