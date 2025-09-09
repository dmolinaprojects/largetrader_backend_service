import { Injectable } from '@nestjs/common';
import {
  PrismaClient as StocksPrismaClient,
  forex_global_d1 as PrismaForexGlobalD1,
} from '@prisma/stocks-client';
import { ForexGlobalD1Repository } from '../../../domain/repositories/stocks/forex-global-d1.repository';
import { ForexGlobalD1 } from '../../../domain/models/stocks/forex-global-d1.model';
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
export class PrismaForexGlobalD1Repository implements ForexGlobalD1Repository {
  constructor(private readonly prisma: StocksPrismaClient) {}

  async findMany(args?: TFindManyArgs<ForexGlobalD1, ForexGlobalD1>): Promise<ForexGlobalD1[]> {
    return (await this.prisma.forex_global_d1.findMany({
      where: args?.where,
      skip: args?.skip,
      take: args?.take,
      orderBy: args?.orderBy || { quotedate: 'asc' },
    })) as unknown as ForexGlobalD1[];
  }

  async findOne(args: TFindOneArgs<ForexGlobalD1, ForexGlobalD1>): Promise<ForexGlobalD1 | null> {
    return (await this.prisma.forex_global_d1.findFirst({
      where: args.where,
    })) as unknown as ForexGlobalD1 | null;
  }

  async countMany(args?: TCountManyArgs<ForexGlobalD1>, tx?: TTransactionArgs): Promise<number> {
    const client = tx ? (tx as StocksPrismaClient) : this.prisma;
    return await client.forex_global_d1.count({ where: args?.where });
  }

  async transaction<T>(fn: (tx: any) => Promise<T>): Promise<T> {
    return await this.prisma.$transaction(fn);
  }

  async createOne(
    args: TCreateOneArgs<ForexGlobalD1, ForexGlobalD1>,
    tx?: TTransactionArgs,
  ): Promise<ForexGlobalD1> {
    const client = tx ? (tx as StocksPrismaClient) : this.prisma;
    return (await client.forex_global_d1.create({
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
    })) as unknown as ForexGlobalD1;
  }

  async createMany(
    args: TCreateManyArgs<ForexGlobalD1>,
    tx?: TTransactionArgs,
  ): Promise<void> {
    const client = tx ? (tx as StocksPrismaClient) : this.prisma;
    await client.forex_global_d1.createMany({
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
    args: TUpdateOneArgs<Partial<ForexGlobalD1>, ForexGlobalD1>,
    tx?: TTransactionArgs,
  ): Promise<ForexGlobalD1> {
    const client = tx ? (tx as StocksPrismaClient) : this.prisma;
    const whereId = args.where.id;
    return (await client.forex_global_d1.update({
      where: { id: whereId },
      data: {
        ...args.data,
      },
    })) as unknown as ForexGlobalD1;
  }

  async deleteOne(
    args: TDeleteOneArgs<Partial<ForexGlobalD1>, ForexGlobalD1>,
    tx?: TTransactionArgs,
  ): Promise<ForexGlobalD1> {
    const client = tx ? (tx as StocksPrismaClient) : this.prisma;
    const whereId = args.where.id;
    return (await client.forex_global_d1.delete({
      where: { id: whereId },
    })) as unknown as ForexGlobalD1;
  }

  async upsertOne(
    args: TUpsertOneArgs<Pick<ForexGlobalD1, 'id'>, ForexGlobalD1>,
    tx?: TTransactionArgs,
  ): Promise<ForexGlobalD1> {
    const client = tx ? (tx as StocksPrismaClient) : this.prisma;
    return (await client.forex_global_d1.upsert({
      where: { id: args.where.id },
      update: args.update,
      create: args.create,
    })) as unknown as ForexGlobalD1;
  }

  // Métodos específicos del dominio
  async findBySymbol(symbol: string): Promise<ForexGlobalD1[]> {
    return (await this.prisma.forex_global_d1.findMany({
      where: { symbol: { equals: symbol } },
      orderBy: { quotedate: 'asc' },
    })) as unknown as ForexGlobalD1[];
  }

  async findBySymbolAndDateRange(symbol: string, from: Date, to: Date): Promise<ForexGlobalD1[]> {
    return (await this.prisma.forex_global_d1.findMany({
      where: {
        symbol: { equals: symbol },
        quotedate: {
          gte: from,
          lte: to,
        },
      },
      orderBy: { quotedate: 'asc' },
    })) as unknown as ForexGlobalD1[];
  }

  async findLatestBySymbol(symbol: string): Promise<ForexGlobalD1 | null> {
    return (await this.prisma.forex_global_d1.findFirst({
      where: { symbol: { equals: symbol } },
      orderBy: { quotedate: 'desc' },
    })) as unknown as ForexGlobalD1 | null;
  }

  async findByDateRange(from: Date, to: Date): Promise<ForexGlobalD1[]> {
    return (await this.prisma.forex_global_d1.findMany({
      where: {
        quotedate: {
          gte: from,
          lte: to,
        },
      },
      orderBy: { quotedate: 'asc' },
    })) as unknown as ForexGlobalD1[];
  }

  async getDataLimits(symbol: string): Promise<{ earliestDate: number; latestDate: number; totalDataPoints: number }> {
    const [earliest, latest, count] = await Promise.all([
      this.prisma.forex_global_d1.findFirst({
        where: { symbol: { equals: symbol } },
        orderBy: { quotedate: 'asc' },
        select: { quotedate: true },
      }),
      this.prisma.forex_global_d1.findFirst({
        where: { symbol: { equals: symbol } },
        orderBy: { quotedate: 'desc' },
        select: { quotedate: true },
      }),
      this.prisma.forex_global_d1.count({
        where: { symbol: { equals: symbol } },
      }),
    ]);

    if (!earliest || !latest) {
      throw new Error(`No data found for symbol ${symbol}`);
    }

    return {
      earliestDate: Math.floor(earliest.quotedate.getTime() / 1000),
      latestDate: Math.floor(latest.quotedate.getTime() / 1000),
      totalDataPoints: count,
    };
  }
}