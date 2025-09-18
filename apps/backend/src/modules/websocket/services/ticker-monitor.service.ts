import { Injectable, OnModuleInit, OnModuleDestroy, Inject } from '@nestjs/common';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { ConfigService } from '@nestjs/config';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ClientSessionService, ClientSession } from './client-session.service';
import { SubscriptionService } from './subscription.service';
import { WebSocketCoordinatorService } from './websocket-coordinator.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { RealTimeDataRepository } from '@app/shared/domain/repositories/stocks/real-time-data.repository';
import { LogLastTickersRepository } from '@app/shared/domain/repositories/users/log-last-tickers.repository';

export interface TickerMonitorConfig {
  /**
   * Intervalo en minutos para considerar un ticker como "activo"
   * Si un ticker fue consultado hace menos de este tiempo, debe estar suscrito
   */
  activeThresholdMinutes: number;
  
  /**
   * Si está habilitado el monitoreo automático
   */
  enabled: boolean;
}

/**
 * Cliente WebSocket virtual que actúa como un cliente normal
 * pero está controlado por el sistema para monitorear tickers activos
 */
class VirtualWebSocketClient extends EventEmitter2 {
  public readonly id: string;
  private isConnected = false;

  constructor(clientId: string, private readonly logger: PinoLogger) {
    super();
    this.id = clientId;
  }

  // Simular métodos de Socket.io para compatibilidad
  emit(event: string, data?: any): boolean {
    this.logger.debug(
      `[VirtualWebSocketClient.emit] Virtual client ${this.id} emitting: ${event}`,
    );
    
    // Emitir el evento usando EventEmitter2
    super.emit(event, data);
    return true;
  }

  on(event: string, listener: (...args: any[]) => void): this {
    this.logger.debug(
      `[VirtualWebSocketClient.on] Virtual client ${this.id} listening to: ${event}`,
    );
    
    super.on(event, listener);
    return this;
  }

  connect(): void {
    this.isConnected = true;
    this.logger.info(
      `[VirtualWebSocketClient.connect] Virtual client ${this.id} connected`,
    );
    this.emit('connected');
  }

  disconnect(): void {
    this.isConnected = false;
    this.logger.info(
      `[VirtualWebSocketClient.disconnect] Virtual client ${this.id} disconnected`,
    );
    this.emit('disconnected');
  }

  isConnectedToServer(): boolean {
    return this.isConnected;
  }
}

@Injectable()
export class TickerMonitorService implements OnModuleInit, OnModuleDestroy {
  private config: TickerMonitorConfig;
  private virtualClient: VirtualWebSocketClient | null = null;
  private readonly VIRTUAL_CLIENT_ID = 'SYSTEM_TICKER_MONITOR';
  private readonly VIRTUAL_USER_EMAIL = 'system@ticker-monitor.internal';
  private currentSubscriptions = new Set<string>();

  constructor(
    @InjectPinoLogger(TickerMonitorService.name)
    private readonly logger: PinoLogger,
    private readonly configService: ConfigService,
    @Inject('LogLastTickersRepository')
    private readonly logLastTickersRepository: LogLastTickersRepository,
    private readonly clientSessionService: ClientSessionService,
    private readonly subscriptionService: SubscriptionService,
    private readonly webSocketCoordinator: WebSocketCoordinatorService,
  ) {
    // Configuración por defecto - puedes parametrizarla desde variables de entorno
    this.config = {
      activeThresholdMinutes: this.configService.get<number>('TICKER_ACTIVE_THRESHOLD_MINUTES') || 5,
      enabled: this.configService.get<boolean>('TICKER_MONITOR_ENABLED') !== false, // Por defecto habilitado
    };
  }

  async onModuleInit(): Promise<void> {
    this.logger.info(
      `[TickerMonitorService.onModuleInit] Initialized with config: ${JSON.stringify(this.config)}`,
    );

    if (this.config.enabled) {
      this.logger.info(
        `[TickerMonitorService.onModuleInit] Auto-monitoring enabled, creating virtual client`,
      );
      await this.createVirtualClient();
    } else {
      this.logger.warn(
        `[TickerMonitorService.onModuleInit] Auto-monitoring disabled`,
      );
    }
  }

  async onModuleDestroy(): Promise<void> {
    if (this.virtualClient) {
      await this.disconnectVirtualClient();
    }
    this.logger.info(
      `[TickerMonitorService.onModuleDestroy] Ticker monitoring service destroyed`,
    );
  }

  /**
   * Crea y conecta el cliente virtual al sistema WebSocket
   */
  private async createVirtualClient(): Promise<void> {
    try {
      this.logger.info(
        `[TickerMonitorService.createVirtualClient] Creating virtual WebSocket client`,
      );

      // Crear el cliente virtual
      this.virtualClient = new VirtualWebSocketClient(this.VIRTUAL_CLIENT_ID, this.logger);

      // Configurar listeners para recibir datos de mercado
      this.setupMarketDataListeners();

      // Registrar el cliente virtual en el sistema como una sesión normal
      const virtualSession: ClientSession = {
        userId: 'SYSTEM',
        email: this.VIRTUAL_USER_EMAIL,
        socket: this.virtualClient as any, // Cast necesario para compatibilidad
        connectedAt: new Date(),
        lastActivity: new Date(),
      };

      await this.clientSessionService.addClient(this.VIRTUAL_CLIENT_ID, virtualSession);

      // Conectar el cliente virtual
      this.virtualClient.connect();

      this.logger.info(
        `[TickerMonitorService.createVirtualClient] ✅ Virtual client created and connected`,
      );

    } catch (error) {
      this.logger.error(
        `[TickerMonitorService.createVirtualClient] Error creating virtual client: ${error.message}`,
      );
      throw error;
    }
  }

  /**
   * Configura los listeners para recibir datos de mercado
   */
  private setupMarketDataListeners(): void {
    if (!this.virtualClient) return;

    this.virtualClient.on('market_data', (data: any) => {
      this.handleMarketData(data);
    });

    this.virtualClient.on('subscribed', (data: any) => {
      this.logger.info(
        `[TickerMonitorService.setupMarketDataListeners] ✅ Virtual client subscribed to: ${JSON.stringify(data.symbols)}`,
      );
    });

    this.virtualClient.on('error', (error: any) => {
      this.logger.error(
        `[TickerMonitorService.setupMarketDataListeners] Virtual client error: ${JSON.stringify(error)}`,
      );
    });
  }

  /**
   * Maneja los datos de mercado recibidos
   */
  private handleMarketData(data: any): void {
    try {
      this.logger.info(
        `[TickerMonitorService.handleMarketData] 📊 Received market data for ${data.symbol}: ${JSON.stringify(data.data)}`,
      );

      // AQUÍ ES DONDE PUEDES PARAMETRIZAR EL ENVÍO DE DATOS
      // Este método se llama cada vez que llegan datos de mercado para los tickers monitoreados
      
      /*
      // EJEMPLO DE IMPLEMENTACIÓN - DESCOMENTA Y MODIFICA SEGÚN TUS NECESIDADES:
      
      // 1. Guardar en base de datos
      await this.saveMarketDataToDatabase(data.symbol, data.data);
      
      // 2. Enviar a una cola de mensajes
      await this.sendToMessageQueue(data.symbol, data.data);
      
      // 3. Procesar según reglas de negocio
      await this.processBusinessRules(data.symbol, data.data);
      
      // 4. Actualizar caché en tiempo real
      await this.updateRealTimeCache(data.symbol, data.data);
      
      // 5. Enviar notificaciones si se cumplen condiciones
      await this.checkAndSendNotifications(data.symbol, data.data);
      */

      this.logger.debug(
        `[TickerMonitorService.handleMarketData] Market data processed for ${data.symbol}`,
      );

    } catch (error) {
      this.logger.error(
        `[TickerMonitorService.handleMarketData] Error processing market data: ${error.message}`,
      );
    }
  }

  /**
   * Desconecta el cliente virtual
   */
  private async disconnectVirtualClient(): Promise<void> {
    if (!this.virtualClient) return;

    try {
      this.logger.info(
        `[TickerMonitorService.disconnectVirtualClient] Disconnecting virtual client`,
      );

      // Desuscribir de todos los símbolos actuales
      if (this.currentSubscriptions.size > 0) {
        await this.webSocketCoordinator.handleClientUnsubscribe(
          this.VIRTUAL_CLIENT_ID,
          Array.from(this.currentSubscriptions)
        );
      }

      // Limpiar la sesión del cliente
      await this.clientSessionService.removeClient(this.VIRTUAL_CLIENT_ID);

      // Desconectar el cliente virtual
      this.virtualClient.disconnect();
      this.virtualClient = null;
      this.currentSubscriptions.clear();

      this.logger.info(
        `[TickerMonitorService.disconnectVirtualClient] ✅ Virtual client disconnected`,
      );

    } catch (error) {
      this.logger.error(
        `[TickerMonitorService.disconnectVirtualClient] Error disconnecting virtual client: ${error.message}`,
      );
    }
  }

  /**
   * Cron job que se ejecuta cada 2 minutos para monitorear tickers activos
   */
  @Cron('*/2 * * * *') // Cada 2 minutos
  async monitorActiveTickers(): Promise<void> {
    if (!this.config.enabled || !this.virtualClient?.isConnectedToServer()) {
      return;
    }

    try {
      this.logger.info(
        `[TickerMonitorService.monitorActiveTickers] 🔍 Starting ticker monitoring cycle`,
      );

      // 1. Obtener tickers activos de LogLastTickers
      const activeTickers = await this.getActiveTickers();
      
      this.logger.info(
        `[TickerMonitorService.monitorActiveTickers] Found ${activeTickers.length} active tickers: ${activeTickers.join(', ')}`,
      );

      // 2. Determinar cambios necesarios
      const currentSubs = Array.from(this.currentSubscriptions);
      const tickersToSubscribe = activeTickers.filter(ticker => !this.currentSubscriptions.has(ticker));
      const tickersToUnsubscribe = currentSubs.filter(ticker => !activeTickers.includes(ticker));

      // 3. Suscribir a nuevos tickers
      if (tickersToSubscribe.length > 0) {
        this.logger.info(
          `[TickerMonitorService.monitorActiveTickers] 📈 Subscribing to: ${tickersToSubscribe.join(', ')}`,
        );
        
        await this.subscribeToTickers(tickersToSubscribe);
      }

      // 4. Desuscribir de tickers inactivos
      if (tickersToUnsubscribe.length > 0) {
        this.logger.info(
          `[TickerMonitorService.monitorActiveTickers] 📉 Unsubscribing from: ${tickersToUnsubscribe.join(', ')}`,
        );
        
        await this.unsubscribeFromTickers(tickersToUnsubscribe);
      }

      if (tickersToSubscribe.length === 0 && tickersToUnsubscribe.length === 0) {
        this.logger.info(
          `[TickerMonitorService.monitorActiveTickers] ✅ No subscription changes needed`,
        );
      }

      this.logger.info(
        `[TickerMonitorService.monitorActiveTickers] 🏁 Ticker monitoring cycle completed`,
      );

    } catch (error) {
      this.logger.error(
        `[TickerMonitorService.monitorActiveTickers] Error during monitoring: ${error.message}`,
      );
    }
  }

  /**
   * Obtiene los tickers que han sido consultados recientemente
   */
  private async getActiveTickers(): Promise<string[]> {
    try {
      const thresholdDate = new Date(Date.now() - this.config.activeThresholdMinutes * 60 * 1000);
      
      this.logger.debug(
        `[TickerMonitorService.getActiveTickers] Looking for tickers updated after: ${thresholdDate.toISOString()}`,
      );

      const activeTickers = await this.logLastTickersRepository.findActiveTickers(thresholdDate);

      const tickerCodes = activeTickers
        .filter(ticker => ticker.Ticker !== null)
        .map(ticker => ticker.Ticker as string);

      this.logger.debug(
        `[TickerMonitorService.getActiveTickers] Found ${tickerCodes.length} active tickers in database`,
      );

      return tickerCodes;
    } catch (error) {
      this.logger.error(
        `[TickerMonitorService.getActiveTickers] Error fetching active tickers: ${error.message}`,
      );
      return [];
    }
  }

  /**
   * Suscribe el cliente virtual a nuevos tickers
   */
  private async subscribeToTickers(tickers: string[]): Promise<void> {
    if (!this.virtualClient) return;

    try {
      this.logger.info(
        `[TickerMonitorService.subscribeToTickers] Virtual client subscribing to: ${tickers.join(', ')}`,
      );

      // Usar el coordinador para manejar la suscripción (como lo haría un cliente real)
      await this.webSocketCoordinator.handleClientSubscribe(this.VIRTUAL_CLIENT_ID, tickers);

      // Actualizar el estado local
      tickers.forEach(ticker => this.currentSubscriptions.add(ticker));

      this.logger.info(
        `[TickerMonitorService.subscribeToTickers] ✅ Successfully subscribed to ${tickers.length} tickers`,
      );

    } catch (error) {
      this.logger.error(
        `[TickerMonitorService.subscribeToTickers] Error subscribing to tickers: ${error.message}`,
      );
    }
  }

  /**
   * Desuscribe el cliente virtual de tickers
   */
  private async unsubscribeFromTickers(tickers: string[]): Promise<void> {
    if (!this.virtualClient) return;

    try {
      this.logger.info(
        `[TickerMonitorService.unsubscribeFromTickers] Virtual client unsubscribing from: ${tickers.join(', ')}`,
      );

      // Usar el coordinador para manejar la desuscripción (como lo haría un cliente real)
      await this.webSocketCoordinator.handleClientUnsubscribe(this.VIRTUAL_CLIENT_ID, tickers);

      // Actualizar el estado local
      tickers.forEach(ticker => this.currentSubscriptions.delete(ticker));

      this.logger.info(
        `[TickerMonitorService.unsubscribeFromTickers] ✅ Successfully unsubscribed from ${tickers.length} tickers`,
      );

    } catch (error) {
      this.logger.error(
        `[TickerMonitorService.unsubscribeFromTickers] Error unsubscribing from tickers: ${error.message}`,
      );
    }
  }

  /**
   * Método para actualizar manualmente un ticker en LogLastTickers (útil para testing)
   */
  async updateTickerLastAccess(ticker: string): Promise<void> {
    try {
      await this.logLastTickersRepository.upsertTickerActivity(ticker, new Date());

      this.logger.info(
        `[TickerMonitorService.updateTickerLastAccess] Updated last access for ticker: ${ticker}`,
      );
    } catch (error) {
      this.logger.error(
        `[TickerMonitorService.updateTickerLastAccess] Error updating ticker ${ticker}: ${error.message}`,
      );
    }
  }

  /**
   * Obtiene el estado actual del monitor
   */
  getMonitoringStatus(): {
    enabled: boolean;
    virtualClientConnected: boolean;
    config: TickerMonitorConfig;
    currentSubscriptions: string[];
  } {
    return {
      enabled: this.config.enabled,
      virtualClientConnected: this.virtualClient?.isConnectedToServer() || false,
      config: { ...this.config },
      currentSubscriptions: Array.from(this.currentSubscriptions),
    };
  }

  /**
   * Actualiza la configuración dinámicamente
   */
  updateConfig(newConfig: Partial<TickerMonitorConfig>): void {
    const oldConfig = { ...this.config };
    this.config = { ...this.config, ...newConfig };
    
    this.logger.info(
      `[TickerMonitorService.updateConfig] Configuration updated: ${JSON.stringify(this.config)}`,
    );

    // Si se deshabilitó, desconectar el cliente virtual
    if (oldConfig.enabled && !this.config.enabled) {
      this.disconnectVirtualClient();
    }
    
    // Si se habilitó, crear el cliente virtual
    if (!oldConfig.enabled && this.config.enabled) {
      this.createVirtualClient();
    }
  }

  // MÉTODOS PARA PARAMETRIZAR - IMPLEMENTA SEGÚN TUS NECESIDADES

  /*
  // Ejemplo: Guardar datos en una tabla específica
  private async saveMarketDataToDatabase(symbol: string, marketData: any): Promise<void> {
    try {
      // Implementar según tu esquema de base de datos
      // await this.yourRepository.insertMarketData({
      //   symbol,
      //   price: marketData.price,
      //   timestamp: new Date(marketData.timestamp),
      //   // ... otros campos
      // });
      
      this.logger.debug(`Market data saved for ${symbol}`);
    } catch (error) {
      this.logger.error(`Error saving market data for ${symbol}: ${error.message}`);
    }
  }

  // Ejemplo: Enviar a cola de mensajes
  private async sendToMessageQueue(symbol: string, marketData: any): Promise<void> {
    try {
      // await this.messageQueue.send('market-data-topic', {
      //   symbol,
      //   data: marketData,
      //   timestamp: Date.now()
      // });
      
      this.logger.debug(`Market data sent to queue for ${symbol}`);
    } catch (error) {
      this.logger.error(`Error sending to queue for ${symbol}: ${error.message}`);
    }
  }

  // Ejemplo: Procesar reglas de negocio
  private async processBusinessRules(symbol: string, marketData: any): Promise<void> {
    try {
      // Implementar tus reglas de negocio específicas
      // if (marketData.price > someThreshold) {
      //   await this.triggerAlert(symbol, marketData);
      // }
      
      this.logger.debug(`Business rules processed for ${symbol}`);
    } catch (error) {
      this.logger.error(`Error processing business rules for ${symbol}: ${error.message}`);
    }
  }
  */
}
