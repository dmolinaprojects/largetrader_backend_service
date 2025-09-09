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
import { MarketDataUsaRepository } from '../../../domain/repositories/stocks/market-data-usa.repository';
import { MarketDataUsa } from '../../../domain/models/stocks/market-data-usa.model';

@Injectable()
export class PrismaMarketDataUsaRepository implements MarketDataUsaRepository {
  constructor(private readonly prisma: StocksPrismaClient) {}

  async findMany(
    args?: TFindManyArgs<MarketDataUsa, MarketDataUsa>,
  ): Promise<MarketDataUsa[]> {
    return (await this.prisma.market_datafeed_usa.findMany({
      where: args?.where,
      skip: args?.skip,
      take: args?.take,
      orderBy: args?.orderBy || { quotedate: 'asc' },
    })) as unknown as MarketDataUsa[];
  }

  async findOne(
    args: TFindOneArgs<MarketDataUsa, MarketDataUsa>,
  ): Promise<MarketDataUsa | null> {
    return (await this.prisma.market_datafeed_usa.findFirst({
      where: args.where,
    })) as unknown as MarketDataUsa | null;
  }

  async count(filters: MarketDataUsa): Promise<number> {
    return await this.prisma.market_datafeed_usa.count({ where: filters });
  }

  async countMany(
    args?: TCountManyArgs<MarketDataUsa>,
    tx?: TTransactionArgs,
  ): Promise<number> {
    const client = tx ? (tx as StocksPrismaClient) : this.prisma;
    return await client.market_datafeed_usa.count({ where: args?.where });
  }

  // Implementación de métodos faltantes
  async transaction<T>(fn: (tx: any) => Promise<T>): Promise<T> {
    return await this.prisma.$transaction(fn);
  }

  async createOne(
    args: TCreateOneArgs<MarketDataUsa, MarketDataUsa>,
    tx?: TTransactionArgs,
  ): Promise<MarketDataUsa> {
    const client = tx ? (tx as StocksPrismaClient) : this.prisma;
    return (await client.market_datafeed_usa.create({
      data: args.data,
    })) as MarketDataUsa;
  }

  async createMany(
    args: TCreateManyArgs<MarketDataUsa>,
    tx?: TTransactionArgs,
  ): Promise<void> {
    const client = tx ? (tx as StocksPrismaClient) : this.prisma;
    await client.market_datafeed_usa.createMany({ data: args.data });
  }

  async updateOne(
    args: TUpdateOneArgs<Partial<MarketDataUsa>, MarketDataUsa>,
    tx?: TTransactionArgs,
  ): Promise<MarketDataUsa> {
    const client = tx ? (tx as StocksPrismaClient) : this.prisma;
    return (await client.market_datafeed_usa.update({
      where: { id: args.where.id },
      data: args.data,
    })) as MarketDataUsa;
  }

  async deleteOne(
    args: TDeleteOneArgs<Partial<MarketDataUsa>, MarketDataUsa>,
    tx?: TTransactionArgs,
  ): Promise<MarketDataUsa> {
    const client = tx ? (tx as StocksPrismaClient) : this.prisma;
    return (await client.market_datafeed_usa.delete({
      where: { id: args.where.id },
    })) as MarketDataUsa;
  }

  async upsertOne(
    args: TUpsertOneArgs<Partial<MarketDataUsa>, MarketDataUsa>,
    tx?: TTransactionArgs,
  ): Promise<MarketDataUsa> {
    const client = tx ? (tx as StocksPrismaClient) : this.prisma;
    return (await client.market_datafeed_usa.upsert({
      where: { id: args.where.id },
      update: args.update,
      create: args.create,
    })) as MarketDataUsa;
  }

  // Métodos específicos del dominio
  async findBySymbolAndDateRange(symbol: string, from: Date, to: Date): Promise<MarketDataUsa[]> {
    return (await this.prisma.market_datafeed_usa.findMany({
      where: {
        symbol: { equals: symbol },
        quotedate: {
          gte: from,
          lte: to,
        },
      },
      orderBy: { quotedate: 'asc' },
    })) as MarketDataUsa[];
  }

  async findBySymbol(symbol: string): Promise<MarketDataUsa[]> {
    return (await this.prisma.market_datafeed_usa.findMany({
      where: { symbol: { equals: symbol } },
      orderBy: { quotedate: 'asc' },
    })) as MarketDataUsa[];
  }

  async findLatestBySymbol(symbol: string): Promise<MarketDataUsa | null> {
    return (await this.prisma.market_datafeed_usa.findFirst({
      where: { symbol: { equals: symbol } },
      orderBy: { quotedate: 'desc' },
    })) as MarketDataUsa | null;
  }

  async getDataLimits(symbol: string): Promise<{ earliestDate: number; latestDate: number; totalDataPoints: number }> {
    const [earliest, latest, count] = await Promise.all([
      this.prisma.market_datafeed_usa.findFirst({
        where: { symbol: { equals: symbol } },
        orderBy: { quotedate: 'asc' },
        select: { quotedate: true },
      }),
      this.prisma.market_datafeed_usa.findFirst({
        where: { symbol: { equals: symbol } },
        orderBy: { quotedate: 'desc' },
        select: { quotedate: true },
      }),
      this.prisma.market_datafeed_usa.count({
        where: { symbol: { equals: symbol } },
      }),
    ]);

    console.log(`Data limits query results for ${symbol}:`, {
      earliest: earliest?.quotedate,
      latest: latest?.quotedate,
      count
    });

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
