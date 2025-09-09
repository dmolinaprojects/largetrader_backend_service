import { Injectable } from '@nestjs/common';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

export interface SymbolSubscription {
  symbol: string;
  subscribers: Set<string>; // Set de client IDs
  subscribedAt: Date;
}

@Injectable()
export class SubscriptionService {
  private readonly symbolSubscriptions = new Map<string, SymbolSubscription>();
  private readonly clientSubscriptions = new Map<string, Set<string>>(); // clientId -> Set of symbols

  constructor(
    @InjectPinoLogger(SubscriptionService.name)
    private readonly logger: PinoLogger,
  ) {}

  async addClientSubscriptions(
    clientId: string,
    symbols: string[],
  ): Promise<void> {
    // Inicializar suscripciones del cliente si no existen
    if (!this.clientSubscriptions.has(clientId)) {
      this.clientSubscriptions.set(clientId, new Set());
    }

    const clientSymbols = this.clientSubscriptions.get(clientId)!;

    for (const symbol of symbols) {
      // Agregar símbolo a las suscripciones del cliente
      clientSymbols.add(symbol);

      // Agregar cliente a las suscripciones del símbolo
      if (!this.symbolSubscriptions.has(symbol)) {
        this.symbolSubscriptions.set(symbol, {
          symbol,
          subscribers: new Set(),
          subscribedAt: new Date(),
        });
      }

      const symbolSub = this.symbolSubscriptions.get(symbol)!;
      symbolSub.subscribers.add(clientId);

      this.logger.info(
        `[SubscriptionService.addClientSubscriptions] Client ${clientId} subscribed to ${symbol}`,
      );
    }
  }

  async removeClientSubscriptions(
    clientId: string,
    symbols?: string[],
  ): Promise<void> {
    const clientSymbols = this.clientSubscriptions.get(clientId);

    if (!clientSymbols) {
      return;
    }

    const symbolsToRemove = symbols || Array.from(clientSymbols);

    for (const symbol of symbolsToRemove) {
      // Remover símbolo de las suscripciones del cliente
      clientSymbols.delete(symbol);

      // Remover cliente de las suscripciones del símbolo
      const symbolSub = this.symbolSubscriptions.get(symbol);
      if (symbolSub) {
        symbolSub.subscribers.delete(clientId);

        // Si no hay más suscriptores, remover el símbolo
        if (symbolSub.subscribers.size === 0) {
          this.symbolSubscriptions.delete(symbol);
          this.logger.info(
            `[SubscriptionService.removeClientSubscriptions] Removed symbol ${symbol} - no more subscribers`,
          );
        }
      }

      this.logger.info(
        `[SubscriptionService.removeClientSubscriptions] Client ${clientId} unsubscribed from ${symbol}`,
      );
    }

    // Si se removieron todas las suscripciones, limpiar el cliente
    if (clientSymbols.size === 0) {
      this.clientSubscriptions.delete(clientId);
    }
  }

  async getSubscribersForSymbol(symbol: string): Promise<string[]> {
    const symbolSub = this.symbolSubscriptions.get(symbol);
    return symbolSub ? Array.from(symbolSub.subscribers) : [];
  }

  async getActiveSubscriptions(): Promise<string[]> {
    return Array.from(this.symbolSubscriptions.keys());
  }

  async getClientSubscriptions(clientId: string): Promise<string[]> {
    const clientSymbols = this.clientSubscriptions.get(clientId);
    return clientSymbols ? Array.from(clientSymbols) : [];
  }

  async getSubscriptionStats(): Promise<{
    totalSymbols: number;
    totalSubscribers: number;
    symbolsWithSubscribers: Array<{
      symbol: string;
      subscriberCount: number;
      subscribedAt: Date;
    }>;
    clientsWithSubscriptions: Array<{
      clientId: string;
      subscriptionCount: number;
    }>;
  }> {
    const symbolsWithSubscribers = Array.from(
      this.symbolSubscriptions.values(),
    ).map((sub) => ({
      symbol: sub.symbol,
      subscriberCount: sub.subscribers.size,
      subscribedAt: sub.subscribedAt,
    }));

    const clientsWithSubscriptions = Array.from(
      this.clientSubscriptions.entries(),
    ).map(([clientId, symbols]) => ({
      clientId,
      subscriptionCount: symbols.size,
    }));

    const totalSubscribers = new Set(
      Array.from(this.symbolSubscriptions.values()).flatMap((sub) =>
        Array.from(sub.subscribers),
      ),
    ).size;

    return {
      totalSymbols: this.symbolSubscriptions.size,
      totalSubscribers,
      symbolsWithSubscribers,
      clientsWithSubscriptions,
    };
  }

  async isSymbolSubscribed(symbol: string): Promise<boolean> {
    return this.symbolSubscriptions.has(symbol);
  }

  async getSymbolSubscriberCount(symbol: string): Promise<number> {
    const symbolSub = this.symbolSubscriptions.get(symbol);
    return symbolSub ? symbolSub.subscribers.size : 0;
  }

  async cleanupClientSubscriptions(clientId: string): Promise<void> {
    const clientSymbols = this.clientSubscriptions.get(clientId);

    if (clientSymbols) {
      // Remover todas las suscripciones del cliente
      await this.removeClientSubscriptions(clientId, Array.from(clientSymbols));
      this.logger.info(
        `[SubscriptionService.cleanupClientSubscriptions] Cleaned up all subscriptions for client ${clientId}`,
      );
    }
  }

  async getAllSubscribedSymbols(): Promise<string[]> {
    return Array.from(this.symbolSubscriptions.keys());
  }

  async getSymbolsWithMultipleSubscribers(): Promise<
    Array<{ symbol: string; subscriberCount: number }>
  > {
    return Array.from(this.symbolSubscriptions.values())
      .filter((sub) => sub.subscribers.size > 1)
      .map((sub) => ({
        symbol: sub.symbol,
        subscriberCount: sub.subscribers.size,
      }));
  }
}
