import { Injectable, OnModuleInit, Inject, forwardRef } from '@nestjs/common';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { EodWebSocketService, EodMarketData } from './eod-websocket.service';
import { ClientSessionService } from './client-session.service';
import { SubscriptionService } from './subscription.service';
import { MarketDataTransformerService } from '../../market-data/services/market-data-transformer.service';

@Injectable()
export class WebSocketCoordinatorService implements OnModuleInit {
  constructor(
    @InjectPinoLogger(WebSocketCoordinatorService.name)
    private readonly logger: PinoLogger,
    private readonly eodWebSocketService: EodWebSocketService,
    private readonly clientSessionService: ClientSessionService,
    private readonly subscriptionService: SubscriptionService,
    private readonly marketDataTransformer: MarketDataTransformerService,
  ) {}

  async onModuleInit(): Promise<void> {
    // Configurar callback para datos de EOD
    this.eodWebSocketService.setDataCallback((data: EodMarketData) => {
      this.handleEodMarketData(data);
    });

    this.logger.info(
      `[WebSocketCoordinatorService.onModuleInit] WebSocket coordinator initialized`,
    );
  }

  async handleClientSubscribe(
    clientId: string,
    symbols: string[],
  ): Promise<void> {
    try {
      this.logger.info(
        `[WebSocketCoordinatorService.handleClientSubscribe] Starting subscription process for client ${clientId} with symbols: ${symbols.join(', ')}`,
      );

      // Agregar suscripciones del cliente
      await this.subscriptionService.addClientSubscriptions(clientId, symbols);

      // Obtener todas las suscripciones activas
      const activeSubscriptions =
        await this.subscriptionService.getActiveSubscriptions();

      this.logger.info(
        `[WebSocketCoordinatorService.handleClientSubscribe] Active subscriptions: ${activeSubscriptions.length}`,
      );

      // Conectar a EOD si no está conectado
      if (
        activeSubscriptions.length > 0 &&
        !this.eodWebSocketService.isConnectedToEod()
      ) {
        this.logger.info(
          `[WebSocketCoordinatorService.handleClientSubscribe] Connecting to EOD for ${activeSubscriptions.length} symbols`,
        );
        await this.eodWebSocketService.connect(activeSubscriptions);
      } else if (activeSubscriptions.length > 0) {
        // Actualizar suscripciones si ya está conectado
        this.logger.info(
          `[WebSocketCoordinatorService.handleClientSubscribe] Updating EOD subscriptions`,
        );
        await this.eodWebSocketService.updateSubscriptions(activeSubscriptions);
      }

      this.logger.info(
        `[WebSocketCoordinatorService.handleClientSubscribe] Client ${clientId} subscribed to ${symbols.length} symbols`,
      );
    } catch (error) {
      this.logger.error(
        `[WebSocketCoordinatorService.handleClientSubscribe] Error handling client subscribe: ${error.message}`,
      );
      throw error;
    }
  }

  async handleClientUnsubscribe(
    clientId: string,
    symbols?: string[],
  ): Promise<void> {
    try {
      // Remover suscripciones del cliente
      await this.subscriptionService.removeClientSubscriptions(
        clientId,
        symbols,
      );

      // Obtener todas las suscripciones activas
      const activeSubscriptions =
        await this.subscriptionService.getActiveSubscriptions();

      // Desconectar de EOD si no hay más suscripciones
      if (
        activeSubscriptions.length === 0 &&
        this.eodWebSocketService.isConnectedToEod()
      ) {
        this.logger.info(
          `[WebSocketCoordinatorService.handleClientUnsubscribe] No more subscriptions, disconnecting from EOD`,
        );
        await this.eodWebSocketService.disconnect();
      } else if (activeSubscriptions.length > 0) {
        // Actualizar suscripciones si aún hay otras activas
        this.logger.info(
          `[WebSocketCoordinatorService.handleClientUnsubscribe] Updating EOD subscriptions`,
        );
        await this.eodWebSocketService.updateSubscriptions(activeSubscriptions);
      }

      this.logger.info(
        `[WebSocketCoordinatorService.handleClientUnsubscribe] Client ${clientId} unsubscribed from symbols`,
      );
    } catch (error) {
      this.logger.error(
        `[WebSocketCoordinatorService.handleClientUnsubscribe] Error handling client unsubscribe: ${error.message}`,
      );
      throw error;
    }
  }

  async handleClientDisconnect(clientId: string): Promise<void> {
    try {
      // Limpiar todas las suscripciones del cliente
      await this.subscriptionService.cleanupClientSubscriptions(clientId);

      // Obtener todas las suscripciones activas restantes
      const activeSubscriptions =
        await this.subscriptionService.getActiveSubscriptions();

      // Desconectar de EOD si no hay más suscripciones
      if (
        activeSubscriptions.length === 0 &&
        this.eodWebSocketService.isConnectedToEod()
      ) {
        this.logger.info(
          `[WebSocketCoordinatorService.handleClientDisconnect] No more subscriptions, disconnecting from EOD`,
        );
        await this.eodWebSocketService.disconnect();
      }

      this.logger.info(
        `[WebSocketCoordinatorService.handleClientDisconnect] Client ${clientId} disconnected and cleaned up`,
      );
    } catch (error) {
      this.logger.error(
        `[WebSocketCoordinatorService.handleClientDisconnect] Error handling client disconnect: ${error.message}`,
      );
    }
  }

  private async handleEodMarketData(data: EodMarketData): Promise<void> {
    try {
      this.logger.info(
        `[WebSocketCoordinatorService.handleEodMarketData] 📊 Received market data from EOD: ${JSON.stringify(data)}`,
      );

      // Obtener todos los suscriptores para este símbolo
      const subscribers =
        await this.subscriptionService.getSubscribersForSymbol(data.s);

      this.logger.info(
        `[WebSocketCoordinatorService.handleEodMarketData] Found ${subscribers.length} subscribers for symbol ${data.s}`,
      );

      if (subscribers.length === 0) {
        this.logger.warn(
          `[WebSocketCoordinatorService.handleEodMarketData] No subscribers for symbol ${data.s}`,
        );
        return;
      }

      // ✅ USAR EL TRANSFORMADOR para convertir datos EOD a formato del usuario
      const transformedData = await this.marketDataTransformer.transformEodToUserFormat({
        s: data.s,
        a: data.a,
        b: data.b,
        timestamp: data.timestamp,
      });

      this.logger.info(
        `[WebSocketCoordinatorService.handleEodMarketData] Transformed data: ${JSON.stringify(transformedData)}`,
      );

      await this.broadcastToSubscribers(data.s, transformedData);

      this.logger.info(
        `[WebSocketCoordinatorService.handleEodMarketData] ✅ Broadcasted transformed data for ${data.s} to ${subscribers.length} subscribers`,
      );
    } catch (error) {
      this.logger.error(
        `[WebSocketCoordinatorService.handleEodMarketData] Error handling market data: ${error.message}`,
      );
    }
  }

  private async broadcastToSubscribers(
    symbol: string,
    data: any,
  ): Promise<void> {
    const subscribers =
      await this.subscriptionService.getSubscribersForSymbol(symbol);

    this.logger.info(
      `[WebSocketCoordinatorService.broadcastToSubscribers] Broadcasting to ${subscribers.length} subscribers for symbol ${symbol}`,
    );

    for (const clientId of subscribers) {
      const session = await this.clientSessionService.getClient(clientId);
      if (session && session.socket) {
        this.logger.info(
          `[WebSocketCoordinatorService.broadcastToSubscribers] Sending data to client ${clientId}`,
        );
        
        session.socket.emit('market_data', {
          symbol,
          data,
          timestamp: Date.now(),
        });
      } else {
        this.logger.warn(
          `[WebSocketCoordinatorService.broadcastToSubscribers] No active session found for client ${clientId}`,
        );
      }
    }
  }

  async getSystemStatus(): Promise<{
    eodConnected: boolean;
    activeSubscriptions: string[];
    totalClients: number;
    totalSubscribers: number;
    subscriptionStats: any;
  }> {
    const activeSubscriptions =
      await this.subscriptionService.getActiveSubscriptions();
    const subscriptionStats =
      await this.subscriptionService.getSubscriptionStats();
    const totalClients =
      await this.clientSessionService.getActiveClientsCount();

    return {
      eodConnected: this.eodWebSocketService.isConnectedToEod(),
      activeSubscriptions,
      totalClients,
      totalSubscribers: subscriptionStats.totalSubscribers,
      subscriptionStats,
    };
  }

  async getClientStatus(clientId: string): Promise<{
    connected: boolean;
    subscriptions: string[];
    userInfo?: {
      userId: string;
      email: string;
      connectedAt: Date;
    };
  }> {
    const session = await this.clientSessionService.getClient(clientId);
    const subscriptions =
      await this.subscriptionService.getClientSubscriptions(clientId);

    return {
      connected: !!session,
      subscriptions,
      userInfo: session
        ? {
            userId: session.userId,
            email: session.email,
            connectedAt: session.connectedAt,
          }
        : undefined,
    };
  }

  async cleanupInactiveClients(): Promise<number> {
    const cleanedCount =
      await this.clientSessionService.cleanupInactiveClients();

    if (cleanedCount > 0) {
      // Verificar si necesitamos desconectar de EOD
      const activeSubscriptions =
        await this.subscriptionService.getActiveSubscriptions();

      if (
        activeSubscriptions.length === 0 &&
        this.eodWebSocketService.isConnectedToEod()
      ) {
        await this.eodWebSocketService.disconnect();
      }
    }

    return cleanedCount;
  }
}
