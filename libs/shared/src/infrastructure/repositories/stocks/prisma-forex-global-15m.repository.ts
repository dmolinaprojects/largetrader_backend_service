import { Injectable } from '@nestjs/common';
import {
  PrismaClient as StocksPrismaClient,
  forex_global_15m as PrismaForexGlobal15m,
} from '@prisma/stocks-client';
import { ForexGlobal15mRepository } from '../../../domain/repositories/stocks/forex-global-15m.repository';
import { ForexGlobal15m } from '../../../domain/models/stocks/forex-global-15m.model';
import {
  TFindManyArgs,
  TFindOneArgs,
  TCreateOneArgs,
  TCreateManyArgs,
  TUpdateOneArgs,
  TDeleteOneArgs,
  TUpsertOneArgs,
  TTransactionArgs,
  TCountManyArgs,
} from '@app/core';

@Injectable()
export class PrismaForexGlobal15mRepository implements ForexGlobal15mRepository {
  constructor(private readonly prisma: StocksPrismaClient) {}

  async findMany(args?: TFindManyArgs<ForexGlobal15m, ForexGlobal15m>): Promise<ForexGlobal15m[]> {
    return (await this.prisma.forex_global_15m.findMany({
      where: args?.where,
      skip: args?.skip,
      take: args?.take,
      orderBy: args?.orderBy || { quotedate: 'asc' },
    })) as unknown as ForexGlobal15m[];
  }

  async findOne(args: TFindOneArgs<ForexGlobal15m, ForexGlobal15m>): Promise<ForexGlobal15m | null> {
    return (await this.prisma.forex_global_15m.findFirst({
      where: args.where,
    })) as unknown as ForexGlobal15m | null;
  }

  async countMany(args?: TCountManyArgs<ForexGlobal15m>, tx?: TTransactionArgs): Promise<number> {
    const client = tx ? (tx as StocksPrismaClient) : this.prisma;
    return await client.forex_global_15m.count({ where: args?.where });
  }

  async transaction<T>(fn: (tx: any) => Promise<T>): Promise<T> {
    return await this.prisma.$transaction(fn);
  }

  async createOne(
    args: TCreateOneArgs<ForexGlobal15m, ForexGlobal15m>,
    tx?: TTransactionArgs,
  ): Promise<ForexGlobal15m> {
    const client = tx ? (tx as StocksPrismaClient) : this.prisma;
    return (await client.forex_global_15m.create({
      data: {
        symbol: args.data.symbol,
        quotedate: args.data.quotedate,
        open: args.data.open,
        high: args.data.high,
        low: args.data.low,
        close: args.data.close,
        volume: args.data.volume,
        adjustedclose: args.data.adjustedclose,
      },
    })) as unknown as ForexGlobal15m;
  }

  async createMany(
    args: TCreateManyArgs<ForexGlobal15m>,
    tx?: TTransactionArgs,
  ): Promise<void> {
    const client = tx ? (tx as StocksPrismaClient) : this.prisma;
    await client.forex_global_15m.createMany({
      data: args.data.map(item => ({
        symbol: item.symbol,
        quotedate: item.quotedate,
        open: item.open,
        high: item.high,
        low: item.low,
        close: item.close,
        volume: item.volume,
        adjustedclose: item.adjustedclose,
      })),
    });
  }

  async updateOne(
    args: TUpdateOneArgs<Partial<ForexGlobal15m>, ForexGlobal15m>,
    tx?: TTransactionArgs,
  ): Promise<ForexGlobal15m> {
    const client = tx ? (tx as StocksPrismaClient) : this.prisma;
    return (await client.forex_global_15m.update({
      where: { id: args.where.id },
      data: args.data,
    })) as unknown as ForexGlobal15m;
  }

  async deleteOne(
    args: TDeleteOneArgs<Partial<ForexGlobal15m>, ForexGlobal15m>,
    tx?: TTransactionArgs,
  ): Promise<ForexGlobal15m> {
    const client = tx ? (tx as StocksPrismaClient) : this.prisma;
    return (await client.forex_global_15m.delete({
      where: { id: args.where.id },
    })) as unknown as ForexGlobal15m;
  }

  async upsertOne(
    args: TUpsertOneArgs<Pick<ForexGlobal15m, 'id'>, ForexGlobal15m>,
    tx?: TTransactionArgs,
  ): Promise<ForexGlobal15m> {
    const client = tx ? (tx as StocksPrismaClient) : this.prisma;
    return (await client.forex_global_15m.upsert({
      where: { id: args.where.id },
      update: args.update,
      create: args.create,
    })) as unknown as ForexGlobal15m;
  }

  // Métodos específicos del dominio
  async findBySymbol(symbol: string): Promise<ForexGlobal15m[]> {
    return (await this.prisma.forex_global_15m.findMany({
      where: { symbol: { equals: symbol } },
      orderBy: { quotedate: 'asc' },
    })) as unknown as ForexGlobal15m[];
  }

  async findBySymbolAndDateRange(symbol: string, from: Date, to: Date): Promise<ForexGlobal15m[]> {
    return (await this.prisma.forex_global_15m.findMany({
      where: {
        symbol: { equals: symbol },
        quotedate: {
          gte: from,
          lte: to,
        },
      },
      orderBy: { quotedate: 'asc' },
    })) as unknown as ForexGlobal15m[];
  }

  async findLatestBySymbol(symbol: string): Promise<ForexGlobal15m | null> {
    return (await this.prisma.forex_global_15m.findFirst({
      where: { symbol: { equals: symbol } },
      orderBy: { quotedate: 'desc' },
    })) as unknown as ForexGlobal15m | null;
  }

  async findByDateRange(from: Date, to: Date): Promise<ForexGlobal15m[]> {
    return (await this.prisma.forex_global_15m.findMany({
      where: {
        quotedate: {
          gte: from,
          lte: to,
        },
      },
      orderBy: { quotedate: 'asc' },
    })) as unknown as ForexGlobal15m[];
  }
}
