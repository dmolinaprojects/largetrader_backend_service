import { Injectable } from '@nestjs/common';
import {
  PrismaClient as StocksPrismaClient,
  forex_global_5m as PrismaForexGlobal5m,
} from '@prisma/stocks-client';
import { ForexGlobal5mRepository } from '../../../domain/repositories/stocks/forex-global-5m.repository';
import { ForexGlobal5m } from '../../../domain/models/stocks/forex-global-5m.model';
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
export class PrismaForexGlobal5mRepository implements ForexGlobal5mRepository {
  constructor(private readonly prisma: StocksPrismaClient) {}

  async findMany(args?: TFindManyArgs<ForexGlobal5m, ForexGlobal5m>): Promise<ForexGlobal5m[]> {
    return (await this.prisma.forex_global_5m.findMany({
      where: args?.where,
      skip: args?.skip,
      take: args?.take,
      orderBy: args?.orderBy || { quotedate: 'asc' },
    })) as unknown as ForexGlobal5m[];
  }

  async findOne(args: TFindOneArgs<ForexGlobal5m, ForexGlobal5m>): Promise<ForexGlobal5m | null> {
    return (await this.prisma.forex_global_5m.findFirst({
      where: args.where,
    })) as unknown as ForexGlobal5m | null;
  }

  async countMany(args?: TCountManyArgs<ForexGlobal5m>, tx?: TTransactionArgs): Promise<number> {
    const client = tx ? (tx as StocksPrismaClient) : this.prisma;
    return await client.forex_global_5m.count({ where: args?.where });
  }

  async transaction<T>(fn: (tx: any) => Promise<T>): Promise<T> {
    return await this.prisma.$transaction(fn);
  }

  async createOne(
    args: TCreateOneArgs<ForexGlobal5m, ForexGlobal5m>,
    tx?: TTransactionArgs,
  ): Promise<ForexGlobal5m> {
    const client = tx ? (tx as StocksPrismaClient) : this.prisma;
    return (await client.forex_global_5m.create({
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
    })) as unknown as ForexGlobal5m;
  }

  async createMany(
    args: TCreateManyArgs<ForexGlobal5m>,
    tx?: TTransactionArgs,
  ): Promise<void> {
    const client = tx ? (tx as StocksPrismaClient) : this.prisma;
    await client.forex_global_5m.createMany({
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
    args: TUpdateOneArgs<Partial<ForexGlobal5m>, ForexGlobal5m>,
    tx?: TTransactionArgs,
  ): Promise<ForexGlobal5m> {
    const client = tx ? (tx as StocksPrismaClient) : this.prisma;
    return (await client.forex_global_5m.update({
      where: { id: args.where.id },
      data: args.data,
    })) as unknown as ForexGlobal5m;
  }

  async deleteOne(
    args: TDeleteOneArgs<Partial<ForexGlobal5m>, ForexGlobal5m>,
    tx?: TTransactionArgs,
  ): Promise<ForexGlobal5m> {
    const client = tx ? (tx as StocksPrismaClient) : this.prisma;
    return (await client.forex_global_5m.delete({
      where: { id: args.where.id },
    })) as unknown as ForexGlobal5m;
  }

  async upsertOne(
    args: TUpsertOneArgs<Pick<ForexGlobal5m, 'id'>, ForexGlobal5m>,
    tx?: TTransactionArgs,
  ): Promise<ForexGlobal5m> {
    const client = tx ? (tx as StocksPrismaClient) : this.prisma;
    return (await client.forex_global_5m.upsert({
      where: { id: args.where.id },
      update: args.update,
      create: args.create,
    })) as unknown as ForexGlobal5m;
  }

  // Métodos específicos del dominio
  async findBySymbol(symbol: string): Promise<ForexGlobal5m[]> {
    return (await this.prisma.forex_global_5m.findMany({
      where: { symbol: { equals: symbol } },
      orderBy: { quotedate: 'asc' },
    })) as unknown as ForexGlobal5m[];
  }

  async findBySymbolAndDateRange(symbol: string, from: Date, to: Date): Promise<ForexGlobal5m[]> {
    return (await this.prisma.forex_global_5m.findMany({
      where: {
        symbol: { equals: symbol },
        quotedate: {
          gte: from,
          lte: to,
        },
      },
      orderBy: { quotedate: 'asc' },
    })) as unknown as ForexGlobal5m[];
  }

  async findLatestBySymbol(symbol: string): Promise<ForexGlobal5m | null> {
    return (await this.prisma.forex_global_5m.findFirst({
      where: { symbol: { equals: symbol } },
      orderBy: { quotedate: 'desc' },
    })) as unknown as ForexGlobal5m | null;
  }

  async findByDateRange(from: Date, to: Date): Promise<ForexGlobal5m[]> {
    return (await this.prisma.forex_global_5m.findMany({
      where: {
        quotedate: {
          gte: from,
          lte: to,
        },
      },
      orderBy: { quotedate: 'asc' },
    })) as unknown as ForexGlobal5m[];
  }
}
