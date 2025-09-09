import { Injectable } from '@nestjs/common';
import {
  PrismaClient as StocksPrismaClient,
  forex_global_h1 as PrismaForexGlobalH1,
} from '@prisma/stocks-client';
import { ForexGlobalH1Repository } from '../../../domain/repositories/stocks/forex-global-h1.repository';
import { ForexGlobalH1 } from '../../../domain/models/stocks/forex-global-h1.model';
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
export class PrismaForexGlobalH1Repository implements ForexGlobalH1Repository {
  constructor(private readonly prisma: StocksPrismaClient) {}

  async findMany(args?: TFindManyArgs<ForexGlobalH1, ForexGlobalH1>): Promise<ForexGlobalH1[]> {
    return (await this.prisma.forex_global_h1.findMany({
      where: args?.where,
      skip: args?.skip,
      take: args?.take,
      orderBy: args?.orderBy || { quotedate: 'asc' },
    })) as unknown as ForexGlobalH1[];
  }

  async findOne(args: TFindOneArgs<ForexGlobalH1, ForexGlobalH1>): Promise<ForexGlobalH1 | null> {
    return (await this.prisma.forex_global_h1.findFirst({
      where: args.where,
    })) as unknown as ForexGlobalH1 | null;
  }

  async countMany(args?: TCountManyArgs<ForexGlobalH1>, tx?: TTransactionArgs): Promise<number> {
    const client = tx ? (tx as StocksPrismaClient) : this.prisma;
    return await client.forex_global_h1.count({ where: args?.where });
  }

  async transaction<T>(fn: (tx: any) => Promise<T>): Promise<T> {
    return await this.prisma.$transaction(fn);
  }

  async createOne(
    args: TCreateOneArgs<ForexGlobalH1, ForexGlobalH1>,
    tx?: TTransactionArgs,
  ): Promise<ForexGlobalH1> {
    const client = tx ? (tx as StocksPrismaClient) : this.prisma;
    return (await client.forex_global_h1.create({
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
    })) as unknown as ForexGlobalH1;
  }

  async createMany(
    args: TCreateManyArgs<ForexGlobalH1>,
    tx?: TTransactionArgs,
  ): Promise<void> {
    const client = tx ? (tx as StocksPrismaClient) : this.prisma;
    await client.forex_global_h1.createMany({
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
    args: TUpdateOneArgs<Partial<ForexGlobalH1>, ForexGlobalH1>,
    tx?: TTransactionArgs,
  ): Promise<ForexGlobalH1> {
    const client = tx ? (tx as StocksPrismaClient) : this.prisma;
    return (await client.forex_global_h1.update({
      where: { id: args.where.id },
      data: args.data,
    })) as unknown as ForexGlobalH1;
  }

  async deleteOne(
    args: TDeleteOneArgs<Partial<ForexGlobalH1>, ForexGlobalH1>,
    tx?: TTransactionArgs,
  ): Promise<ForexGlobalH1> {
    const client = tx ? (tx as StocksPrismaClient) : this.prisma;
    return (await client.forex_global_h1.delete({
      where: { id: args.where.id },
    })) as unknown as ForexGlobalH1;
  }

  async upsertOne(
    args: TUpsertOneArgs<Pick<ForexGlobalH1, 'id'>, ForexGlobalH1>,
    tx?: TTransactionArgs,
  ): Promise<ForexGlobalH1> {
    const client = tx ? (tx as StocksPrismaClient) : this.prisma;
    return (await client.forex_global_h1.upsert({
      where: { id: args.where.id },
      update: args.update,
      create: args.create,
    })) as unknown as ForexGlobalH1;
  }

  // Métodos específicos del dominio
  async findBySymbol(symbol: string): Promise<ForexGlobalH1[]> {
    return (await this.prisma.forex_global_h1.findMany({
      where: { symbol: { equals: symbol } },
      orderBy: { quotedate: 'asc' },
    })) as unknown as ForexGlobalH1[];
  }

  async findBySymbolAndDateRange(symbol: string, from: Date, to: Date): Promise<ForexGlobalH1[]> {
    return (await this.prisma.forex_global_h1.findMany({
      where: {
        symbol: { equals: symbol },
        quotedate: {
          gte: from,
          lte: to,
        },
      },
      orderBy: { quotedate: 'asc' },
    })) as unknown as ForexGlobalH1[];
  }

  async findLatestBySymbol(symbol: string): Promise<ForexGlobalH1 | null> {
    return (await this.prisma.forex_global_h1.findFirst({
      where: { symbol: { equals: symbol } },
      orderBy: { quotedate: 'desc' },
    })) as unknown as ForexGlobalH1 | null;
  }

  async findByDateRange(from: Date, to: Date): Promise<ForexGlobalH1[]> {
    return (await this.prisma.forex_global_h1.findMany({
      where: {
        quotedate: {
          gte: from,
          lte: to,
        },
      },
      orderBy: { quotedate: 'asc' },
    })) as unknown as ForexGlobalH1[];
  }
}
