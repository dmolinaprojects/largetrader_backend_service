import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosResponse } from 'axios';
import { GetSplitsDto } from '../dto/eod.dto';
import { EODSplit } from '../interfaces/eod-interfaces';

@Injectable()
export class GetEODSplitsUseCase {
  private readonly baseUrl: string;
  private readonly apiKey: string;

  constructor(
    @InjectPinoLogger(GetEODSplitsUseCase.name)
    private readonly logger: PinoLogger,
    private readonly configService: ConfigService,
  ) {
    this.baseUrl = this.configService.get<string>('EOD_HISTORICAL_DATA_URL') || 'https://eodhd.com/api';
    this.apiKey = this.configService.get<string>('EOD_API_TOKEN') || 'demo';
  }

  async execute(dto: GetSplitsDto): Promise<EODSplit[]> {
    try {
      this.logger.info(`Obteniendo datos de splits para ${dto.country}`);

      const url = `${this.baseUrl}/eod-bulk-last-day/${dto.country}`;
      const params: {
        api_token: string;
        fmt: string;
        type: string;
        from?: string;
        to?: string;
      } = {
        api_token: this.apiKey,
        fmt: dto.format || 'json',
        type: 'splits', // Parámetro requerido como en PHP
      };

      // Agregar fechas si están disponibles
      if (dto.from) {
        params.from = dto.from;
      }
      if (dto.to) {
        params.to = dto.to;
      }

      this.logger.debug(`URL: ${url}`, params);

      const response: AxiosResponse<EODSplit[]> = await axios.get(url, { params });

      this.logger.debug(`Response status: ${response.status}`, { 
        dataType: typeof response.data, 
        isArray: Array.isArray(response.data),
        dataLength: Array.isArray(response.data) ? response.data.length : 'N/A'
      });

      if (!response.data) {
        throw new BadRequestException(`No se recibieron datos de splits para ${dto.country}`);
      }

      if (!Array.isArray(response.data)) {
        this.logger.warn(`La API devolvió un objeto en lugar de un array para ${dto.country}:`, response.data);
        throw new BadRequestException(`Formato de datos inválido para ${dto.country}. La API devolvió: ${JSON.stringify(response.data)}`);
      }

      this.logger.info(`Datos de splits obtenidos exitosamente: ${response.data.length} registros`);
      return response.data;
    } catch (error) {
      this.logger.error(`Error al obtener datos de splits para ${dto.country}:`, error);
      this.handleApiError(error, dto.country);
    }
  }

  private handleApiError(error: unknown, country: string): never {
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { response: { status: number; data?: { message?: string }; statusText: string } };
      const status = axiosError.response.status;
      const message = axiosError.response.data?.message || axiosError.response.statusText;
      throw new BadRequestException(`Error de API (${status}): ${message} para el país ${country}`);
    } else if (error && typeof error === 'object' && 'request' in error) {
      throw new BadRequestException(`No se pudo conectar con la API de EOD para el país ${country}`);
    } else if (error instanceof Error) {
      throw new BadRequestException(`Error interno: ${error.message} para el país ${country}`);
    } else {
      throw new BadRequestException(`Error desconocido para el país ${country}`);
    }
  }
}
