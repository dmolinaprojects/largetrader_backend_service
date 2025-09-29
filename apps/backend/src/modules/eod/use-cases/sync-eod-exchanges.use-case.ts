import { Injectable } from '@nestjs/common';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosResponse } from 'axios';
import { GetExchangesListDto } from '../dto/eod.dto';
import { EODExchange } from '../interfaces/eod-interfaces';

@Injectable()
export class SyncEODExchangesUseCase {
  private readonly baseUrl: string;
  private readonly apiKey: string;

  constructor(
    @InjectPinoLogger(SyncEODExchangesUseCase.name)
    private readonly logger: PinoLogger,
    private readonly configService: ConfigService,
  ) {
    this.baseUrl = this.configService.get<string>('EOD_HISTORICAL_DATA_URL') || 'https://eodhd.com/api';
    this.apiKey = this.configService.get<string>('EOD_API_TOKEN') || 'demo';
  }

  async execute(dto: GetExchangesListDto) {
    const exchanges = await this.getExchangesList(dto);
    
    this.logger.debug(`Obtenidos ${exchanges.length} exchanges de EOD`);
    
    // Por ahora solo logueamos los exchanges ya que no hay repositorio implementado
    // TODO: Implementar repositorio de exchanges cuando sea necesario
    for (const exchange of exchanges) {
      this.logger.debug(`Exchange: ${exchange.Code} - ${exchange.Name} (${exchange.Country})`);
    }
    
    return {
      message: 'Exchanges obtenidos exitosamente (repositorio no implementado)',
      count: exchanges.length,
      exchanges: exchanges.map(ex => ({
        code: ex.Code,
        name: ex.Name,
        country: ex.Country,
        currency: ex.Currency,
      })),
    };
  }

  private async getExchangesList(dto: GetExchangesListDto): Promise<EODExchange[]> {
    try {
      this.logger.info('Obteniendo lista de exchanges');

      const url = `${this.baseUrl}/exchanges-list/`;
      const params = {
        api_token: this.apiKey,
        fmt: dto.format || 'json',
      };

      this.logger.debug(`URL: ${url}`, params);

      const response: AxiosResponse<EODExchange[]> = await axios.get(url, { params });

      if (!response.data || !Array.isArray(response.data)) {
        throw new Error('Formato de datos inválido para exchanges');
      }

      this.logger.info(`Exchanges obtenidos exitosamente: ${response.data.length} registros`);
      return response.data;
    } catch (error) {
      this.logger.error('Error al obtener exchanges:', error);
      throw error;
    }
  }
}
