import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosResponse } from 'axios';
import { GetHolidaysDto } from '../dto/eod.dto';
import { EODHoliday } from '../interfaces/eod-interfaces';

@Injectable()
export class GetEODHolidaysUseCase {
  private readonly baseUrl: string;
  private readonly apiKey: string;

  constructor(
    @InjectPinoLogger(GetEODHolidaysUseCase.name)
    private readonly logger: PinoLogger,
    private readonly configService: ConfigService,
  ) {
    this.baseUrl = this.configService.get<string>('EOD_HISTORICAL_DATA_URL') || 'https://eodhd.com/api';
    this.apiKey = this.configService.get<string>('EOD_API_TOKEN') || 'demo';
  }

  async execute(dto: GetHolidaysDto): Promise<EODHoliday[]> {
    const country = dto.country || 'US'; // Valor por defecto
    
    try {
      this.logger.info(`Obteniendo días festivos para ${country}`);

      const url = `${this.baseUrl}/exchange-details/${country}`;
      const params = {
        api_token: this.apiKey,
        fmt: dto.format || 'json',
        to: dto.to || new Date().getFullYear().toString(),
      };

      this.logger.debug(`URL: ${url}`, params);

      const response: AxiosResponse<EODHoliday[]> = await axios.get(url, { params });

      this.logger.debug(`Response status: ${response.status}`, { 
        dataType: typeof response.data, 
        isArray: Array.isArray(response.data),
        dataLength: Array.isArray(response.data) ? response.data.length : 'N/A'
      });

      if (!response.data) {
        throw new BadRequestException(`No se recibieron días festivos para ${country}`);
      }

      if (!Array.isArray(response.data)) {
        this.logger.warn(`La API devolvió un objeto en lugar de un array para ${country}:`, response.data);
        throw new BadRequestException(`Formato de datos inválido para ${country}. La API devolvió: ${JSON.stringify(response.data)}`);
      }

      this.logger.info(`Días festivos obtenidos exitosamente: ${response.data.length} registros`);
      return response.data;
    } catch (error) {
      this.logger.error(`Error al obtener días festivos para ${country}:`, error);
      this.handleApiError(error, country);
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
