import { Injectable } from '@nestjs/common';
import { PrismaClient as StocksPrismaClient } from '@prisma/stocks-client';
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
import { MarketDataIndexesD1Repository } from '../../../domain/repositories/stocks/market-data-indexes-d1.repository';
import { MarketDataIndexesD1 } from '../../../domain/models/stocks/market-data-indexes-d1.model';

@Injectable()
export class PrismaMarketDataIndexesD1Repository
  implements MarketDataIndexesD1Repository
{
  constructor(private readonly prisma: StocksPrismaClient) {}

  async findMany(
    args?: TFindManyArgs<MarketDataIndexesD1, MarketDataIndexesD1>,
  ): Promise<MarketDataIndexesD1[]> {
    return (await this.prisma.market_datafeed_indexes_d1.findMany({
      where: args?.where,
      skip: args?.skip,
      take: args?.take,
      orderBy: args?.orderBy || { quotedate: 'asc' },
    })) as unknown as MarketDataIndexesD1[];
  }

  async findOne(
    args: TFindOneArgs<MarketDataIndexesD1, MarketDataIndexesD1>,
  ): Promise<MarketDataIndexesD1 | null> {
    return (await this.prisma.market_datafeed_indexes_d1.findFirst({
      where: args.where,
    })) as unknown as MarketDataIndexesD1 | null;
  }

  async count(filters: MarketDataIndexesD1): Promise<number> {
    return await this.prisma.market_datafeed_indexes_d1.count({
      where: filters,
    });
  }

  async countMany(
    args?: TCountManyArgs<MarketDataIndexesD1>,
    tx?: TTransactionArgs,
  ): Promise<number> {
    const client = tx ? (tx as StocksPrismaClient) : this.prisma;
    return await client.market_datafeed_indexes_d1.count({
      where: args?.where,
    });
  }

  // Implementación de métodos faltantes
  async transaction<T>(fn: (tx: any) => Promise<T>): Promise<T> {
    return await this.prisma.$transaction(fn);
  }

  async createOne(
    args: TCreateOneArgs<MarketDataIndexesD1, MarketDataIndexesD1>,
    tx?: TTransactionArgs,
  ): Promise<MarketDataIndexesD1> {
    const client = tx ? (tx as StocksPrismaClient) : this.prisma;
    return (await client.market_datafeed_indexes_d1.create({
      data: args.data,
    })) as MarketDataIndexesD1;
  }

  async createMany(
    args: TCreateManyArgs<MarketDataIndexesD1>,
    tx?: TTransactionArgs,
  ): Promise<void> {
    const client = tx ? (tx as StocksPrismaClient) : this.prisma;
    await client.market_datafeed_indexes_d1.createMany({ data: args.data });
  }

  async updateOne(
    args: TUpdateOneArgs<Partial<MarketDataIndexesD1>, MarketDataIndexesD1>,
    tx?: TTransactionArgs,
  ): Promise<MarketDataIndexesD1> {
    const client = tx ? (tx as StocksPrismaClient) : this.prisma;
    return (await client.market_datafeed_indexes_d1.update({
      where: { id: args.where.id },
      data: args.data,
    })) as MarketDataIndexesD1;
  }

  async deleteOne(
    args: TDeleteOneArgs<Partial<MarketDataIndexesD1>, MarketDataIndexesD1>,
    tx?: TTransactionArgs,
  ): Promise<MarketDataIndexesD1> {
    const client = tx ? (tx as StocksPrismaClient) : this.prisma;
    return (await client.market_datafeed_indexes_d1.delete({
      where: { id: args.where.id },
    })) as MarketDataIndexesD1;
  }

  async upsertOne(
    args: TUpsertOneArgs<Partial<MarketDataIndexesD1>, MarketDataIndexesD1>,
    tx?: TTransactionArgs,
  ): Promise<MarketDataIndexesD1> {
    const client = tx ? (tx as StocksPrismaClient) : this.prisma;
    return (await client.market_datafeed_indexes_d1.upsert({
      where: { id: args.where.id },
      update: args.update,
      create: args.create,
    })) as MarketDataIndexesD1;
  }

  // Métodos específicos del dominio
  async findBySymbolAndDateRange(symbol: string, from: Date, to: Date): Promise<MarketDataIndexesD1[]> {
    return (await this.prisma.market_datafeed_indexes_d1.findMany({
      where: {
        symbol: { equals: symbol },
        quotedate: {
          gte: from,
          lte: to,
        },
      },
      orderBy: { quotedate: 'asc' },
    })) as MarketDataIndexesD1[];
  }

  async findBySymbol(symbol: string): Promise<MarketDataIndexesD1[]> {
    return (await this.prisma.market_datafeed_indexes_d1.findMany({
      where: { symbol: { equals: symbol } },
      orderBy: { quotedate: 'asc' },
    })) as MarketDataIndexesD1[];
  }

  async findLatestBySymbol(symbol: string): Promise<MarketDataIndexesD1 | null> {
    return (await this.prisma.market_datafeed_indexes_d1.findFirst({
      where: { symbol: { equals: symbol } },
      orderBy: { quotedate: 'desc' },
    })) as MarketDataIndexesD1 | null;
  }

  async getDataLimits(symbol: string): Promise<{ earliestDate: number; latestDate: number; totalDataPoints: number }> {
    const [earliest, latest, count] = await Promise.all([
      this.prisma.market_datafeed_indexes_d1.findFirst({
        where: { symbol: { equals: symbol } },
        orderBy: { quotedate: 'asc' },
        select: { quotedate: true },
      }),
      this.prisma.market_datafeed_indexes_d1.findFirst({
        where: { symbol: { equals: symbol } },
        orderBy: { quotedate: 'desc' },
        select: { quotedate: true },
      }),
      this.prisma.market_datafeed_indexes_d1.count({
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
