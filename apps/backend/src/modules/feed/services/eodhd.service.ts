import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosResponse } from 'axios';

export interface EODHDHistoricalData {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  adjusted_close: number;
  volume: number;
}

export interface EODHDResponse {
  code: string;
  exchange_short_name: string;
  exchange_long_name: string;
  name: string;
  type: string;
  country: string;
  currency: string;
  data: EODHDHistoricalData[];
}

@Injectable()
export class EODHDService {
  private readonly logger = new Logger(EODHDService.name);
  private readonly baseUrl = 'https://eodhd.com/api';
  private readonly apiKey: string;

  constructor(private readonly configService: ConfigService) {
    this.apiKey = this.configService.get<string>('EOD_API_TOKEN') || 'demo';
  }

  /**
   * Obtiene datos históricos de N días para un símbolo específico
   * @param symbol - Símbolo del activo (ej: AAPL.US, TSLA.US)
   * @param days - Número de días de datos históricos a obtener
   * @param period - Período de los datos (d=daily, w=weekly, m=monthly)
   * @returns Datos históricos en formato EODHD
   */
  async getHistoricalData(
    symbol: string,
    days: number,
    period: 'd' | 'w' | 'm' = 'd'
  ): Promise<EODHDResponse> {
    try {
      this.logger.log(`Obteniendo ${days} días de datos históricos para ${symbol}`);

      // Calcular fecha de inicio basada en el número de días
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(endDate.getDate() - days);

      const fromDate = this.formatDate(startDate);
      const toDate = this.formatDate(endDate);

      const url = `${this.baseUrl}/eod/${symbol}`;
      const params = {
        api_token: this.apiKey,
        from: fromDate,
        to: toDate,
        period: period,
        fmt: 'json'
      };

      this.logger.debug(`URL: ${url}`, params);

      const response: AxiosResponse<EODHDResponse> = await axios.get(url, { params });

      if (!response.data || !response.data.data) {
        throw new BadRequestException(`No se encontraron datos para el símbolo ${symbol}`);
      }

      this.logger.log(`Datos obtenidos exitosamente: ${response.data.data.length} registros`);
      
      return response.data;
    } catch (error) {
      this.logger.error(`Error al obtener datos históricos para ${symbol}:`, error);
      
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          throw new BadRequestException('API key inválida para EODHD');
        } else if (error.response?.status === 404) {
          throw new BadRequestException(`Símbolo ${symbol} no encontrado`);
        } else if (error.response?.status === 429) {
          throw new BadRequestException('Límite de API calls excedido');
        }
      }
      
      throw new BadRequestException(`Error al obtener datos históricos: ${error.message}`);
    }
  }

  /**
   * Obtiene datos históricos para múltiples símbolos
   * @param symbols - Array de símbolos
   * @param days - Número de días de datos históricos a obtener
   * @param period - Período de los datos
   * @returns Array de respuestas con datos históricos
   */
  async getMultipleHistoricalData(
    symbols: string[],
    days: number,
    period: 'd' | 'w' | 'm' = 'd'
  ): Promise<EODHDResponse[]> {
    this.logger.log(`Obteniendo datos históricos para ${symbols.length} símbolos`);

    const promises = symbols.map(symbol => 
      this.getHistoricalData(symbol, days, period)
    );

    try {
      const results = await Promise.allSettled(promises);
      
      const successfulResults: EODHDResponse[] = [];
      const failedSymbols: string[] = [];

      results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          successfulResults.push(result.value);
        } else {
          failedSymbols.push(symbols[index]);
          this.logger.warn(`Error al obtener datos para ${symbols[index]}: ${result.reason.message}`);
        }
      });

      if (failedSymbols.length > 0) {
        this.logger.warn(`Símbolos con errores: ${failedSymbols.join(', ')}`);
      }

      return successfulResults;
    } catch (error) {
      this.logger.error('Error al obtener datos históricos múltiples:', error);
      throw new BadRequestException(`Error al obtener datos históricos múltiples: ${error.message}`);
    }
  }

  /**
   * Obtiene el último precio de cierre para un símbolo
   * @param symbol - Símbolo del activo
   * @returns Último precio de cierre
   */
  async getLastClosePrice(symbol: string): Promise<number> {
    try {
      const url = `${this.baseUrl}/eod/${symbol}`;
      const params = {
        api_token: this.apiKey,
        filter: 'last_close',
        fmt: 'json'
      };

      const response = await axios.get(url, { params });
      
      if (response.data && typeof response.data === 'number') {
        return response.data;
      }
      
      throw new BadRequestException(`No se pudo obtener el último precio para ${symbol}`);
    } catch (error) {
      this.logger.error(`Error al obtener último precio para ${symbol}:`, error);
      throw new BadRequestException(`Error al obtener último precio: ${error.message}`);
    }
  }

  /**
   * Formatea una fecha al formato requerido por la API (YYYY-MM-DD)
   * @param date - Fecha a formatear
   * @returns Fecha formateada
   */
  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  /**
   * Valida si un símbolo tiene el formato correcto
   * @param symbol - Símbolo a validar
   * @returns true si el símbolo es válido
   */
  validateSymbol(symbol: string): boolean {
    // Formato básico: debe contener al menos un punto (ej: AAPL.US)
    return symbol.includes('.') && symbol.length > 2;
  }

  /**
   * Convierte datos de EODHD al formato interno del sistema
   * @param eodhdData - Datos de EODHD
   * @returns Datos en formato interno
   */
  convertToInternalFormat(eodhdData: EODHDResponse) {
    return {
      symbol: eodhdData.code,
      exchange: eodhdData.exchange_short_name,
      name: eodhdData.name,
      currency: eodhdData.currency,
      data: eodhdData.data.map(item => ({
        timestamp: Math.floor(new Date(item.date).getTime() / 1000),
        open: item.open,
        high: item.high,
        low: item.low,
        close: item.close,
        adjusted_close: item.adjusted_close,
        volume: item.volume
      }))
    };
  }
}
