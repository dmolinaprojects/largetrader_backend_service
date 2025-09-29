import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosResponse } from 'axios';
import { GetHistoricalDataDto } from '../dto/eod.dto';
import { EODHistoricalData } from '../interfaces/eod-interfaces';

@Injectable()
export class GetEODHistoricalDataUseCase {
  private readonly baseUrl: string;
  private readonly apiKey: string;

  constructor(
    @InjectPinoLogger(GetEODHistoricalDataUseCase.name)
    private readonly logger: PinoLogger,
    private readonly configService: ConfigService,
  ) {
    this.baseUrl = this.configService.get<string>('EOD_HISTORICAL_DATA_URL') || 'https://eodhd.com/api';
    this.apiKey = this.configService.get<string>('EOD_API_TOKEN') || 'demo';
  }

  async execute(dto: GetHistoricalDataDto): Promise<EODHistoricalData[]> {
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

      this.logger.debug(`Response status: ${response.status}`, { 
        dataType: typeof response.data, 
        isArray: Array.isArray(response.data),
        dataLength: Array.isArray(response.data) ? response.data.length : 'N/A',
        dataPreview: response.data
      });

      if (!response.data) {
        throw new BadRequestException(`No se recibieron datos de la API para el símbolo ${dto.symbol}`);
      }

      if (!Array.isArray(response.data)) {
        this.logger.warn(`La API devolvió un objeto en lugar de un array para ${dto.symbol}:`, response.data);
        throw new BadRequestException(`Formato de datos inválido para el símbolo ${dto.symbol}. La API devolvió: ${JSON.stringify(response.data)}`);
      }

      if (response.data.length === 0) {
        throw new BadRequestException(`No se encontraron datos históricos para el símbolo ${dto.symbol}. Verifica que el símbolo sea correcto y tenga datos disponibles.`);
      }

      this.logger.info(`Datos obtenidos exitosamente: ${response.data.length} registros`);
      return response.data;
    } catch (error) {
      this.logger.error(`Error al obtener datos históricos para ${dto.symbol}:`, error);
      this.handleApiError(error, dto.symbol);
    }
  }

  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  private handleApiError(error: unknown, symbol: string): never {
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { response: { status: number; data?: { message?: string }; statusText: string } };
      const status = axiosError.response.status;
      const message = axiosError.response.data?.message || axiosError.response.statusText;
      throw new BadRequestException(`Error de API (${status}): ${message} para el símbolo ${symbol}`);
    } else if (error && typeof error === 'object' && 'request' in error) {
      throw new BadRequestException(`No se pudo conectar con la API de EOD para el símbolo ${symbol}`);
    } else if (error instanceof Error) {
      throw new BadRequestException(`Error interno: ${error.message} para el símbolo ${symbol}`);
    } else {
      throw new BadRequestException(`Error desconocido para el símbolo ${symbol}`);
    }
  }
}
