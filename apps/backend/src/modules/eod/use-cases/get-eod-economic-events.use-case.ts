import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosResponse } from 'axios';
import { GetEconomicEventsDto } from '../dto/eod.dto';
import { EODEconomicEvent } from '../interfaces/eod-interfaces';

@Injectable()
export class GetEODEconomicEventsUseCase {
  private readonly baseUrl: string;
  private readonly apiKey: string;

  constructor(
    @InjectPinoLogger(GetEODEconomicEventsUseCase.name)
    private readonly logger: PinoLogger,
    private readonly configService: ConfigService,
  ) {
    this.baseUrl = this.configService.get<string>('EOD_HISTORICAL_DATA_URL') || 'https://eodhd.com/api';
    this.apiKey = this.configService.get<string>('EOD_API_TOKEN') || 'demo';
  }

  async execute(dto: GetEconomicEventsDto): Promise<EODEconomicEvent[]> {
    try {
      this.logger.info('Obteniendo eventos económicos');

      const url = `${this.baseUrl}/economic-events`;
      const params = {
        api_token: this.apiKey,
        fmt: dto.format || 'json',
        order: 'd', // Parámetro requerido como en PHP
        limit: dto.limit || 1000, // Parámetro requerido como en PHP
      };

      this.logger.debug(`URL: ${url}`, params);

      const response: AxiosResponse<EODEconomicEvent[]> = await axios.get(url, { params });

      this.logger.debug(`Response status: ${response.status}`, { 
        dataType: typeof response.data, 
        isArray: Array.isArray(response.data),
        dataLength: Array.isArray(response.data) ? response.data.length : 'N/A'
      });

      if (!response.data) {
        throw new BadRequestException('No se recibieron eventos económicos de la API');
      }

      if (!Array.isArray(response.data)) {
        this.logger.warn('La API devolvió un objeto en lugar de un array para eventos económicos:', response.data);
        throw new BadRequestException(`Formato de datos inválido para eventos económicos. La API devolvió: ${JSON.stringify(response.data)}`);
      }

      this.logger.info(`Eventos económicos obtenidos exitosamente: ${response.data.length} registros`);
      return response.data;
    } catch (error) {
      this.logger.error('Error al obtener eventos económicos:', error);
      this.handleApiError(error);
    }
  }

  private handleApiError(error: unknown): never {
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { response: { status: number; data?: { message?: string }; statusText: string } };
      const status = axiosError.response.status;
      const message = axiosError.response.data?.message || axiosError.response.statusText;
      throw new BadRequestException(`Error de API (${status}): ${message} para eventos económicos`);
    } else if (error && typeof error === 'object' && 'request' in error) {
      throw new BadRequestException('No se pudo conectar con la API de EOD para eventos económicos');
    } else if (error instanceof Error) {
      throw new BadRequestException(`Error interno: ${error.message} para eventos económicos`);
    } else {
      throw new BadRequestException('Error desconocido para eventos económicos');
    }
  }
}
