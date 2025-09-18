import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { EventEmitterModule } from '@nestjs/event-emitter';
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { EodWebSocketService } from './services/eod-websocket.service';
import { ClientSessionService } from './services/client-session.service';
import { SubscriptionService } from './services/subscription.service';
import { WebSocketCoordinatorService } from './services/websocket-coordinator.service';
import { TickerMonitorService } from './services/ticker-monitor.service';
import { WebSocketMonitorController } from './controllers/websocket-monitor.controller';
import { MarketDataTransformerService } from '../market-data/services/market-data-transformer.service';
import { SharedModule } from '../../shared/shared.module';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { TokenService } from '../../shared/token/token-service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: '/realtime',
})
export class RealtimeGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  constructor(
    @InjectPinoLogger(RealtimeGateway.name)
    private readonly logger: PinoLogger,
    private readonly tokenService: TokenService,
    private readonly clientSessionService: ClientSessionService,
    private readonly subscriptionService: SubscriptionService,
    private readonly eodWebSocketService: EodWebSocketService,
    private readonly webSocketCoordinator: WebSocketCoordinatorService,
  ) {
    this.logger.info('[RealtimeGateway] WebSocket Gateway initialized');
  }

  async handleConnection(client: Socket) {
    try {
      this.logger.info(
        `[RealtimeGateway.handleConnection] New client attempting connection: ${client.id}`,
      );

      // Extraer token del handshake
      const token = this.extractTokenFromHandshake(client);

      if (!token) {
        this.logger.warn(
          `[RealtimeGateway.handleConnection] No token provided for client ${client.id}`,
        );
        client.emit('error', { 
          message: 'Authentication required. Please provide a valid token.',
          code: 'NO_TOKEN' 
        });
        client.disconnect();
        return;
      }

      this.logger.debug(
        `[RealtimeGateway.handleConnection] Token found for client ${client.id}`,
      );

      // Verificar token JWT
      const payload = this.tokenService.validateToken(token, 'access');

      this.logger.debug(
        `[RealtimeGateway.handleConnection] Token validated for client ${client.id}, user: ${payload.email}`,
      );

      // Registrar sesión del cliente
      await this.clientSessionService.addClient(client.id, {
        userId: payload.sub,
        email: payload.email,
        socket: client,
        connectedAt: new Date(),
        lastActivity: new Date(),
      });

      // Configurar timeout de inactividad (30 minutos)
      this.setupInactivityTimeout(client);

      this.logger.info(
        `[RealtimeGateway.handleConnection] Client ${client.id} connected for user ${payload.email}`,
      );

      // Enviar confirmación de conexión
      client.emit('connected', {
        message: 'Connected to realtime data stream',
        clientId: client.id,
        userId: payload.sub,
        timestamp: Date.now(),
      });
    } catch (error) {
      this.logger.error(
        `[RealtimeGateway.handleConnection] Authentication failed for client ${client.id}: ${error.message}`,
      );
      
      // Enviar error específico antes de desconectar
      client.emit('error', { 
        message: 'Authentication failed. Please check your token.',
        code: 'AUTH_FAILED',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
      
      client.disconnect();
    }
  }

  async handleDisconnect(client: Socket) {
    await this.handleClientDisconnect(client);
  }

  @SubscribeMessage('subscribe')
  async handleSubscribe(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { symbols: string[] },
  ) {
    try {
      this.logger.info(
        `[RealtimeGateway.handleSubscribe] Received subscription request from client ${client.id} for symbols: ${JSON.stringify(data)}`,
      );

      const session = await this.clientSessionService.getClient(client.id);

      if (!session) {
        this.logger.warn(
          `[RealtimeGateway.handleSubscribe] Client session not found for client ${client.id}`,
        );
        client.emit('error', { message: 'Client session not found' });
        return;
      }

      this.logger.info(
        `[RealtimeGateway.handleSubscribe] Client ${client.id} subscribing to symbols: ${data.symbols.join(', ')}`,
      );

      // Usar el coordinador para manejar la suscripción
      await this.webSocketCoordinator.handleClientSubscribe(
        client.id,
        data.symbols,
      );

      this.logger.info(
        `[RealtimeGateway.handleSubscribe] Successfully processed subscription for client ${client.id}`,
      );

      // Confirmar suscripción
      client.emit('subscribed', {
        symbols: data.symbols,
        message: 'Successfully subscribed to symbols',
      });
    } catch (error) {
      this.logger.error(
        `[RealtimeGateway.handleSubscribe] Error subscribing client ${client.id}: ${error.message}`,
      );
      client.emit('error', { message: 'Failed to subscribe to symbols' });
    }
  }

  @SubscribeMessage('unsubscribe')
  async handleUnsubscribe(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { symbols: string[] },
  ) {
    try {
      const session = await this.clientSessionService.getClient(client.id);

      if (!session) {
        client.emit('error', { message: 'Client session not found' });
        return;
      }

      this.logger.info(
        `[RealtimeGateway.handleUnsubscribe] Client ${client.id} unsubscribing from symbols: ${data.symbols.join(', ')}`,
      );

      // Usar el coordinador para manejar la desuscripción
      await this.webSocketCoordinator.handleClientUnsubscribe(
        client.id,
        data.symbols,
      );

      // Confirmar desuscripción
      client.emit('unsubscribed', {
        symbols: data.symbols,
        message: 'Successfully unsubscribed from symbols',
      });
    } catch (error) {
      this.logger.error(
        `[RealtimeGateway.handleUnsubscribe] Error unsubscribing client ${client.id}: ${error.message}`,
      );
      client.emit('error', { message: 'Failed to unsubscribe from symbols' });
    }
  }

  @SubscribeMessage('ping')
  async handlePing(@ConnectedSocket() client: Socket) {
    try {
      // Actualizar última actividad
      await this.clientSessionService.updateLastActivity(client.id);
      
      client.emit('pong', { timestamp: Date.now() });
    } catch (error) {
      this.logger.error(
        `[RealtimeGateway.handlePing] Error handling ping for client ${client.id}: ${error.message}`,
      );
    }
  }

  @SubscribeMessage('heartbeat')
  async handleHeartbeat(@ConnectedSocket() client: Socket) {
    try {
      // Actualizar última actividad
      await this.clientSessionService.updateLastActivity(client.id);
      
      this.logger.debug(
        `[RealtimeGateway.handleHeartbeat] Heartbeat received from client ${client.id}`,
      );
    } catch (error) {
      this.logger.error(
        `[RealtimeGateway.handleHeartbeat] Error handling heartbeat for client ${client.id}: ${error.message}`,
      );
    }
  }

  private extractTokenFromHandshake(client: Socket): string | null {
    // Intentar extraer token del header Authorization
    const authHeader = client.handshake.headers.authorization;
    if (authHeader) {
      const [type, token] = authHeader.split(' ');
      if (type === 'Bearer' && token) {
        return token;
      }
    }

    // Intentar extraer token del auth object (Socket.IO auth)
    const authToken = client.handshake.auth?.token as string;
    if (authToken) {
      return authToken;
    }

    // Intentar extraer token del query parameter
    const tokenFromQuery = client.handshake.query.token as string;
    if (tokenFromQuery) {
      return tokenFromQuery;
    }

    return null;
  }

  private setupInactivityTimeout(client: Socket): void {
    const INACTIVITY_TIMEOUT = 30 * 60 * 1000; // 30 minutos

    const timeout = setTimeout(async () => {
      try {
        const session = await this.clientSessionService.getClient(client.id);
        
        if (session) {
          const lastActivity = session.lastActivity || session.connectedAt;
          const timeSinceActivity = Date.now() - lastActivity.getTime();
          
          if (timeSinceActivity >= INACTIVITY_TIMEOUT) {
            this.logger.warn(
              `[RealtimeGateway.setupInactivityTimeout] Client ${client.id} inactive for ${Math.round(timeSinceActivity / 60000)} minutes, disconnecting`,
            );
            
            // Desconectar cliente inactivo
            await this.handleClientDisconnect(client);
            client.disconnect();
          }
        }
      } catch (error) {
        this.logger.error(
          `[RealtimeGateway.setupInactivityTimeout] Error checking inactivity for client ${client.id}: ${error.message}`,
        );
      }
    }, INACTIVITY_TIMEOUT);

    // Limpiar timeout cuando el cliente se desconecte
    client.on('disconnect', () => {
      clearTimeout(timeout);
    });
  }

  private async handleClientDisconnect(client: Socket): Promise<void> {
    try {
      const session = await this.clientSessionService.getClient(client.id);

      if (session) {
        // Usar el coordinador para manejar la desconexión
        await this.webSocketCoordinator.handleClientDisconnect(client.id);

        // Remover sesión del cliente
        await this.clientSessionService.removeClient(client.id);

        this.logger.info(
          `[RealtimeGateway.handleClientDisconnect] Client ${client.id} disconnected for user ${session.email}`,
        );
      }
    } catch (error) {
      this.logger.error(
        `[RealtimeGateway.handleClientDisconnect] Error handling disconnect for client ${client.id}: ${error.message}`,
      );
    }
  }

  // Método para difundir datos a clientes suscritos
  async broadcastToSubscribers(symbol: string, data: any) {
    const subscribers =
      await this.subscriptionService.getSubscribersForSymbol(symbol);

    for (const clientId of subscribers) {
      const session = await this.clientSessionService.getClient(clientId);
      if (session && session.socket) {
        session.socket.emit('market_data', {
          symbol,
          data,
          timestamp: Date.now(),
        });
      }
    }
  }
}

@Module({
  imports: [
    SharedModule,
    ScheduleModule.forRoot(),
    EventEmitterModule.forRoot(),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret:
          configService.get<string>('JWT_ACCESS_SECRET') || 'default-secret',
        signOptions: { expiresIn: '15m' },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [WebSocketMonitorController],
  providers: [
    RealtimeGateway,
    EodWebSocketService,
    ClientSessionService,
    SubscriptionService,
    WebSocketCoordinatorService,
    TickerMonitorService,
    MarketDataTransformerService,
  ],
  exports: [
    RealtimeGateway,
    EodWebSocketService,
    ClientSessionService,
    SubscriptionService,
    WebSocketCoordinatorService,
    TickerMonitorService,
    MarketDataTransformerService,
  ],
})
export class WebSocketModule {}
