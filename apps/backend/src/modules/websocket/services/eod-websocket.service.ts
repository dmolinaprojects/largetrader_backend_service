import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { ConfigService } from '@nestjs/config';
import * as WebSocket from 'ws';

export interface EodMarketData {
  s: string;  // symbol
  a: number;  // ask price
  b: number;  // bid price
  dc: number; // change in cents
  dd: number; // change in decimals
  t: number;  // timestamp
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
  ) {
    this.apiToken = this.configService.get<string>('EOD_API_TOKEN') || 'your-api-token-here';
  }

  async connect(symbols: string[]): Promise<void> {
    if (this.isConnected) {
      this.logger.info(`[EodWebSocketService.connect] Already connected, updating subscriptions`);
      await this.updateSubscriptions(symbols);
      return;
    }

    try {
      const url = `${this.baseUrl}/ws/forex?api_token=${this.apiToken}`;
      this.logger.info(`[EodWebSocketService.connect] Connecting to EOD WebSocket: ${url}`);

      this.ws = new WebSocket(url);

      this.ws.on('open', () => {
        this.logger.info(`[EodWebSocketService.connect] Connected to EOD WebSocket`);
        this.isConnected = true;
        this.reconnectAttempts = 0;
        
        // Suscribirse a los símbolos
        this.subscribeToSymbols(symbols);
        
        // Iniciar heartbeat
        this.startHeartbeat();
      });

      this.ws.on('message', (data: WebSocket.Data) => {
        try {
          const message = JSON.parse(data.toString());
          this.handleMessage(message);
        } catch (error) {
          this.logger.error(`[EodWebSocketService.connect] Error parsing message: ${error.message}`);
        }
      });

      this.ws.on('close', (code: number, reason: string) => {
        this.logger.warn(`[EodWebSocketService.connect] Connection closed: ${code} - ${reason}`);
        this.isConnected = false;
        this.stopHeartbeat();
        this.handleReconnect();
      });

      this.ws.on('error', (error: Error) => {
        this.logger.error(`[EodWebSocketService.connect] WebSocket error: ${error.message}`);
        this.isConnected = false;
        this.stopHeartbeat();
        this.handleReconnect();
      });

    } catch (error) {
      this.logger.error(`[EodWebSocketService.connect] Failed to connect: ${error.message}`);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    if (this.ws && this.isConnected) {
      this.logger.info(`[EodWebSocketService.disconnect] Disconnecting from EOD WebSocket`);
      
      this.stopHeartbeat();
      this.ws.close();
      this.ws = null;
      this.isConnected = false;
      this.subscribedSymbols.clear();
    }
  }

  async updateSubscriptions(symbols: string[]): Promise<void> {
    if (!this.isConnected || !this.ws) {
      this.logger.warn(`[EodWebSocketService.updateSubscriptions] Not connected to EOD WebSocket`);
      return;
    }

    // Agregar nuevos símbolos
    const newSymbols = symbols.filter(symbol => !this.subscribedSymbols.has(symbol));
    
    if (newSymbols.length > 0) {
      this.subscribeToSymbols(newSymbols);
    }

    // Remover símbolos que ya no se necesitan
    const symbolsToRemove = Array.from(this.subscribedSymbols).filter(symbol => !symbols.includes(symbol));
    
    if (symbolsToRemove.length > 0) {
      this.unsubscribeFromSymbols(symbolsToRemove);
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

  private subscribeToSymbols(symbols: string[]): void {
    if (!this.ws || !this.isConnected) {
      return;
    }

    const message = {
      action: 'subscribe',
      symbols: symbols.join(','),
    };

    this.logger.info(`[EodWebSocketService.subscribeToSymbols] Subscribing to symbols: ${symbols.join(', ')}`);
    
    this.ws.send(JSON.stringify(message));
    
    // Agregar a la lista de símbolos suscritos
    symbols.forEach(symbol => this.subscribedSymbols.add(symbol));
  }

  private unsubscribeFromSymbols(symbols: string[]): void {
    if (!this.ws || !this.isConnected) {
      return;
    }

    const message = {
      action: 'unsubscribe',
      symbols: symbols.join(','),
    };

    this.logger.info(`[EodWebSocketService.unsubscribeFromSymbols] Unsubscribing from symbols: ${symbols.join(', ')}`);
    
    this.ws.send(JSON.stringify(message));
    
    // Remover de la lista de símbolos suscritos
    symbols.forEach(symbol => this.subscribedSymbols.delete(symbol));
  }

  private handleMessage(message: any): void {
    // Verificar si es un mensaje de datos de mercado
    if (message.s && typeof message.a === 'number' && typeof message.b === 'number') {
      const marketData: EodMarketData = {
        s: message.s,
        a: message.a,
        b: message.b,
        dc: message.dc || 0,
        dd: message.dd || 0,
        t: message.t || Date.now(),
      };

      this.logger.debug(`[EodWebSocketService.handleMessage] Received market data for ${marketData.s}: ask=${marketData.a}, bid=${marketData.b}`);

      // Llamar al callback si está configurado
      if (this.dataCallback) {
        this.dataCallback(marketData);
      }
    } else {
      this.logger.debug(`[EodWebSocketService.handleMessage] Received non-market data message: ${JSON.stringify(message)}`);
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
      this.logger.error(`[EodWebSocketService.handleReconnect] Max reconnection attempts reached`);
      return;
    }

    this.reconnectAttempts++;
    this.logger.info(`[EodWebSocketService.handleReconnect] Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts}) in ${this.reconnectInterval}ms`);

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
