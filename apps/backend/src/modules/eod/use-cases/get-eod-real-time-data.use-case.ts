import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { GetRealTimeDataDto } from '../dto/eod.dto';
import { EODRealTimeData } from '../interfaces/eod-interfaces';
import { GetEODDelayedDataUseCase } from './get-eod-delayed-data.use-case';

@Injectable()
export class GetEODRealTimeDataUseCase {
  constructor(
    @InjectPinoLogger(GetEODRealTimeDataUseCase.name)
    private readonly logger: PinoLogger,
    private readonly getEODDelayedDataUseCase: GetEODDelayedDataUseCase,
  ) {}

  async execute(dto: GetRealTimeDataDto): Promise<EODRealTimeData[]> {
    try {
      this.logger.info(`Obteniendo datos en tiempo real para ${dto.symbols.length} símbolos`);

      // Para datos en tiempo real, necesitarías implementar WebSocket
      // Por ahora, devolvemos datos con retraso para cada símbolo
      const promises = dto.symbols.map(symbol => 
        this.getEODDelayedDataUseCase.execute({ symbol, format: dto.format })
      );

      const results = await Promise.allSettled(promises);
      const realTimeData: EODRealTimeData[] = [];

      results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          const data = result.value;
          realTimeData.push({
            s: data.code,
            a: data.close, // Usar close como ask aproximado
            b: data.close, // Usar close como bid aproximado
            p: data.close,
            t: data.timestamp,
            dc: 0, // No disponible en datos con retraso
            dd: 0, // No disponible en datos con retraso
            o: data.open,
            h: data.high,
            l: data.low,
            v: data.volume,
          });
        } else {
          this.logger.warn(`Error al obtener datos para ${dto.symbols[index]}:`, result.reason);
        }
      });

      this.logger.info(`Datos en tiempo real obtenidos exitosamente: ${realTimeData.length} símbolos`);
      return realTimeData;
    } catch (error) {
      this.logger.error('Error al obtener datos en tiempo real:', error);
      throw new BadRequestException(`Error al obtener datos en tiempo real: ${error.message}`);
    }
  }
}
