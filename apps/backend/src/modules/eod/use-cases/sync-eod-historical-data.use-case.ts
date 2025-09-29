import { Injectable, Inject } from '@nestjs/common';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosResponse } from 'axios';
import { MarketDataUsaRepository } from '@app/shared';
import { GetHistoricalDataDto } from '../dto/eod.dto';
import { EODHistoricalData } from '../interfaces/eod-interfaces';

@Injectable()
export class SyncEODHistoricalDataUseCase {
  private readonly baseUrl: string;
  private readonly apiKey: string;

  constructor(
    @InjectPinoLogger(SyncEODHistoricalDataUseCase.name)
    private readonly logger: PinoLogger,
    private readonly configService: ConfigService,
    @Inject('MarketDataUsaRepository')
    private readonly marketDataUsaRepository: MarketDataUsaRepository,
  ) {
    this.baseUrl = this.configService.get<string>('EOD_HISTORICAL_DATA_URL') || 'https://eodhd.com/api';
    this.apiKey = this.configService.get<string>('EOD_API_TOKEN') || 'demo';
  }

  async execute(dto: GetHistoricalDataDto) {
    const historicalData = await this.getHistoricalData(dto);
    let processedCount = 0;
    let errorCount = 0;
    
    this.logger.debug(`Iniciando sincronización de ${historicalData.length} registros históricos para ${dto.symbol}`);
    
    // Almacenar datos históricos usando el repositorio DDD
    for (const item of historicalData) {
      try {
          // Convertir datos EOD a formato de base de datos
          const data = this.convertEODHistoricalToMarketData(item, dto.symbol);

        // Verificar si ya existe el registro
        const existingData = await this.marketDataUsaRepository.findOne({
          where: {
            symbol: dto.symbol,
            quotedate: new Date(item.date),
          },
        });

        if (existingData) {
          // Actualizar registro existente
          await this.marketDataUsaRepository.updateOne({
            where: { id: existingData.id },
            data: data,
          });
        } else {
          // Crear nuevo registro
          await this.marketDataUsaRepository.createOne({
            data: {
              id: 0, // Se asignará automáticamente por la base de datos
              ...data,
            },
          });
        }
        
        processedCount++;
        this.logger.debug(`Dato histórico procesado: ${dto.symbol} - ${item.date}`);
      } catch (error) {
        errorCount++;
        this.logger.error(`Error al almacenar dato histórico para ${dto.symbol} en ${item.date}:`, error);
      }
    }
    
    this.logger.info(`Sincronización completada: ${processedCount} procesados, ${errorCount} errores`);
    
    return {
      message: 'Datos históricos sincronizados exitosamente',
      symbol: dto.symbol,
      total: historicalData.length,
      processed: processedCount,
      errors: errorCount,
    };
  }

  private async getHistoricalData(dto: GetHistoricalDataDto): Promise<EODHistoricalData[]> {
    try {
      this.logger.info(`Obteniendo datos históricos para ${dto.symbol}`);

      // Construir URL exactamente como en PHP
      let fromDate = dto.from || '1950-01-01';
      let toDate = dto.to || '2500-01-01';

      if (dto.days) {
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(endDate.getDate() - dto.days);
        fromDate = this.formatDate(startDate);
        toDate = this.formatDate(endDate);
      }

      const url = `${this.baseUrl}/eod/${dto.symbol}?fmt=json&order=d&from=${fromDate}&to=${toDate}&api_token=${this.apiKey}`;

      this.logger.debug(`URL: ${url}`);

      const response: AxiosResponse<EODHistoricalData[]> = await axios.get(url);

      if (!response.data || !Array.isArray(response.data)) {
        throw new Error(`Formato de datos inválido para el símbolo ${dto.symbol}`);
      }

      this.logger.info(`Datos históricos obtenidos exitosamente: ${response.data.length} registros`);
      return response.data;
    } catch (error) {
      this.logger.error(`Error al obtener datos históricos para ${dto.symbol}:`, error);
      throw error;
    }
  }

  private convertEODHistoricalToMarketData(item: EODHistoricalData, symbol: string) {
    return {
      symbol: symbol,
      quotedate: new Date(item.date),
      open: parseFloat(item.open.toString()),
      high: parseFloat(item.high.toString()),
      low: parseFloat(item.low.toString()),
      close: parseFloat(item.close.toString()),
      volume: parseInt(item.volume.toString()),
      adjustedclose: parseFloat(item.adjusted_close.toString()),
    };
  }

  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }
}
