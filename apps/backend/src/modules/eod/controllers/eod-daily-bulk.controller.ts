import { Controller, Get, Query, ValidationPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { GetEODDailyBulkUseCase } from '../use-cases/get-eod-daily-bulk.use-case';
import { GetDailyBulkDataDto } from '../dto/eod.dto';

@ApiTags('EOD Daily Bulk Data')
@Controller('eod/daily-bulk')
export class EODDailyBulkController {
  constructor(private readonly getEODDailyBulkUseCase: GetEODDailyBulkUseCase) {}

  @Get()
  @ApiOperation({ summary: 'Obtiene datos diarios masivos por mercado' })
  @ApiResponse({ status: 200, description: 'Datos diarios masivos obtenidos exitosamente' })
  @ApiResponse({ status: 400, description: 'Error en la petición' })
  @ApiQuery({ name: 'market', description: 'Código del mercado (ej: US, MI, LSE)', required: true })
  @ApiQuery({ name: 'date', description: 'Fecha en formato YYYY-MM-DD', required: true })
  async getDailyBulkData(@Query(ValidationPipe) dto: GetDailyBulkDataDto) {
    return this.getEODDailyBulkUseCase.execute(dto);
  }
}
