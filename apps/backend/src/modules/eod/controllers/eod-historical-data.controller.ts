import { Controller, Get, Query, ValidationPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { GetEODHistoricalDataUseCase } from '../use-cases/get-eod-historical-data.use-case';
import { GetHistoricalDataDto } from '../dto/eod.dto';

@ApiTags('EOD Historical Data')
@Controller('eod/historical-data')
export class EODHistoricalDataController {
  constructor(private readonly getEODHistoricalDataUseCase: GetEODHistoricalDataUseCase) {}

  @Get()
  @ApiOperation({ summary: 'Obtiene datos históricos de un símbolo' })
  @ApiResponse({ status: 200, description: 'Datos históricos obtenidos exitosamente' })
  @ApiResponse({ status: 400, description: 'Error en la petición' })
  @ApiQuery({ name: 'symbol', description: 'Símbolo del activo (ej: AAPL.US)', required: true })
  @ApiQuery({ name: 'from', description: 'Fecha de inicio (YYYY-MM-DD)', required: false })
  @ApiQuery({ name: 'to', description: 'Fecha de fin (YYYY-MM-DD)', required: false })
  @ApiQuery({ name: 'days', description: 'Número de días hacia atrás', required: false })
  @ApiQuery({ name: 'period', description: 'Período de los datos (d, w, m)', required: false })
  async getHistoricalData(@Query(ValidationPipe) dto: GetHistoricalDataDto) {
    return this.getEODHistoricalDataUseCase.execute(dto);
  }
}
