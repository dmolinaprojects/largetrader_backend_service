import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { WebSocketCoordinatorService } from '../services/websocket-coordinator.service';

@ApiTags('WebSocket Monitor')
@Controller('websocket')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('Authorization')
export class WebSocketMonitorController {
  constructor(
    @InjectPinoLogger(WebSocketMonitorController.name)
    private readonly logger: PinoLogger,
    private readonly webSocketCoordinator: WebSocketCoordinatorService,
  ) {}

  @ApiOperation({
    summary: 'Obtener estado del sistema WebSocket',
    description: 'Endpoint para monitorear el estado del sistema WebSocket y sus conexiones',
  })
  @ApiResponse({
    status: 200,
    description: 'Estado del sistema obtenido exitosamente',
    schema: {
      type: 'object',
      properties: {
        eodConnected: { type: 'boolean' },
        activeSubscriptions: { type: 'array', items: { type: 'string' } },
        totalClients: { type: 'number' },
        totalSubscribers: { type: 'number' },
        subscriptionStats: {
          type: 'object',
          properties: {
            totalSymbols: { type: 'number' },
            totalSubscribers: { type: 'number' },
            symbolsWithSubscribers: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  symbol: { type: 'string' },
                  subscriberCount: { type: 'number' },
                  subscribedAt: { type: 'string', format: 'date-time' },
                },
              },
            },
            clientsWithSubscriptions: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  clientId: { type: 'string' },
                  subscriptionCount: { type: 'number' },
                },
              },
            },
          },
        },
      },
    },
  })
  @Get('status')
  async getSystemStatus() {
    this.logger.info(`[WebSocketMonitorController.getSystemStatus] Getting system status`);
    
    const status = await this.webSocketCoordinator.getSystemStatus();
    
    this.logger.info(`[WebSocketMonitorController.getSystemStatus] System status retrieved: ${JSON.stringify(status)}`);
    
    return status;
  }

  @ApiOperation({
    summary: 'Limpiar clientes inactivos',
    description: 'Endpoint para limpiar clientes WebSocket inactivos del sistema',
  })
  @ApiResponse({
    status: 200,
    description: 'Clientes inactivos limpiados exitosamente',
    schema: {
      type: 'object',
      properties: {
        cleanedCount: { type: 'number' },
        message: { type: 'string' },
      },
    },
  })
  @Get('cleanup')
  async cleanupInactiveClients() {
    this.logger.info(`[WebSocketMonitorController.cleanupInactiveClients] Starting cleanup of inactive clients`);
    
    const cleanedCount = await this.webSocketCoordinator.cleanupInactiveClients();
    
    this.logger.info(`[WebSocketMonitorController.cleanupInactiveClients] Cleaned up ${cleanedCount} inactive clients`);
    
    return {
      cleanedCount,
      message: `Cleaned up ${cleanedCount} inactive clients`,
    };
  }
}
