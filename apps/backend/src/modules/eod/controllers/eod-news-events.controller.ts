import { Controller, Get, Query, ValidationPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { GetEODEconomicEventsUseCase } from '../use-cases/get-eod-economic-events.use-case';
import { GetEODHolidaysUseCase } from '../use-cases/get-eod-holidays.use-case';
import { GetEODSplitsUseCase } from '../use-cases/get-eod-splits.use-case';
import { GetEconomicEventsDto, GetHolidaysDto, GetSplitsDto } from '../dto/eod.dto';

@ApiTags('EOD News & Events')
@Controller('eod')
export class EODNewsEventsController {
  constructor(
    private readonly getEODEconomicEventsUseCase: GetEODEconomicEventsUseCase,
    private readonly getEODHolidaysUseCase: GetEODHolidaysUseCase,
    private readonly getEODSplitsUseCase: GetEODSplitsUseCase,
  ) {}

  @Get('economic-events')
  @ApiOperation({ summary: 'Obtiene eventos económicos' })
  @ApiResponse({ status: 200, description: 'Eventos económicos obtenidos exitosamente' })
  @ApiResponse({ status: 400, description: 'Error en la petición' })
  @ApiQuery({ name: 'from', description: 'Fecha de inicio (YYYY-MM-DD)', required: false })
  @ApiQuery({ name: 'to', description: 'Fecha de fin (YYYY-MM-DD)', required: false })
  @ApiQuery({ name: 'country', description: 'País para filtrar eventos', required: false })
  async getEconomicEvents(@Query(ValidationPipe) dto: GetEconomicEventsDto) {
    return this.getEODEconomicEventsUseCase.execute(dto);
  }

  @Get('holidays')
  @ApiOperation({ summary: 'Obtiene días festivos de mercados' })
  @ApiResponse({ status: 200, description: 'Días festivos obtenidos exitosamente' })
  @ApiResponse({ status: 400, description: 'Error en la petición' })
  @ApiQuery({ name: 'from', description: 'Fecha de inicio (YYYY-MM-DD)', required: false })
  @ApiQuery({ name: 'to', description: 'Fecha de fin (YYYY-MM-DD)', required: false })
  @ApiQuery({ name: 'country', description: 'País para filtrar días festivos', required: false })
  async getHolidays(@Query(ValidationPipe) dto: GetHolidaysDto) {
    return this.getEODHolidaysUseCase.execute(dto);
  }

  @Get('splits')
  @ApiOperation({ summary: 'Obtiene datos de splits de acciones' })
  @ApiResponse({ status: 200, description: 'Datos de splits obtenidos exitosamente' })
  @ApiResponse({ status: 400, description: 'Error en la petición' })
  @ApiQuery({ name: 'country', description: 'País para obtener splits (ej: US, UK)', required: true })
  @ApiQuery({ name: 'from', description: 'Fecha de inicio (YYYY-MM-DD)', required: false })
  @ApiQuery({ name: 'to', description: 'Fecha de fin (YYYY-MM-DD)', required: false })
  async getSplits(@Query(ValidationPipe) dto: GetSplitsDto) {
    return this.getEODSplitsUseCase.execute(dto);
  }
}
