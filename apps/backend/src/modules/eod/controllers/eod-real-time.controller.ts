import { Controller, Get, Post, Body, Query, ValidationPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiBody } from '@nestjs/swagger';
import { GetEODDelayedDataUseCase } from '../use-cases/get-eod-delayed-data.use-case';
import { GetEODRealTimeDataUseCase } from '../use-cases/get-eod-real-time-data.use-case';
import { GetDelayedDataDto, GetRealTimeDataDto } from '../dto/eod.dto';

@ApiTags('EOD Real Time Data')
@Controller('eod/real-time')
export class EODRealTimeController {
  constructor(
    private readonly getEODDelayedDataUseCase: GetEODDelayedDataUseCase,
    private readonly getEODRealTimeDataUseCase: GetEODRealTimeDataUseCase,
  ) {}

  @Get('delayed')
  @ApiOperation({ summary: 'Obtiene datos con retraso de un símbolo' })
  @ApiResponse({ status: 200, description: 'Datos con retraso obtenidos exitosamente' })
  @ApiResponse({ status: 400, description: 'Error en la petición' })
  @ApiQuery({ name: 'symbol', description: 'Símbolo del activo (ej: AAPL.US)', required: true })
  @ApiQuery({ name: 'multiTickers', description: 'Símbolos adicionales separados por coma', required: false })
  async getDelayedData(@Query(ValidationPipe) dto: GetDelayedDataDto) {
    return this.getEODDelayedDataUseCase.execute(dto);
  }

  @Post('subscribe')
  @ApiOperation({ summary: 'Suscribe a símbolos para datos en tiempo real (usar WebSocket /realtime)' })
  @ApiResponse({ status: 200, description: 'Información sobre suscripción WebSocket' })
  @ApiResponse({ status: 400, description: 'Error en la petición' })
  @ApiBody({ type: GetRealTimeDataDto })
  async subscribeToSymbols(@Body(ValidationPipe) dto: GetRealTimeDataDto) {
    return {
      message: 'Para datos en tiempo real, use el WebSocket en /realtime namespace',
      instructions: {
        endpoint: 'ws://localhost:3000/realtime',
        authentication: 'Bearer token en header Authorization o query param token',
        subscribe: { event: 'subscribe', data: { symbols: dto.symbols } },
        unsubscribe: { event: 'unsubscribe', data: { symbols: dto.symbols } },
        listen: 'Escuchar evento "market_data" para recibir actualizaciones',
      },
      symbols: dto.symbols,
    };
  }

  @Post('unsubscribe')
  @ApiOperation({ summary: 'Desuscribe de símbolos (usar WebSocket /realtime)' })
  @ApiResponse({ status: 200, description: 'Información sobre desuscripción WebSocket' })
  @ApiResponse({ status: 400, description: 'Error en la petición' })
  @ApiBody({ type: GetRealTimeDataDto })
  async unsubscribeFromSymbols(@Body(ValidationPipe) dto: GetRealTimeDataDto) {
    return {
      message: 'Para desuscribirse, use el WebSocket en /realtime namespace',
      instructions: {
        endpoint: 'ws://localhost:3000/realtime',
        unsubscribe: { event: 'unsubscribe', data: { symbols: dto.symbols } },
      },
      symbols: dto.symbols,
    };
  }

  @Get('status')
  @ApiOperation({ summary: 'Información sobre el WebSocket de tiempo real' })
  @ApiResponse({ status: 200, description: 'Información obtenida exitosamente' })
  async getConnectionStatus() {
    return {
      message: 'WebSocket de tiempo real disponible en /realtime namespace',
      endpoint: 'ws://localhost:3000/realtime',
      authentication: 'Bearer token requerido',
      events: {
        subscribe: 'Suscribirse a símbolos',
        unsubscribe: 'Desuscribirse de símbolos',
        ping: 'Mantener conexión activa',
        heartbeat: 'Heartbeat del cliente',
      },
      listen: {
        connected: 'Conexión establecida',
        market_data: 'Datos de mercado en tiempo real',
        subscribed: 'Confirmación de suscripción',
        unsubscribed: 'Confirmación de desuscripción',
        error: 'Errores de conexión o autenticación',
      },
    };
  }

  @Get('data')
  @ApiOperation({ summary: 'Obtiene datos en tiempo real (simulados con datos con retraso)' })
  @ApiResponse({ status: 200, description: 'Datos obtenidos exitosamente' })
  @ApiQuery({ name: 'symbols', description: 'Símbolos separados por coma', required: true })
  async getRealTimeData(@Query(ValidationPipe) dto: GetRealTimeDataDto) {
    return this.getEODRealTimeDataUseCase.execute(dto);
  }
}
