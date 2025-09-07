import { Injectable } from '@nestjs/common';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { Socket } from 'socket.io';

export interface ClientSession {
  userId: string;
  email: string;
  socket: Socket;
  connectedAt: Date;
  lastActivity?: Date;
}

@Injectable()
export class ClientSessionService {
  private readonly clientSessions = new Map<string, ClientSession>();

  constructor(
    @InjectPinoLogger(ClientSessionService.name)
    private readonly logger: PinoLogger,
  ) {}

  async addClient(clientId: string, session: ClientSession): Promise<void> {
    this.clientSessions.set(clientId, session);
    this.logger.info(`[ClientSessionService.addClient] Added client ${clientId} for user ${session.email}`);
  }

  async removeClient(clientId: string): Promise<void> {
    const session = this.clientSessions.get(clientId);
    if (session) {
      this.clientSessions.delete(clientId);
      this.logger.info(`[ClientSessionService.removeClient] Removed client ${clientId} for user ${session.email}`);
    }
  }

  async getClient(clientId: string): Promise<ClientSession | undefined> {
    return this.clientSessions.get(clientId);
  }

  async getAllClients(): Promise<ClientSession[]> {
    return Array.from(this.clientSessions.values());
  }

  async getClientsByUserId(userId: string): Promise<ClientSession[]> {
    return Array.from(this.clientSessions.values()).filter(session => session.userId === userId);
  }

  async updateLastActivity(clientId: string): Promise<void> {
    const session = this.clientSessions.get(clientId);
    if (session) {
      session.lastActivity = new Date();
    }
  }

  async getActiveClientsCount(): Promise<number> {
    return this.clientSessions.size;
  }

  async isClientConnected(clientId: string): Promise<boolean> {
    return this.clientSessions.has(clientId);
  }

  async getClientStats(): Promise<{
    totalClients: number;
    clientsByUser: Record<string, number>;
    oldestConnection: Date | null;
    newestConnection: Date | null;
  }> {
    const clients = Array.from(this.clientSessions.values());
    const clientsByUser: Record<string, number> = {};
    
    let oldestConnection: Date | null = null;
    let newestConnection: Date | null = null;

    for (const client of clients) {
      // Contar clientes por usuario
      clientsByUser[client.userId] = (clientsByUser[client.userId] || 0) + 1;

      // Encontrar conexión más antigua y más reciente
      if (!oldestConnection || client.connectedAt < oldestConnection) {
        oldestConnection = client.connectedAt;
      }
      if (!newestConnection || client.connectedAt > newestConnection) {
        newestConnection = client.connectedAt;
      }
    }

    return {
      totalClients: clients.length,
      clientsByUser,
      oldestConnection,
      newestConnection,
    };
  }

  async cleanupInactiveClients(maxInactiveMinutes: number = 30): Promise<number> {
    const cutoffTime = new Date(Date.now() - maxInactiveMinutes * 60 * 1000);
    let cleanedCount = 0;

    for (const [clientId, session] of this.clientSessions.entries()) {
      const lastActivity = session.lastActivity || session.connectedAt;
      
      if (lastActivity < cutoffTime) {
        this.clientSessions.delete(clientId);
        cleanedCount++;
        this.logger.info(`[ClientSessionService.cleanupInactiveClients] Cleaned up inactive client ${clientId}`);
      }
    }

    if (cleanedCount > 0) {
      this.logger.info(`[ClientSessionService.cleanupInactiveClients] Cleaned up ${cleanedCount} inactive clients`);
    }

    return cleanedCount;
  }
}
