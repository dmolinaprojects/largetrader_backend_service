import { Injectable, Inject } from '@nestjs/common';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosResponse } from 'axios';
import { MarketTickersRepository } from '@app/shared';
import { GetTickersListDto } from '../dto/eod.dto';
import { EODTicker } from '../interfaces/eod-interfaces';

@Injectable()
export class SyncEODTickersUseCase {
  private readonly baseUrl: string;
  private readonly apiKey: string;

  constructor(
    @InjectPinoLogger(SyncEODTickersUseCase.name)
    private readonly logger: PinoLogger,
    private readonly configService: ConfigService,
    @Inject('MarketTickersRepository')
    private readonly marketTickersRepository: MarketTickersRepository,
  ) {
    this.baseUrl = this.configService.get<string>('EOD_HISTORICAL_DATA_URL') || 'https://eodhd.com/api';
    this.apiKey = this.configService.get<string>('EOD_API_TOKEN') || 'demo';
  }

  async execute(dto: GetTickersListDto) {
    const tickers = await this.getTickersList(dto);
    let processedCount = 0;
    let errorCount = 0;
    
    this.logger.info(`Iniciando sincronización de ${tickers.length} tickers para exchange ${dto.exchange}`);
    
    // Sincronizar tickers usando el repositorio DDD
    for (const ticker of tickers) {
      try {
        // Verificar si el ticker ya existe
        const existingTicker = await this.marketTickersRepository.findOne({
          where: {
            Code: ticker.Code,
            Country: ticker.Country,
          },
        });

        if (existingTicker) {
          // Actualizar ticker existente
          await this.marketTickersRepository.updateOne({
            where: { Id: existingTicker.Id },
            data: {
              Name: ticker.Name,
              Exchange: ticker.Exchange,
              Currency: ticker.Currency,
              Type: ticker.Type,
              Isin: ticker.Isin,
            },
          });
          this.logger.debug(`Ticker actualizado: ${ticker.Code}`);
        } else {
          // Crear nuevo ticker
          const marketTickerData = this.convertEODTickerToMarketTicker(ticker);
          await this.marketTickersRepository.createOne({
            data: {
              Id: 0, // Se asignará automáticamente por la base de datos
              ...marketTickerData,
              LastUpdateH1: null,
              LastUpdateD1: null,
              LastUpdateW1: null,
              Enabled: true,
            },
          });
          this.logger.debug(`Ticker creado: ${ticker.Code}`);
        }
        processedCount++;
      } catch (error) {
        errorCount++;
        this.logger.error(`Error al procesar ticker ${ticker.Code}:`, error);
      }
    }
    
    this.logger.debug(`Sincronización completada: ${processedCount} procesados, ${errorCount} errores`);
    
    return {
      message: 'Tickers sincronizados exitosamente',
      exchange: dto.exchange,
      total: tickers.length,
      processed: processedCount,
      errors: errorCount,
    };
  }

  private async getTickersList(dto: GetTickersListDto): Promise<EODTicker[]> {
    try {
      this.logger.info(`Obteniendo lista de tickers para exchange ${dto.exchange}`);

      const url = `${this.baseUrl}/exchange-symbol-list/${dto.exchange}`;
      const params = {
        api_token: this.apiKey,
        fmt: dto.format || 'json',
      };

      this.logger.debug(`URL: ${url}`, params);

      const response: AxiosResponse<EODTicker[]> = await axios.get(url, { params });

      if (!response.data || !Array.isArray(response.data)) {
        throw new Error(`Formato de datos inválido para exchange ${dto.exchange}`);
      }

      this.logger.info(`Tickers obtenidos exitosamente: ${response.data.length} registros`);
      return response.data;
    } catch (error) {
      this.logger.error(`Error al obtener tickers para exchange ${dto.exchange}:`, error);
      throw error;
    }
  }

  private convertEODTickerToMarketTicker(ticker: EODTicker) {
    // Extraer baseAsset y quoteAsset del Code si es posible
    const codeParts = ticker.Code.split('.');
    const baseAsset = codeParts[0] || ticker.Code;
    const quoteAsset = codeParts[1] || 'USD';

    return {
      Code: ticker.Code,
      Name: ticker.Name,
      Country: ticker.Country,
      Exchange: ticker.Exchange,
      Currency: ticker.Currency,
      Type: ticker.Type,
      Isin: ticker.Isin,
      baseAsset,
      quoteAsset,
    };
  }
}