import { Injectable, Logger } from '@nestjs/common';
import { EODHDService } from '../services/eodhd.service';
import { 
  GetEODHDHistoricalDataDto, 
  GetEODHDMultipleHistoricalDataDto,
  GetEODHDLastPriceDto,
  EODHDResponseDto,
  EODHDMultipleResponseDto,
  EODHDLastPriceResponseDto,
  EODHDInternalFormatDto
} from '../dto/eodhd.dto';

@Injectable()
export class GetEODHDHistoricalDataUseCase {
  private readonly logger = new Logger(GetEODHDHistoricalDataUseCase.name);

  constructor(private readonly eodhdService: EODHDService) {}

  /**
   * Obtiene datos históricos de N días para un símbolo específico
   * @param dto - DTO con parámetros de la consulta
   * @returns Datos históricos en formato EODHD
   */
  async execute(dto: GetEODHDHistoricalDataDto): Promise<EODHDResponseDto> {
    this.logger.log(`Ejecutando caso de uso para obtener ${dto.days} días de datos para ${dto.symbol}`);

    // Validar símbolo
    if (!this.eodhdService.validateSymbol(dto.symbol)) {
      throw new Error(`Formato de símbolo inválido: ${dto.symbol}. Debe ser formato SYMBOL.EXCHANGE`);
    }

    try {
      const result = await this.eodhdService.getHistoricalData(
        dto.symbol,
        dto.days,
        dto.period
      );

      this.logger.log(`Datos obtenidos exitosamente para ${dto.symbol}: ${result.data.length} registros`);
      return result;
    } catch (error) {
      this.logger.error(`Error en caso de uso para ${dto.symbol}:`, error);
      throw error;
    }
  }

  /**
   * Obtiene datos históricos para múltiples símbolos
   * @param dto - DTO con parámetros de la consulta múltiple
   * @returns Respuesta con datos históricos de múltiples símbolos
   */
  async executeMultiple(dto: GetEODHDMultipleHistoricalDataDto): Promise<EODHDMultipleResponseDto> {
    this.logger.log(`Ejecutando caso de uso para obtener ${dto.days} días de datos para ${dto.symbols.length} símbolos`);

    // Validar símbolos
    const invalidSymbols = dto.symbols.filter(symbol => !this.eodhdService.validateSymbol(symbol));
    if (invalidSymbols.length > 0) {
      throw new Error(`Símbolos con formato inválido: ${invalidSymbols.join(', ')}. Deben ser formato SYMBOL.EXCHANGE`);
    }

    try {
      const results = await this.eodhdService.getMultipleHistoricalData(
        dto.symbols,
        dto.days,
        dto.period
      );

      const successfulSymbols = results.length;
      const failedSymbols = dto.symbols.length - successfulSymbols;

      this.logger.log(`Procesamiento completado: ${successfulSymbols} exitosos, ${failedSymbols} fallidos`);

      return {
        data: results,
        total_symbols: dto.symbols.length,
        successful_symbols: successfulSymbols,
        failed_symbols: failedSymbols
      };
    } catch (error) {
      this.logger.error('Error en caso de uso múltiple:', error);
      throw error;
    }
  }

  /**
   * Obtiene el último precio de cierre para un símbolo
   * @param dto - DTO con el símbolo
   * @returns Último precio de cierre
   */
  async executeLastPrice(dto: GetEODHDLastPriceDto): Promise<EODHDLastPriceResponseDto> {
    this.logger.log(`Ejecutando caso de uso para obtener último precio de ${dto.symbol}`);

    // Validar símbolo
    if (!this.eodhdService.validateSymbol(dto.symbol)) {
      throw new Error(`Formato de símbolo inválido: ${dto.symbol}. Debe ser formato SYMBOL.EXCHANGE`);
    }

    try {
      const lastPrice = await this.eodhdService.getLastClosePrice(dto.symbol);
      const today = new Date().toISOString().split('T')[0];

      this.logger.log(`Último precio obtenido para ${dto.symbol}: ${lastPrice}`);

      return {
        symbol: dto.symbol,
        last_close_price: lastPrice,
        date: today
      };
    } catch (error) {
      this.logger.error(`Error obteniendo último precio para ${dto.symbol}:`, error);
      throw error;
    }
  }

  /**
   * Obtiene datos históricos en formato interno del sistema
   * @param dto - DTO con parámetros de la consulta
   * @returns Datos históricos en formato interno
   */
  async executeInternalFormat(dto: GetEODHDHistoricalDataDto): Promise<EODHDInternalFormatDto> {
    this.logger.log(`Ejecutando caso de uso para obtener datos en formato interno para ${dto.symbol}`);

    try {
      const eodhdData = await this.execute(dto);
      const internalData = this.eodhdService.convertToInternalFormat(eodhdData);

      this.logger.log(`Datos convertidos a formato interno para ${dto.symbol}: ${internalData.data.length} registros`);
      return internalData;
    } catch (error) {
      this.logger.error(`Error convirtiendo a formato interno para ${dto.symbol}:`, error);
      throw error;
    }
  }

  /**
   * Obtiene datos históricos para múltiples símbolos en formato interno
   * @param dto - DTO con parámetros de la consulta múltiple
   * @returns Array de datos históricos en formato interno
   */
  async executeMultipleInternalFormat(dto: GetEODHDMultipleHistoricalDataDto): Promise<EODHDInternalFormatDto[]> {
    this.logger.log(`Ejecutando caso de uso para obtener datos en formato interno para ${dto.symbols.length} símbolos`);

    try {
      const eodhdData = await this.executeMultiple(dto);
      const internalData = eodhdData.data.map(item => this.eodhdService.convertToInternalFormat(item));

      this.logger.log(`Datos convertidos a formato interno para ${internalData.length} símbolos`);
      return internalData;
    } catch (error) {
      this.logger.error('Error convirtiendo múltiples datos a formato interno:', error);
      throw error;
    }
  }
}
