import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosResponse } from 'axios';
import { GetExchangesListDto } from '../dto/eod.dto';
import { EODExchange } from '../interfaces/eod-interfaces';

@Injectable()
export class GetEODExchangesUseCase {
  private readonly baseUrl: string;
  private readonly apiKey: string;

  constructor(
    @InjectPinoLogger(GetEODExchangesUseCase.name)
    private readonly logger: PinoLogger,
    private readonly configService: ConfigService,
  ) {
    this.baseUrl = this.configService.get<string>('EOD_HISTORICAL_DATA_URL') || 'https://eodhd.com/api';
    this.apiKey = this.configService.get<string>('EOD_API_TOKEN') || 'demo';
  }

  async execute(dto: GetExchangesListDto): Promise<EODExchange[]> {
    try {
      this.logger.info('Obteniendo lista de exchanges');

      const url = `${this.baseUrl}/exchanges-list/`;
      const params = {
        api_token: this.apiKey,
        fmt: dto.format || 'json',
      };

      this.logger.debug(`URL: ${url}`, params);

      const response: AxiosResponse<EODExchange[]> = await axios.get(url, { params });

      this.logger.debug(`Response status: ${response.status}`, { 
        dataType: typeof response.data, 
        isArray: Array.isArray(response.data),
        dataLength: Array.isArray(response.data) ? response.data.length : 'N/A'
      });

      if (!response.data) {
        throw new BadRequestException('No se recibieron datos de la API para exchanges');
      }

      if (!Array.isArray(response.data)) {
        this.logger.warn('La API devolvió un objeto en lugar de un array para exchanges:', response.data);
        throw new BadRequestException(`Formato de datos inválido para exchanges. La API devolvió: ${JSON.stringify(response.data)}`);
      }

      this.logger.info(`Exchanges obtenidos exitosamente: ${response.data.length} registros`);
      return response.data;
    } catch (error) {
      this.logger.error('Error al obtener exchanges:', error);
      this.handleApiError(error);
    }
  }

  private handleApiError(error: unknown): never {
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { response: { status: number; data?: { message?: string }; statusText: string } };
      const status = axiosError.response.status;
      const message = axiosError.response.data?.message || axiosError.response.statusText;
      throw new BadRequestException(`Error de API (${status}): ${message} para exchanges`);
    } else if (error && typeof error === 'object' && 'request' in error) {
      throw new BadRequestException('No se pudo conectar con la API de EOD para exchanges');
    } else if (error instanceof Error) {
      throw new BadRequestException(`Error interno: ${error.message} para exchanges`);
    } else {
      throw new BadRequestException('Error desconocido para exchanges');
    }
  }
}
