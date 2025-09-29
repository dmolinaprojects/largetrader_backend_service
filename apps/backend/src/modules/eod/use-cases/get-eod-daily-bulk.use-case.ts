import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosResponse } from 'axios';
import { GetDailyBulkDataDto } from '../dto/eod.dto';
import { EODDailyBulkData } from '../interfaces/eod-interfaces';

@Injectable()
export class GetEODDailyBulkUseCase {
  private readonly baseUrl: string;
  private readonly apiKey: string;

  constructor(
    @InjectPinoLogger(GetEODDailyBulkUseCase.name)
    private readonly logger: PinoLogger,
    private readonly configService: ConfigService,
  ) {
    this.baseUrl = this.configService.get<string>('EOD_HISTORICAL_DATA_URL') || 'https://eodhd.com/api';
    this.apiKey = this.configService.get<string>('EOD_API_TOKEN') || 'demo';
  }

  async execute(dto: GetDailyBulkDataDto): Promise<EODDailyBulkData[]> {
    try {
      this.logger.info(`Obteniendo datos diarios masivos para ${dto.market} en ${dto.date}`);

      const url = `${this.baseUrl}/eod-bulk-last-day/${dto.market}`;
      const params = {
        api_token: this.apiKey,
        fmt: dto.format || 'json',
        date: dto.date,
      };

      this.logger.debug(`URL: ${url}`, params);

      const response: AxiosResponse<EODDailyBulkData[]> = await axios.get(url, { params });

      this.logger.debug(`Response status: ${response.status}`, { 
        dataType: typeof response.data, 
        isArray: Array.isArray(response.data),
        dataLength: Array.isArray(response.data) ? response.data.length : 'N/A'
      });

      if (!response.data) {
        throw new BadRequestException(`No se recibieron datos diarios masivos para ${dto.market} en ${dto.date}`);
      }

      if (!Array.isArray(response.data)) {
        this.logger.warn(`La API devolvió un objeto en lugar de un array para ${dto.market}:`, response.data);
        throw new BadRequestException(`Formato de datos inválido para ${dto.market}. La API devolvió: ${JSON.stringify(response.data)}`);
      }

      this.logger.info(`Datos diarios masivos obtenidos exitosamente: ${response.data.length} registros`);
      return response.data;
    } catch (error) {
      this.logger.error(`Error al obtener datos diarios masivos para ${dto.market}:`, error);
      this.handleApiError(error, dto.market);
    }
  }

  private handleApiError(error: unknown, market: string): never {
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { response: { status: number; data?: { message?: string }; statusText: string } };
      const status = axiosError.response.status;
      const message = axiosError.response.data?.message || axiosError.response.statusText;
      throw new BadRequestException(`Error de API (${status}): ${message} para el mercado ${market}`);
    } else if (error && typeof error === 'object' && 'request' in error) {
      throw new BadRequestException(`No se pudo conectar con la API de EOD para el mercado ${market}`);
    } else if (error instanceof Error) {
      throw new BadRequestException(`Error interno: ${error.message} para el mercado ${market}`);
    } else {
      throw new BadRequestException(`Error desconocido para el mercado ${market}`);
    }
  }
}
