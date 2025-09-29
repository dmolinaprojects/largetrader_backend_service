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
import { MarketTickersRepository } from '@app/shared/domain/repositories/stocks/market-tickers.repository';
import { EODHDService } from '../../feed/services/eodhd.service';
import { RealTimeData } from '@app/shared/domain/models/stocks/real-time-data.model';

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
    @Inject('RealTimeDataRepository')
    private readonly realTimeDataRepository: RealTimeDataRepository,
    @Inject('MarketTickersRepository')
    private readonly marketTickersRepository: MarketTickersRepository,
    private readonly clientSessionService: ClientSessionService,
    private readonly subscriptionService: SubscriptionService,
    private readonly webSocketCoordinator: WebSocketCoordinatorService,
    private readonly eodhdService: EODHDService,
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
   * Maneja los datos de mercado recibidos y actualiza RealTimeData
   */
  private async handleMarketData(data: any): Promise<void> {
    try {
      this.logger.info(
        `[TickerMonitorService.handleMarketData] 📊 Received market data for ${data.symbol}: ${JSON.stringify(data.data)}`,
      );

      // Actualizar RealTimeData con los datos en tiempo real recibidos
      await this.updateRealTimeDataFromWebSocket(data.symbol, data.data);

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

      // 2. Obtener última vela de EODHD para cada ticker activo y actualizar RealTimeData
      if (activeTickers.length > 0) {
        await this.updateRealTimeDataFromEODHD(activeTickers);
      }

      // 3. Determinar cambios necesarios para suscripciones WebSocket
      const currentSubs = Array.from(this.currentSubscriptions);
      const tickersToSubscribe = activeTickers.filter(ticker => !this.currentSubscriptions.has(ticker));
      const tickersToUnsubscribe = currentSubs.filter(ticker => !activeTickers.includes(ticker));

      // 4. Suscribir a nuevos tickers
      if (tickersToSubscribe.length > 0) {
        this.logger.info(
          `[TickerMonitorService.monitorActiveTickers] 📈 Subscribing to: ${tickersToSubscribe.join(', ')}`,
        );
        
        await this.subscribeToTickers(tickersToSubscribe);
      }

      // 5. Desuscribir de tickers inactivos
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
   * TEMPORAL: Trae el primer registro sin importar la fecha para testing
   * VALIDADO: Solo tickers compatibles con EOD WebSocket
   */
  private async getActiveTickers(): Promise<string[]> {
    try {
      this.logger.info(
        `[TickerMonitorService.getActiveTickers] 🔧 TEMPORAL MODE: Getting first ticker from LogLastTickers (ignoring time threshold)`,
      );

      // TEMPORAL: Obtener el primer registro de la tabla sin filtro de fecha
      const allTickers = await this.logLastTickersRepository.findMany({
        take: 5, // Obtener más tickers para tener opciones
        orderBy: { Date: 'desc' }
      });

      const validTickers: string[] = [];

      for (const ticker of allTickers) {
        if (ticker.Ticker) {
          try {
            // Validar que el ticker existe en market_tickers
            const marketTicker = await this.marketTickersRepository.findByCode(ticker.Ticker);
            
            if (!marketTicker) {
              this.logger.warn(
                `[TickerMonitorService.getActiveTickers] Ticker ${ticker.Ticker} not found in market_tickers, skipping`,
              );
              continue;
            }

            if (!marketTicker.Enabled) {
              this.logger.warn(
                `[TickerMonitorService.getActiveTickers] Ticker ${ticker.Ticker} is disabled, skipping`,
              );
              continue;
            }

            // Solo procesar tickers de tipo 'stock' que EOD WebSocket acepta
            if (marketTicker.Type === 'stock' || marketTicker.Type === 'index' || marketTicker.Type === 'commodity') {
              validTickers.push(ticker.Ticker);
              this.logger.info(
                `[TickerMonitorService.getActiveTickers] ✅ Valid ticker: ${ticker.Ticker} (${marketTicker.Type})`,
              );
            } else {
              this.logger.warn(
                `[TickerMonitorService.getActiveTickers] Ticker ${ticker.Ticker} type '${marketTicker.Type}' not supported by EOD WebSocket, skipping`,
              );
            }
          } catch (error) {
            this.logger.error(
              `[TickerMonitorService.getActiveTickers] Error validating ticker ${ticker.Ticker}: ${error.message}`,
            );
          }
        }
      }

      this.logger.info(
        `[TickerMonitorService.getActiveTickers] Found ${validTickers.length} valid tickers for EOD WebSocket: ${validTickers.join(', ')}`,
      );

      return validTickers;
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

  /**
   * Obtiene la última vela de EODHD para tickers activos y actualiza RealTimeData
   */
  private async updateRealTimeDataFromEODHD(tickers: string[]): Promise<void> {
    try {
      this.logger.info(
        `[TickerMonitorService.updateRealTimeDataFromEODHD] 📈 Updating RealTimeData for ${tickers.length} tickers from EODHD`,
      );

      // Obtener datos históricos de 1 día para cada ticker (última vela)
      const historicalData = await this.eodhdService.getMultipleHistoricalData(tickers, 1, 'd');

      for (const tickerData of historicalData) {
        if (tickerData.data && tickerData.data.length > 0) {
          const lastCandle = tickerData.data[tickerData.data.length - 1];
          const ticker = tickerData.code.replace('.US', ''); // Remover .US del código

          // Crear datos para RealTimeData (sin splits, como dice la conversación)
          const realTimeData: Omit<RealTimeData, 'id'> = {
            Ticker: ticker,
            Open: lastCandle.open,
            High: lastCandle.high,
            Low: lastCandle.low,
            Close: lastCandle.close,
            AskPrice: lastCandle.close, // Usar close como AskPrice por defecto
            AskSize: 0, // No disponible en datos históricos
            BidPrice: lastCandle.close, // Usar close como BidPrice por defecto
            BidSize: 0, // No disponible en datos históricos
          };

          // Buscar si ya existe un registro para este ticker
          const existingData = await this.realTimeDataRepository.findByTicker(ticker);
          
          if (existingData.length > 0) {
            // Actualizar el registro existente
            await this.realTimeDataRepository.updateOne({
              where: { id: existingData[0].id },
              data: realTimeData,
            });
          } else {
            // Crear nuevo registro
            await this.realTimeDataRepository.createOne({
              data: realTimeData as RealTimeData,
            });
          }

          this.logger.debug(
            `[TickerMonitorService.updateRealTimeDataFromEODHD] ✅ Updated RealTimeData for ${ticker}: O=${lastCandle.open}, H=${lastCandle.high}, L=${lastCandle.low}, C=${lastCandle.close}`,
          );
        }
      }

      this.logger.info(
        `[TickerMonitorService.updateRealTimeDataFromEODHD] ✅ Successfully updated RealTimeData for ${tickers.length} tickers`,
      );

    } catch (error) {
      this.logger.error(
        `[TickerMonitorService.updateRealTimeDataFromEODHD] Error updating RealTimeData from EODHD: ${error.message}`,
      );
    }
  }

  /**
   * Actualiza RealTimeData con datos en tiempo real del WebSocket
   */
  private async updateRealTimeDataFromWebSocket(ticker: string, marketData: any): Promise<void> {
    try {
      this.logger.debug(
        `[TickerMonitorService.updateRealTimeDataFromWebSocket] 📊 Updating RealTimeData for ${ticker} from WebSocket`,
      );

      // Mapear datos del WebSocket al formato de RealTimeData
      const realTimeData: Partial<Omit<RealTimeData, 'id'>> = {
        Ticker: ticker,
        Open: marketData.open || marketData.Open,
        High: marketData.high || marketData.High,
        Low: marketData.low || marketData.Low,
        Close: marketData.close || marketData.Close,
        AskPrice: marketData.askPrice || marketData.AskPrice || marketData.close || marketData.Close,
        AskSize: marketData.askSize || marketData.AskSize || 0,
        BidPrice: marketData.bidPrice || marketData.BidPrice || marketData.close || marketData.Close,
        BidSize: marketData.bidSize || marketData.BidSize || 0,
      };

      // Buscar si ya existe un registro para este ticker
      const existingData = await this.realTimeDataRepository.findByTicker(ticker);
      
      if (existingData.length > 0) {
        // Actualizar el registro existente
        await this.realTimeDataRepository.updateOne({
          where: { id: existingData[0].id },
          data: realTimeData as Omit<RealTimeData, 'id'>,
        });
      } else {
        // Crear nuevo registro
        await this.realTimeDataRepository.createOne({
          data: realTimeData as RealTimeData,
        });
      }

      this.logger.debug(
        `[TickerMonitorService.updateRealTimeDataFromWebSocket] ✅ Updated RealTimeData for ${ticker} from WebSocket`,
      );

    } catch (error) {
      this.logger.error(
        `[TickerMonitorService.updateRealTimeDataFromWebSocket] Error updating RealTimeData for ${ticker}: ${error.message}`,
      );
    }
  }
}
