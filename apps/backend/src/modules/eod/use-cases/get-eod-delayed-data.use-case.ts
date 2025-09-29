import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosResponse } from 'axios';
import { GetDelayedDataDto } from '../dto/eod.dto';
import { EODDelayedData } from '../interfaces/eod-interfaces';

@Injectable()
export class GetEODDelayedDataUseCase {
  private readonly baseUrl: string;
  private readonly apiKey: string;

  constructor(
    @InjectPinoLogger(GetEODDelayedDataUseCase.name)
    private readonly logger: PinoLogger,
    private readonly configService: ConfigService,
  ) {
    this.baseUrl = this.configService.get<string>('EOD_HISTORICAL_DATA_URL') || 'https://eodhd.com/api';
    this.apiKey = this.configService.get<string>('EOD_API_TOKEN') || 'demo';
  }

  async execute(dto: GetDelayedDataDto): Promise<EODDelayedData> {
    try {
      this.logger.info(`Obteniendo datos con retraso para ${dto.symbol}`);

      const url = `${this.baseUrl}/real-time/${dto.symbol}`;
      const params: {
        api_token: string;
        fmt: string;
        order: string;
        s?: string;
      } = {
        api_token: this.apiKey,
        fmt: dto.format || 'json',
        order: 'd',
      };

      if (dto.multiTickers) {
        params.s = dto.multiTickers;
      }

      this.logger.debug(`URL: ${url}`, params);

      const response: AxiosResponse<EODDelayedData> = await axios.get(url, { params });

      this.logger.debug(`Response status: ${response.status}`, { 
        dataType: typeof response.data,
        hasData: !!response.data
      });

      if (!response.data) {
        throw new BadRequestException(`No se recibieron datos con retraso para el símbolo ${dto.symbol}`);
      }

      this.logger.info(`Datos con retraso obtenidos exitosamente para ${dto.symbol}`);
      return response.data;
    } catch (error) {
      this.logger.error(`Error al obtener datos con retraso para ${dto.symbol}:`, error);
      this.handleApiError(error, dto.symbol);
    }
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
