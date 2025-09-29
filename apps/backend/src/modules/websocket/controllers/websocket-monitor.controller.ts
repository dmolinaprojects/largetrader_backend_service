import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import {
  ApiOperation,
  ApiTags,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { WebSocketCoordinatorService } from '../services/websocket-coordinator.service';
import { TickerMonitorService } from '../services/ticker-monitor.service';

@ApiTags('WebSocket Monitor')
@Controller('websocket')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('Authorization')
export class WebSocketMonitorController {
  constructor(
    @InjectPinoLogger(WebSocketMonitorController.name)
    private readonly logger: PinoLogger,
    private readonly webSocketCoordinator: WebSocketCoordinatorService,
    private readonly tickerMonitorService: TickerMonitorService,
  ) {}

  @ApiOperation({
    summary: 'Get WebSocket system status',
    description:
      'Endpoint to monitor WebSocket system status and its connections',
  })
  @ApiResponse({
    status: 200,
    description: 'System status retrieved successfully',
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
    this.logger.info(
      `[WebSocketMonitorController.getSystemStatus] Getting system status`,
    );

    const status = await this.webSocketCoordinator.getSystemStatus();

    this.logger.info(
      `[WebSocketMonitorController.getSystemStatus] System status retrieved: ${JSON.stringify(status)}`,
    );

    return status;
  }

  @ApiOperation({
    summary: 'Get WebSocket health statistics',
    description:
      'Endpoint to get detailed health statistics and connection information',
  })
  @ApiResponse({
    status: 200,
    description: 'Health statistics retrieved successfully',
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
  @Get('health')
  async getHealthStats() {
    this.logger.info(
      `[WebSocketMonitorController.getHealthStats] Getting WebSocket health statistics`,
    );

    const status = await this.webSocketCoordinator.getSystemStatus();

    this.logger.info(
      `[WebSocketMonitorController.getHealthStats] Health stats retrieved: ${JSON.stringify(status)}`,
    );

    return status;
  }

  @ApiOperation({
    summary: 'Get TickerMonitor status',
    description: 'Get the current status of the TickerMonitor service',
  })
  @ApiResponse({
    status: 200,
    description: 'TickerMonitor status retrieved successfully',
  })
  @Get('ticker-monitor/status')
  async getTickerMonitorStatus() {
    this.logger.info(
      `[WebSocketMonitorController.getTickerMonitorStatus] Getting TickerMonitor status`,
    );

    const status = this.tickerMonitorService.getMonitoringStatus();

    this.logger.info(
      `[WebSocketMonitorController.getTickerMonitorStatus] TickerMonitor status: ${JSON.stringify(status)}`,
    );

    return status;
  }


  @ApiOperation({
    summary: 'Update ticker last access',
    description: 'Manually update a ticker last access time',
  })
  @ApiResponse({
    status: 200,
    description: 'Ticker last access updated successfully',
  })
  @Post('ticker-monitor/update-ticker/:ticker')
  async updateTickerLastAccess(ticker: string) {
    this.logger.info(
      `[WebSocketMonitorController.updateTickerLastAccess] Updating ticker: ${ticker}`,
    );

    await this.tickerMonitorService.updateTickerLastAccess(ticker);

    this.logger.info(
      `[WebSocketMonitorController.updateTickerLastAccess] Ticker ${ticker} updated successfully`,
    );

    return { message: `Ticker ${ticker} last access updated successfully` };
  }
}
