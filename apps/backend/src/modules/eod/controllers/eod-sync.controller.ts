import { Controller, Post, Body, ValidationPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { SyncEODTickersUseCase } from '../use-cases/sync-eod-tickers.use-case';
import { SyncEODExchangesUseCase } from '../use-cases/sync-eod-exchanges.use-case';
import { SyncEODHistoricalDataUseCase } from '../use-cases/sync-eod-historical-data.use-case';
import { GetTickersListDto, GetExchangesListDto, GetHistoricalDataDto } from '../dto/eod.dto';

@ApiTags('EOD Data Synchronization')
@Controller('eod/sync')
export class EODSyncController {
  constructor(
    private readonly syncEODTickersUseCase: SyncEODTickersUseCase,
    private readonly syncEODExchangesUseCase: SyncEODExchangesUseCase,
    private readonly syncEODHistoricalDataUseCase: SyncEODHistoricalDataUseCase,
  ) {}

  @Post('tickers')
  @ApiOperation({ summary: 'Sincroniza tickers desde EOD a la base de datos' })
  @ApiResponse({ status: 200, description: 'Tickers sincronizados exitosamente' })
  @ApiResponse({ status: 400, description: 'Error en la petición' })
  @ApiBody({ type: GetTickersListDto })
  async syncTickers(@Body(ValidationPipe) dto: GetTickersListDto) {
    return this.syncEODTickersUseCase.execute(dto);
  }

  @Post('exchanges')
  @ApiOperation({ summary: 'Sincroniza exchanges desde EOD a la base de datos' })
  @ApiResponse({ status: 200, description: 'Exchanges sincronizados exitosamente' })
  @ApiResponse({ status: 400, description: 'Error en la petición' })
  @ApiBody({ type: GetExchangesListDto })
  async syncExchanges(@Body(ValidationPipe) dto: GetExchangesListDto) {
    return this.syncEODExchangesUseCase.execute(dto);
  }

  @Post('historical-data')
  @ApiOperation({ summary: 'Sincroniza datos históricos desde EOD a la base de datos' })
  @ApiResponse({ status: 200, description: 'Datos históricos sincronizados exitosamente' })
  @ApiResponse({ status: 400, description: 'Error en la petición' })
  @ApiBody({ type: GetHistoricalDataDto })
  async syncHistoricalData(@Body(ValidationPipe) dto: GetHistoricalDataDto) {
    return this.syncEODHistoricalDataUseCase.execute(dto);
  }
}
