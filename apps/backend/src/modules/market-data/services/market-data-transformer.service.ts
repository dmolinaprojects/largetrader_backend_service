import { Injectable, Inject } from '@nestjs/common';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { RealTimeData } from '@app/shared/domain/models/stocks/real-time-data.model';
import { RealTimeDataRepository } from '@app/shared/domain/repositories/stocks/real-time-data.repository';
import { MarketTickersRepository } from '@app/shared/domain/repositories/stocks/market-tickers.repository';
import { MarketSplitUsaRepository } from '@app/shared/domain/repositories/stocks/market-split-usa.repository';

/**
 * Datos raw que llegan del WebService EOD
 */
export interface EodRawMarketData {
  s: string;        // symbol
  a: number;        // ask price
  b: number;        // bid price
  timestamp: number;
  as?: number;      // ask size (opcional)
  bs?: number;      // bid size (opcional)
}

/**
 * Datos transformados para el usuario final
 */
export interface TransformedMarketData {
  symbol: string;
  ask: number;
  bid: number;
  price: number;
  change: number;
  changePercent: number;
  open?: number;
  high?: number;
  low?: number;
  close?: number;
  volume?: number;
  timestamp: number;
  receivedAt: number;
}

/**
 * Configuración de escalas por ticker/tipo de activo
 */
export interface TickerScaleConfig {
  ticker: string;
  assetType: string;
  priceMultiplier: number;      // Factor para convertir precios
  volumeMultiplier: number;     // Factor para convertir volumen
  decimals: number;             // Decimales a mostrar
  minPriceIncrement: number;    // Incremento mínimo de precio
  useHistoricalReference: boolean; // Si usar datos históricos como referencia
}

/**
 * Servicio para transformar datos de mercado entre diferentes escalas y formatos
 */
@Injectable()
export class MarketDataTransformerService {
  private scaleConfigCache = new Map<string, TickerScaleConfig>();
  private historicalDataCache = new Map<string, {
    lastPrice: number;
    lastOpen: number;
    lastHigh: number;
    lastLow: number;
    lastClose: number;
    lastUpdate: Date;
  }>();

  constructor(
    @InjectPinoLogger(MarketDataTransformerService.name)
    private readonly logger: PinoLogger,
    @Inject('RealTimeDataRepository')
    private readonly realTimeDataRepository: RealTimeDataRepository,
    @Inject('MarketTickersRepository')
    private readonly marketTickersRepository: MarketTickersRepository,
    @Inject('MarketSplitUsaRepository')
    private readonly marketSplitUsaRepository: MarketSplitUsaRepository,
  ) {}

  /**
   * Transforma datos raw de EOD a formato normalizado para el usuario
   */
  async transformEodToUserFormat(rawData: EodRawMarketData): Promise<TransformedMarketData> {
    try {
      this.logger.debug(
        `[MarketDataTransformerService.transformEodToUserFormat] Transforming data for ${rawData.s}`,
      );

      // 1. Obtener información del ticker para determinar tipo de activo
      const ticker = await this.marketTickersRepository.findByCode(rawData.s);
      const assetType = ticker ? this.determineAssetType(ticker.Type) : 'stock';

      this.logger.debug(
        `[MarketDataTransformerService.transformEodToUserFormat] Asset type for ${rawData.s}: ${assetType}`,
      );

      // 2. Aplicar transformaciones específicas por tipo de activo (MISMA LÓGICA QUE GetHistoricalDataUseCase)
      const transformedAsk = await this.applyPriceTransformation(rawData.a, rawData.s, assetType);
      const transformedBid = await this.applyPriceTransformation(rawData.b, rawData.s, assetType);
      const price = (transformedAsk + transformedBid) / 2;

      // 3. Obtener configuración de decimales para el tipo de activo
      const decimals = this.getDecimalsForAssetType(assetType);

      // 4. Calcular cambios basados en datos históricos
      const { change, changePercent, open, high, low, close } = await this.calculateChanges(
        rawData.s,
        price,
        assetType
      );

      // 5. Crear objeto transformado
      const transformedData: TransformedMarketData = {
        symbol: rawData.s,
        ask: this.roundToDecimals(transformedAsk, decimals),
        bid: this.roundToDecimals(transformedBid, decimals),
        price: this.roundToDecimals(price, decimals),
        change: this.roundToDecimals(change, decimals),
        changePercent: this.roundToDecimals(changePercent, 2),
        open: open ? this.roundToDecimals(open, decimals) : undefined,
        high: high ? this.roundToDecimals(high, decimals) : undefined,
        low: low ? this.roundToDecimals(low, decimals) : undefined,
        close: close ? this.roundToDecimals(close, decimals) : undefined,
        timestamp: rawData.timestamp,
        receivedAt: Date.now(),
      };

      this.logger.debug(
        `[MarketDataTransformerService.transformEodToUserFormat] ✅ Transformed ${rawData.s} (${assetType}): ${JSON.stringify(transformedData)}`,
      );

      return transformedData;

    } catch (error) {
      this.logger.error(
        `[MarketDataTransformerService.transformEodToUserFormat] Error transforming data for ${rawData.s}: ${error.message}`,
      );
      
      // Fallback: devolver datos básicos sin transformación
      return this.createFallbackTransformation(rawData);
    }
  }

  /**
   * Transforma datos para guardar en RealTimeData
   */
  async transformForDatabase(rawData: EodRawMarketData): Promise<Omit<RealTimeData, 'id'>> {
    try {
      // 1. Determinar tipo de activo
      const ticker = await this.marketTickersRepository.findByCode(rawData.s);
      const assetType = ticker ? this.determineAssetType(ticker.Type) : 'stock';
      
      // 2. Aplicar transformaciones de precio
      const transformedAsk = await this.applyPriceTransformation(rawData.a, rawData.s, assetType);
      const transformedBid = await this.applyPriceTransformation(rawData.b, rawData.s, assetType);
      const currentPrice = (transformedAsk + transformedBid) / 2;

      // 3. Obtener datos históricos para completar OHLC
      const historicalData = await this.getHistoricalReference(rawData.s);
      
      // 4. Obtener decimales según tipo de activo
      const decimals = this.getDecimalsForAssetType(assetType);

      return {
        Ticker: rawData.s,
        Open: historicalData.open || currentPrice,
        High: Math.max(historicalData.high || currentPrice, currentPrice),
        Low: Math.min(historicalData.low || currentPrice, currentPrice),
        Close: currentPrice, // El precio actual se considera el "close" actual
        AskPrice: this.roundToDecimals(transformedAsk, decimals),
        AskSize: rawData.as || 0,
        BidPrice: this.roundToDecimals(transformedBid, decimals),
        BidSize: rawData.bs || 0,
      };

    } catch (error) {
      this.logger.error(
        `[MarketDataTransformerService.transformForDatabase] Error transforming for DB ${rawData.s}: ${error.message}`,
      );
      
      // Fallback básico sin transformación
      const price = (rawData.a + rawData.b) / 2;
      return {
        Ticker: rawData.s,
        Open: price,
        High: price,
        Low: price,
        Close: price,
        AskPrice: rawData.a,
        AskSize: rawData.as || 0,
        BidPrice: rawData.b,
        BidSize: rawData.bs || 0,
      };
    }
  }

  /**
   * Obtiene la configuración de escala para un ticker específico
   */
  private async getScaleConfig(ticker: string): Promise<TickerScaleConfig> {
    // Verificar caché primero
    if (this.scaleConfigCache.has(ticker)) {
      return this.scaleConfigCache.get(ticker)!;
    }

    try {
      // Obtener información del ticker de la base de datos
      const tickerInfo = await this.marketTickersRepository.findByCode(ticker);
      
      let config: TickerScaleConfig;

      if (tickerInfo) {
        // Crear configuración basada en el tipo de activo
        config = this.createScaleConfigByAssetType(ticker, tickerInfo.Type);
      } else {
        // Configuración por defecto si no se encuentra el ticker
        config = this.createDefaultScaleConfig(ticker);
      }

      // Cachear la configuración
      this.scaleConfigCache.set(ticker, config);
      
      this.logger.debug(
        `[MarketDataTransformerService.getScaleConfig] Created scale config for ${ticker}: ${JSON.stringify(config)}`,
      );

      return config;

    } catch (error) {
      this.logger.error(
        `[MarketDataTransformerService.getScaleConfig] Error getting scale config for ${ticker}: ${error.message}`,
      );
      
      // Configuración por defecto en caso de error
      const defaultConfig = this.createDefaultScaleConfig(ticker);
      this.scaleConfigCache.set(ticker, defaultConfig);
      return defaultConfig;
    }
  }

  /**
   * Crea configuración de escala basada en el tipo de activo
   */
  private createScaleConfigByAssetType(ticker: string, assetType: string): TickerScaleConfig {
    const baseConfig: TickerScaleConfig = {
      ticker,
      assetType,
      priceMultiplier: 1,
      volumeMultiplier: 1,
      decimals: 2,
      minPriceIncrement: 0.01,
      useHistoricalReference: true,
    };

    switch (assetType.toLowerCase()) {
      case 'crypto':
        return {
          ...baseConfig,
          priceMultiplier: 1, // Crypto suele venir en la escala correcta
          decimals: 8, // Más decimales para crypto
          minPriceIncrement: 0.00000001,
        };

      case 'forex':
        return {
          ...baseConfig,
          priceMultiplier: 1,
          decimals: 5, // Forex típicamente 5 decimales
          minPriceIncrement: 0.00001,
        };

      case 'stock':
      case 'common stock':
      case 'etf':
        return {
          ...baseConfig,
          priceMultiplier: 1,
          decimals: 2,
          minPriceIncrement: 0.01,
        };

      case 'index':
        return {
          ...baseConfig,
          priceMultiplier: 1,
          decimals: 2,
          minPriceIncrement: 0.01,
        };

      case 'commodity':
        return {
          ...baseConfig,
          priceMultiplier: 1,
          decimals: 3, // Commodities suelen tener más precisión
          minPriceIncrement: 0.001,
        };

      default:
        return baseConfig;
    }
  }

  /**
   * Crea configuración por defecto
   */
  private createDefaultScaleConfig(ticker: string): TickerScaleConfig {
    return {
      ticker,
      assetType: 'unknown',
      priceMultiplier: 1,
      volumeMultiplier: 1,
      decimals: 2,
      minPriceIncrement: 0.01,
      useHistoricalReference: true,
    };
  }

  /**
   * Determina el tipo de activo (MISMA lógica que GetHistoricalDataUseCase)
   */
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

  /**
   * Obtiene número de decimales según tipo de activo
   */
  private getDecimalsForAssetType(assetType: string): number {
    switch (assetType.toLowerCase()) {
      case 'crypto':
        return 8; // Crypto necesita más precisión
      case 'forex':
      case 'cfd':
        return 5; // Forex típicamente 5 decimales
      case 'commodity':
        return 3; // Commodities con más precisión
      case 'stock':
      case 'etf':
      case 'index':
      default:
        return 2; // Stocks e índices 2 decimales
    }
  }

  /**
   * Aplica transformación de precio según el tipo de activo
   * Usa la MISMA lógica que GetHistoricalDataUseCase
   */
  private async applyPriceTransformation(price: number, ticker: string, assetType: string): Promise<number> {
    if (!price || price <= 0) return 0;
    
    switch (assetType.toLowerCase()) {
      case 'crypto':
        // Para crypto: dividir por 1000 (igual que en GetHistoricalDataUseCase línea 134)
        return price / 1000;
        
      case 'stock':
      case 'common stock':
      case 'etf':
      case 'preferred stock':
      case 'mutual fund':
        // Para stocks: aplicar splits históricos
        return await this.applyStockSplits(price, ticker);
        
      case 'index':
        // Para índices: mapear símbolos si es necesario
        return price; // Los índices no necesitan transformación de precio
        
      case 'forex':
      case 'cfd':
        // Forex no necesita transformación de precio
        return price;
        
      case 'commodity':
        // Commodities no necesitan transformación de precio
        return price;
        
      default:
        return price;
    }
  }

  /**
   * Aplica splits históricos a un precio (igual que GetHistoricalDataUseCase)
   */
  private async applyStockSplits(price: number, ticker: string): Promise<number> {
    try {
      // Obtener splits del ticker
      const splits = await this.marketSplitUsaRepository.findByCode(ticker);
      
      if (splits.length === 0) return price;

      // Calcular el factor de split total desde hoy hacia atrás
      let totalSplit = 1;
      const today = new Date();
      
      for (const split of splits) {
        // Solo aplicar splits que ya ocurrieron
        if (new Date(split.Date) <= today) {
          totalSplit *= split.Split;
        }
      }

      return price * totalSplit;
      
    } catch (error) {
      this.logger.error(
        `[MarketDataTransformerService.applyStockSplits] Error applying splits for ${ticker}: ${error.message}`,
      );
      return price; // Fallback: devolver precio sin ajustar
    }
  }

  /**
   * Calcula cambios basados en datos históricos
   */
  private async calculateChanges(
    ticker: string,
    currentPrice: number,
    assetType: string
  ): Promise<{
    change: number;
    changePercent: number;
    open?: number;
    high?: number;
    low?: number;
    close?: number;
  }> {
    try {

      // Intentar obtener datos históricos de la caché
      let historicalData = this.historicalDataCache.get(ticker);
      
      if (!historicalData || this.isHistoricalDataStale(historicalData.lastUpdate)) {
        // Obtener el último registro de la base de datos
        const lastRecord = await this.realTimeDataRepository.findLatestByTicker(ticker);
        
        if (lastRecord) {
          historicalData = {
            lastPrice: lastRecord.Close,
            lastOpen: lastRecord.Open,
            lastHigh: lastRecord.High,
            lastLow: lastRecord.Low,
            lastClose: lastRecord.Close,
            lastUpdate: new Date(),
          };
          
          this.historicalDataCache.set(ticker, historicalData);
        }
      }

      if (!historicalData) {
        return { change: 0, changePercent: 0 };
      }

      const change = currentPrice - historicalData.lastPrice;
      const changePercent = historicalData.lastPrice > 0 
        ? (change / historicalData.lastPrice) * 100 
        : 0;

      return {
        change,
        changePercent,
        open: historicalData.lastOpen,
        high: historicalData.lastHigh,
        low: historicalData.lastLow,
        close: historicalData.lastClose,
      };

    } catch (error) {
      this.logger.error(
        `[MarketDataTransformerService.calculateChanges] Error calculating changes for ${ticker}: ${error.message}`,
      );
      return { change: 0, changePercent: 0 };
    }
  }

  /**
   * Obtiene referencia histórica para completar datos OHLC
   */
  private async getHistoricalReference(
    ticker: string
  ): Promise<{
    open: number;
    high: number;
    low: number;
    close: number;
  }> {
    try {
      const lastRecord = await this.realTimeDataRepository.findLatestByTicker(ticker);
      
      if (lastRecord) {
        return {
          open: lastRecord.Open,
          high: lastRecord.High,
          low: lastRecord.Low,
          close: lastRecord.Close,
        };
      }

      // Si no hay datos históricos, usar el precio actual como base
      return {
        open: 0,
        high: 0,
        low: 0,
        close: 0,
      };

    } catch (error) {
      this.logger.error(
        `[MarketDataTransformerService.getHistoricalReference] Error getting historical reference for ${ticker}: ${error.message}`,
      );
      return { open: 0, high: 0, low: 0, close: 0 };
    }
  }

  /**
   * Verifica si los datos históricos están obsoletos
   */
  private isHistoricalDataStale(lastUpdate: Date): boolean {
    const now = new Date();
    const diffMinutes = (now.getTime() - lastUpdate.getTime()) / (1000 * 60);
    return diffMinutes > 5; // Considerar obsoletos después de 5 minutos
  }

  /**
   * Redondea a número específico de decimales
   */
  private roundToDecimals(value: number, decimals: number): number {
    return Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals);
  }

  /**
   * Crea transformación de fallback en caso de error
   */
  private createFallbackTransformation(rawData: EodRawMarketData): TransformedMarketData {
    const price = (rawData.a + rawData.b) / 2;
    
    return {
      symbol: rawData.s,
      ask: rawData.a,
      bid: rawData.b,
      price,
      change: 0,
      changePercent: 0,
      timestamp: rawData.timestamp,
      receivedAt: Date.now(),
    };
  }

  /**
   * Actualiza configuración de escala para un ticker específico
   */
  async updateScaleConfig(ticker: string, config: Partial<TickerScaleConfig>): Promise<void> {
    const currentConfig = await this.getScaleConfig(ticker);
    const updatedConfig = { ...currentConfig, ...config };
    
    this.scaleConfigCache.set(ticker, updatedConfig);
    
    this.logger.info(
      `[MarketDataTransformerService.updateScaleConfig] Updated scale config for ${ticker}: ${JSON.stringify(updatedConfig)}`,
    );
  }

  /**
   * Limpia cachés (útil para testing o reconfiguración)
   */
  clearCaches(): void {
    this.scaleConfigCache.clear();
    this.historicalDataCache.clear();
    
    this.logger.info(
      `[MarketDataTransformerService.clearCaches] All caches cleared`,
    );
  }

  /**
   * Obtiene estadísticas del transformador
   */
  getTransformerStats(): {
    cachedScaleConfigs: number;
    cachedHistoricalData: number;
    configuredTickers: string[];
  } {
    return {
      cachedScaleConfigs: this.scaleConfigCache.size,
      cachedHistoricalData: this.historicalDataCache.size,
      configuredTickers: Array.from(this.scaleConfigCache.keys()),
    };
  }
}
