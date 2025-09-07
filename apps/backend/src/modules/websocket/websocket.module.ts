import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { WebSocketGateway, WebSocketServer, SubscribeMessage, OnGatewayConnection, OnGatewayDisconnect, ConnectedSocket, MessageBody } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { EodWebSocketService } from './services/eod-websocket.service';
import { ClientSessionService } from './services/client-session.service';
import { SubscriptionService } from './services/subscription.service';
import { WebSocketCoordinatorService } from './services/websocket-coordinator.service';
import { WebSocketMonitorController } from './controllers/websocket-monitor.controller';
import { SharedModule } from '@app/shared';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: '/realtime',
})
export class RealtimeGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    @InjectPinoLogger(RealtimeGateway.name)
    private readonly logger: PinoLogger,
    private readonly jwtService: JwtService,
    private readonly clientSessionService: ClientSessionService,
    private readonly subscriptionService: SubscriptionService,
    private readonly eodWebSocketService: EodWebSocketService,
    private readonly webSocketCoordinator: WebSocketCoordinatorService,
  ) {}

  async handleConnection(client: Socket) {
    try {
      // Extraer token del handshake
      const token = this.extractTokenFromHandshake(client);
      
      if (!token) {
        this.logger.warn(`[RealtimeGateway.handleConnection] No token provided for client ${client.id}`);
        client.disconnect();
        return;
      }

      // Verificar token JWT
      const payload = this.jwtService.verify(token);
      
      // Registrar sesión del cliente
      await this.clientSessionService.addClient(client.id, {
        userId: payload.sub,
        email: payload.email,
        socket: client,
        connectedAt: new Date(),
      });

      this.logger.info(`[RealtimeGateway.handleConnection] Client ${client.id} connected for user ${payload.email}`);
      
      // Enviar confirmación de conexión
      client.emit('connected', {
        message: 'Connected to realtime data stream',
        clientId: client.id,
        userId: payload.sub,
      });

    } catch (error) {
      this.logger.error(`[RealtimeGateway.handleConnection] Authentication failed for client ${client.id}: ${error.message}`);
      client.disconnect();
    }
  }

  async handleDisconnect(client: Socket) {
    try {
      const session = await this.clientSessionService.getClient(client.id);
      
      if (session) {
        // Usar el coordinador para manejar la desconexión
        await this.webSocketCoordinator.handleClientDisconnect(client.id);
        
        // Remover sesión del cliente
        await this.clientSessionService.removeClient(client.id);
        
        this.logger.info(`[RealtimeGateway.handleDisconnect] Client ${client.id} disconnected for user ${session.email}`);
      }

    } catch (error) {
      this.logger.error(`[RealtimeGateway.handleDisconnect] Error handling disconnect for client ${client.id}: ${error.message}`);
    }
  }

  @SubscribeMessage('subscribe')
  async handleSubscribe(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { symbols: string[] },
  ) {
    try {
      const session = await this.clientSessionService.getClient(client.id);
      
      if (!session) {
        client.emit('error', { message: 'Client session not found' });
        return;
      }

      this.logger.info(`[RealtimeGateway.handleSubscribe] Client ${client.id} subscribing to symbols: ${data.symbols.join(', ')}`);

      // Usar el coordinador para manejar la suscripción
      await this.webSocketCoordinator.handleClientSubscribe(client.id, data.symbols);

      // Confirmar suscripción
      client.emit('subscribed', {
        symbols: data.symbols,
        message: 'Successfully subscribed to symbols',
      });

    } catch (error) {
      this.logger.error(`[RealtimeGateway.handleSubscribe] Error subscribing client ${client.id}: ${error.message}`);
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

      this.logger.info(`[RealtimeGateway.handleUnsubscribe] Client ${client.id} unsubscribing from symbols: ${data.symbols.join(', ')}`);

      // Usar el coordinador para manejar la desuscripción
      await this.webSocketCoordinator.handleClientUnsubscribe(client.id, data.symbols);

      // Confirmar desuscripción
      client.emit('unsubscribed', {
        symbols: data.symbols,
        message: 'Successfully unsubscribed from symbols',
      });

    } catch (error) {
      this.logger.error(`[RealtimeGateway.handleUnsubscribe] Error unsubscribing client ${client.id}: ${error.message}`);
      client.emit('error', { message: 'Failed to unsubscribe from symbols' });
    }
  }

  @SubscribeMessage('ping')
  handlePing(@ConnectedSocket() client: Socket) {
    client.emit('pong', { timestamp: Date.now() });
  }

  private extractTokenFromHandshake(client: Socket): string | null {
    const authHeader = client.handshake.headers.authorization;
    if (!authHeader) {
      return null;
    }

    const [type, token] = authHeader.split(' ');
    return type === 'Bearer' ? token : null;
  }


  // Método para difundir datos a clientes suscritos
  async broadcastToSubscribers(symbol: string, data: any) {
    const subscribers = await this.subscriptionService.getSubscribersForSymbol(symbol);
    
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
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_ACCESS_SECRET') || 'default-secret',
        signOptions: { expiresIn: '15m' },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [
    WebSocketMonitorController,
  ],
  providers: [
    EodWebSocketService,
    ClientSessionService,
    SubscriptionService,
    WebSocketCoordinatorService,
  ],
  exports: [
    EodWebSocketService,
    ClientSessionService,
    SubscriptionService,
    WebSocketCoordinatorService,
  ],
})
export class WebSocketModule {}
