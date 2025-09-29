import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosResponse } from 'axios';
import { GetFundamentalsDto } from '../dto/eod.dto';
import { EODFundamentals } from '../interfaces/eod-interfaces';

@Injectable()
export class GetEODFundamentalsUseCase {
  private readonly baseUrl: string;
  private readonly apiKey: string;

  constructor(
    @InjectPinoLogger(GetEODFundamentalsUseCase.name)
    private readonly logger: PinoLogger,
    private readonly configService: ConfigService,
  ) {
    this.baseUrl = this.configService.get<string>('EOD_HISTORICAL_DATA_URL') || 'https://eodhd.com/api';
    this.apiKey = this.configService.get<string>('EOD_API_TOKEN') || 'demo';
  }

  async execute(dto: GetFundamentalsDto): Promise<EODFundamentals> {
    try {
      this.logger.info(`Obteniendo datos fundamentales para ${dto.symbol}`);

      // Agregar .US automáticamente como en PHP
      const symbol = dto.symbol.endsWith('.US') ? dto.symbol : `${dto.symbol}.US`;
      
      const url = `${this.baseUrl}/fundamentals/${symbol}`;
      const params = {
        api_token: this.apiKey,
        fmt: dto.format || 'json',
      };

      this.logger.debug(`URL: ${url}`, params);

      const response: AxiosResponse<EODFundamentals> = await axios.get(url, { params });

      this.logger.debug(`Response status: ${response.status}`, { 
        dataType: typeof response.data,
        hasData: !!response.data
      });

      if (!response.data) {
        throw new BadRequestException(`No se recibieron datos fundamentales para el símbolo ${symbol}`);
      }

      this.logger.info(`Datos fundamentales obtenidos exitosamente para ${symbol}`);
      return response.data;
    } catch (error) {
      this.logger.error(`Error al obtener datos fundamentales para ${dto.symbol}:`, error);
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
