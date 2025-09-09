import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { MarketTickersRepository } from '@app/shared/domain/repositories/stocks/market-tickers.repository';
import { CryptoGlobalD1Repository } from '@app/shared/domain/repositories/stocks/crypto-global-d1.repository';
import { GetSymbolInfoDto, SymbolInfoResponseDto } from '../dto/get-symbol-info.dto';

@Injectable()
export class GetSymbolInfoUseCase {
  constructor(
    @Inject('MarketTickersRepository')
    private readonly marketTickersRepository: MarketTickersRepository,
    @Inject('CryptoGlobalD1Repository')
    private readonly cryptoGlobalD1Repository: CryptoGlobalD1Repository,
  ) {}

  async execute(dto: GetSymbolInfoDto): Promise<SymbolInfoResponseDto> {
    const { symbol } = dto;

    // Buscar símbolo
    const ticker = await this.marketTickersRepository.findByCode(symbol);
    if (!ticker) {
      throw new NotFoundException(`Símbolo ${symbol} no encontrado`);
    }

    // Determinar tipo de activo
    const assetType = this.determineAssetType(ticker.Type);

    // Obtener precio actual para criptomonedas (para calcular pricescale)
    let currentPrice = 0;
    if (assetType === 'crypto') {
      const latestCrypto = await this.cryptoGlobalD1Repository.findLatestBySymbol(symbol);
      if (latestCrypto) {
        currentPrice = latestCrypto.Open / 1000; // Aplicar escalado
      }
    }

    // Generar configuración específica del tipo
    const config = this.generateSymbolConfig(assetType, currentPrice);

    return {
      name: symbol,
      type: assetType,
      timezone: 'America/New_York',
      session: config.session,
      pricescale: config.pricescale,
      minmov: 1,
      minmov2: 0,
      pointvalue: 1,
      data_status: 'streaming',
      has_daily: true,
      has_intraday: true,
      has_no_volume: config.hasNoVolume,
      description: ticker.Name,
      ticker: symbol,
    };
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

  private generateSymbolConfig(assetType: string, currentPrice: number = 0) {
    switch (assetType) {
      case 'crypto':
        return {
          session: '24x7',
          pricescale: this.calculateCryptoPriceScale(currentPrice),
          hasNoVolume: false,
        };
      case 'forex':
        return {
          session: '24x7',
          pricescale: 100000,
          hasNoVolume: true,
        };
      case 'commodity':
        return {
          session: '0930-1630',
          pricescale: 100,
          hasNoVolume: true,
        };
      case 'index':
      case 'stock':
      default:
        return {
          session: '0930-1630',
          pricescale: 100,
          hasNoVolume: false,
        };
    }
  }

  private calculateCryptoPriceScale(price: number): number {
    if (price < 0.0001) return 100000000;
    if (price < 0.01) return 1000000;
    if (price < 0.1) return 100000;
    if (price < 1) return 10000;
    if (price < 100) return 1000;
    return 100;
  }
}
