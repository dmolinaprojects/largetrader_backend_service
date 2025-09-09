import { Controller, Get, UseGuards } from '@nestjs/common';
import {
  ApiOperation,
  ApiTags,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
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
}
