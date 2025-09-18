import { Inject, Injectable, OnModuleDestroy } from '@nestjs/common';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { ConfigService } from '@nestjs/config';
import * as WebSocket from 'ws';
import { MarketTickersRepository } from '@app/shared/domain/repositories/stocks/market-tickers.repository';

export interface EodMarketData {
  s: string; // symbol
  a: number; // ask price
  b: number; // bid price
  timestamp: number; // timestamp
}

@Injectable()
export class EodWebSocketService implements OnModuleDestroy {
  private ws: WebSocket | null = null;
  private isConnected = false;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectInterval = 5000; // 5 seconds
  private heartbeatInterval: NodeJS.Timeout | null = null;
  private subscribedSymbols = new Set<string>();
  private dataCallback: ((data: EodMarketData) => void) | null = null;

  private readonly baseUrl = 'wss://ws.eodhistoricaldata.com:443';
  private readonly apiToken: string;

  constructor(
    @InjectPinoLogger(EodWebSocketService.name)
    private readonly logger: PinoLogger,
    private readonly configService: ConfigService,
    @Inject('MarketTickersRepository')
    private readonly marketTickersRepository: MarketTickersRepository,
  ) {
    this.apiToken =
      this.configService.get<string>('EOD_API_TOKEN') || 'your-api-token-here';
    
    this.logger.info(
      `[EodWebSocketService.constructor] EOD API Token configured: ${this.apiToken === 'your-api-token-here' ? 'DEFAULT (INVALID)' : 'CUSTOM'}`,
    );
  }

  async connect(symbols: string[]): Promise<void> {
    this.logger.info(
      `[EodWebSocketService.connect] Attempting to connect with symbols: ${symbols.join(', ')}`,
    );

    if (this.isConnected) {
      this.logger.info(
        `[EodWebSocketService.connect] Already connected, updating subscriptions`,
      );
      await this.updateSubscriptions(symbols);
      return;
    }

    try {
      // Determinar el endpoint correcto basado en el tipo de activo de la base de datos
      const endpoint = await this.determineEndpoint(symbols);
      const url = `${this.baseUrl}/ws/${endpoint}?api_token=${this.apiToken}`;
      
      this.logger.info(
        `[EodWebSocketService.connect] Connecting to EOD WebSocket: ${url}`,
      );
      this.logger.info(
        `[EodWebSocketService.connect] Using endpoint: ${endpoint} for symbols: ${symbols.join(', ')}`,
      );
      this.logger.info(
        `[EodWebSocketService.connect] API Token status: ${this.apiToken === 'your-api-token-here' ? 'INVALID - Using default token' : 'VALID - Using custom token'}`,
      );

      this.ws = new WebSocket(url);

      this.ws.on('open', async () => {
        this.logger.info(
          `[EodWebSocketService.connect] ✅ Connected to EOD WebSocket successfully`,
        );
        this.isConnected = true;
        this.reconnectAttempts = 0;

        // Suscribirse a los símbolos
        this.logger.info(
          `[EodWebSocketService.connect] Subscribing to symbols: ${symbols.join(', ')}`,
        );
        await this.subscribeToSymbols(symbols);

        // Iniciar heartbeat
        this.startHeartbeat();
      });

      this.ws.on('message', (data: WebSocket.Data) => {
        try {
          const message = JSON.parse(data.toString());
          this.logger.info(
            `[EodWebSocketService.connect] 📊 Received message from EOD: ${JSON.stringify(message)}`,
          );
          this.handleMessage(message);
        } catch (error) {
          this.logger.error(
            `[EodWebSocketService.connect] Error parsing message: ${error.message}`,
          );
        }
      });

      this.ws.on('close', (code: number, reason: string) => {
        this.logger.warn(
          `[EodWebSocketService.connect] ❌ Connection closed: ${code} - ${reason}`,
        );
        this.isConnected = false;
        this.stopHeartbeat();
        this.handleReconnect();
      });

      this.ws.on('error', (error: Error) => {
        this.logger.error(
          `[EodWebSocketService.connect] ❌ WebSocket error: ${error.message}`,
        );
        this.isConnected = false;
        this.stopHeartbeat();
        this.handleReconnect();
      });
    } catch (error) {
      this.logger.error(
        `[EodWebSocketService.connect] Failed to connect: ${error.message}`,
      );
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    if (this.ws && this.isConnected) {
      this.logger.info(
        `[EodWebSocketService.disconnect] Disconnecting from EOD WebSocket`,
      );

      this.stopHeartbeat();
      this.ws.close();
      this.ws = null;
      this.isConnected = false;
      this.subscribedSymbols.clear();
    }
  }

  /**
   * Determinar el endpoint correcto basado en el tipo de activo de la base de datos
   */
  private async determineEndpoint(symbols: string[]): Promise<string> {
    try {
      // Obtener el tipo del primer símbolo desde la base de datos
      const firstSymbol = symbols[0];
      const ticker = await this.marketTickersRepository.findByCode(firstSymbol);
      
      if (!ticker) {
        this.logger.warn(
          `[EodWebSocketService.determineEndpoint] Symbol ${firstSymbol} not found in database, defaulting to us`,
        );
        return 'us';
      }

      // Determinar el tipo de activo usando la misma lógica que los use cases
      const assetType = this.determineAssetType(ticker.Type);
      
      this.logger.info(
        `[EodWebSocketService.determineEndpoint] Symbol ${firstSymbol} has type: ${ticker.Type} -> ${assetType}`,
      );

      // Mapear tipo de activo a endpoint de EOD
      switch (assetType) {
        case 'crypto':
          return 'crypto';
        case 'forex':
          return 'forex';
        case 'stock':
        case 'index':
        case 'commodity':
        default:
          return 'us-quote'; // Usar endpoint de quotes para bid/ask
      }
    } catch (error) {
      this.logger.error(
        `[EodWebSocketService.determineEndpoint] Error determining endpoint: ${error.message}`,
      );
      return 'us'; // Fallback por defecto
    }
  }

  /**
   * Determinar tipo de activo basado en el Type de la base de datos
   * Usa la misma lógica que los use cases del backend
   */
  private determineAssetType(type: string): string {
    const typeMap: { [key: string]: string } = {
      'stock': 'stock',
      'Common Stock': 'stock',
      'ETF': 'stock',
      'Preferred Stock': 'stock',
      'Mutual Fund': 'stock',
      'INDEX': 'index',
      'Commodity': 'commodity',
      'crypto': 'crypto',
      'forex': 'forex',
      'cfd': 'forex',
    };
    return typeMap[type] || 'stock';
  }

  /**
   * Formatear símbolos para EOD según el tipo de activo de la base de datos
   */
  private async formatSymbolsForEod(symbols: string[]): Promise<string[]> {
    const formattedSymbols: string[] = [];
    
    for (const symbol of symbols) {
      try {
        // Obtener el tipo del símbolo desde la base de datos
        const ticker = await this.marketTickersRepository.findByCode(symbol);
        
        if (!ticker) {
          this.logger.warn(
            `[EodWebSocketService.formatSymbolsForEod] Symbol ${symbol} not found in database, using default format`,
          );
          formattedSymbols.push(`${symbol}`);
          continue;
        }

        // Determinar el tipo de activo
        const assetType = this.determineAssetType(ticker.Type);
        
        // Formatear según el tipo de activo
        switch (assetType) {
          case 'crypto':
            // Para crypto, mantener el formato original (BTCUSDT -> BTCUSDT)
            formattedSymbols.push(symbol);
            break;
          case 'forex':
            // Para forex, mantener el formato original (EURUSD -> EURUSD)
            formattedSymbols.push(symbol);
            break;
          case 'stock':
          case 'index':
          case 'commodity':
          default:
            // Para stocks, agregar .US (AAPL -> AAPL.US)
            formattedSymbols.push(`${symbol}`);
            break;
        }
        
        this.logger.info(
          `[EodWebSocketService.formatSymbolsForEod] Formatted ${symbol} (${ticker.Type} -> ${assetType})`,
        );
      } catch (error) {
        this.logger.error(
          `[EodWebSocketService.formatSymbolsForEod] Error formatting symbol ${symbol}: ${error.message}`,
        );
        // Fallback: agregar .US
        formattedSymbols.push(`${symbol}`);
      }
    }
    
    return formattedSymbols;
  }

  async updateSubscriptions(symbols: string[]): Promise<void> {
    if (!this.isConnected || !this.ws) {
      this.logger.warn(
        `[EodWebSocketService.updateSubscriptions] Not connected to EOD WebSocket`,
      );
      return;
    }

    // Agregar nuevos símbolos
    const newSymbols = symbols.filter(
      (symbol) => !this.subscribedSymbols.has(symbol),
    );

    if (newSymbols.length > 0) {
      await this.subscribeToSymbols(newSymbols);
    }

    // Remover símbolos que ya no se necesitan
    const symbolsToRemove = Array.from(this.subscribedSymbols).filter(
      (symbol) => !symbols.includes(symbol),
    );

    if (symbolsToRemove.length > 0) {
      await this.unsubscribeFromSymbols(symbolsToRemove);
    }
  }

  setDataCallback(callback: (data: EodMarketData) => void): void {
    this.dataCallback = callback;
  }

  isConnectedToEod(): boolean {
    return this.isConnected && this.ws?.readyState === WebSocket.OPEN;
  }

  getSubscribedSymbols(): string[] {
    return Array.from(this.subscribedSymbols);
  }

  private async subscribeToSymbols(symbols: string[]): Promise<void> {
    if (!this.ws || !this.isConnected) {
      return;
    }

    // Formatear símbolos para EOD según el tipo de activo de la base de datos
    const formattedSymbols = await this.formatSymbolsForEod(symbols);

    const message = {
      action: 'subscribe',
      symbols: formattedSymbols.join(','),
    };

    this.logger.info(
      `[EodWebSocketService.subscribeToSymbols] Subscribing to symbols: ${formattedSymbols.join(', ')}`,
    );

    this.ws.send(JSON.stringify(message));

    // Agregar a la lista de símbolos suscritos (usar los símbolos originales)
    symbols.forEach((symbol) => this.subscribedSymbols.add(symbol));
  }

  private async unsubscribeFromSymbols(symbols: string[]): Promise<void> {
    if (!this.ws || !this.isConnected) {
      return;
    }

    // Formatear símbolos para EOD según el tipo de activo de la base de datos
    const formattedSymbols = await this.formatSymbolsForEod(symbols);

    const message = {
      action: 'unsubscribe',
      symbols: formattedSymbols.join(','),
    };

    this.logger.info(
      `[EodWebSocketService.unsubscribeFromSymbols] Unsubscribing from symbols: ${formattedSymbols.join(', ')}`,
    );

    this.ws.send(JSON.stringify(message));

    // Remover de la lista de símbolos suscritos
    symbols.forEach((symbol) => this.subscribedSymbols.delete(symbol));
  }

  private handleMessage(message: any): void {
    this.logger.info(
      `[EodWebSocketService.handleMessage] Processing message: ${JSON.stringify(message)}`,
    );

    // Verificar si es un mensaje de autorización
    if (message.status === 'authorized') {
      this.logger.info(
        `[EodWebSocketService.handleMessage] ✅ EOD WebSocket authorized successfully`,
      );
      return;
    }

    // Verificar si es un mensaje de suscripción confirmada
    if (message.status === 'subscribed' || message.action === 'subscribed') {
      this.logger.info(
        `[EodWebSocketService.handleMessage] ✅ Subscription confirmed for symbols: ${message.symbols || 'unknown'}`,
      );
      return;
    }

    // Verificar si es un mensaje de datos de mercado - formato EOD quotes: {s, ap, as, bp, bs, t}
    if (message.s && typeof message.ap === 'number' && typeof message.bp === 'number' && message.t) {
      // EOD quotes endpoint devuelve ask/bid separados
      const marketData: EodMarketData = {
        s: message.s,
        a: message.ap, // ask price
        b: message.bp, // bid price
        timestamp: message.t,
      };

      this.logger.info(
        `[EodWebSocketService.handleMessage] 📊 Received market data for ${marketData.s}: ask=${marketData.a}, bid=${marketData.b}, ask_size=${message.as || 0}, bid_size=${message.bs || 0}`,
      );

      // Llamar al callback si está configurado
      if (this.dataCallback) {
        this.dataCallback(marketData);
      }
    } else {
      this.logger.info(
        `[EodWebSocketService.handleMessage] ℹ️ Received non-market data message: ${JSON.stringify(message)}`,
      );
    }
  }

  private startHeartbeat(): void {
    this.heartbeatInterval = setInterval(() => {
      if (this.ws && this.isConnected) {
        this.ws.ping();
      }
    }, 30000); // Ping cada 30 segundos
  }

  private stopHeartbeat(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  private handleReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      this.logger.error(
        `[EodWebSocketService.handleReconnect] Max reconnection attempts reached`,
      );
      return;
    }

    this.reconnectAttempts++;
    this.logger.info(
      `[EodWebSocketService.handleReconnect] Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts}) in ${this.reconnectInterval}ms`,
    );

    setTimeout(() => {
      if (this.subscribedSymbols.size > 0) {
        this.connect(Array.from(this.subscribedSymbols));
      }
    }, this.reconnectInterval);
  }

  async onModuleDestroy(): Promise<void> {
    await this.disconnect();
  }
}
