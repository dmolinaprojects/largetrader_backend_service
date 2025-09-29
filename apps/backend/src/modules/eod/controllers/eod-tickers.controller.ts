import { Controller, Get, Query, ValidationPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { GetEODTickersUseCase } from '../use-cases/get-eod-tickers.use-case';
import { GetEODExchangesUseCase } from '../use-cases/get-eod-exchanges.use-case';
import { GetTickersListDto, GetExchangesListDto } from '../dto/eod.dto';

@ApiTags('EOD Tickers & Exchanges')
@Controller('eod')
export class EODTickersController {
  constructor(
    private readonly getEODTickersUseCase: GetEODTickersUseCase,
    private readonly getEODExchangesUseCase: GetEODExchangesUseCase,
  ) {}

  @Get('tickers')
  @ApiOperation({ summary: 'Obtiene lista de tickers por exchange' })
  @ApiResponse({ status: 200, description: 'Lista de tickers obtenida exitosamente' })
  @ApiResponse({ status: 400, description: 'Error en la petición' })
  @ApiQuery({ name: 'exchange', description: 'Código del exchange (ej: US, MI, LSE)', required: true })
  async getTickersList(@Query(ValidationPipe) dto: GetTickersListDto) {
    return this.getEODTickersUseCase.execute(dto);
  }

  @Get('exchanges')
  @ApiOperation({ summary: 'Obtiene lista de exchanges disponibles' })
  @ApiResponse({ status: 200, description: 'Lista de exchanges obtenida exitosamente' })
  @ApiResponse({ status: 400, description: 'Error en la petición' })
  async getExchangesList(@Query(ValidationPipe) dto: GetExchangesListDto) {
    return this.getEODExchangesUseCase.execute(dto);
  }
}
