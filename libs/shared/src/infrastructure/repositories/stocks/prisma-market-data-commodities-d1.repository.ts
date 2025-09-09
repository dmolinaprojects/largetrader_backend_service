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
import { MarketDataCommoditiesD1Repository } from '../../../domain/repositories/stocks/market-data-commodities-d1.repository';
import { MarketDataCommoditiesD1 } from '../../../domain/models/stocks/market-data-commodities-d1.model';

@Injectable()
export class PrismaMarketDataCommoditiesD1Repository
  implements MarketDataCommoditiesD1Repository
{
  constructor(private readonly prisma: StocksPrismaClient) {}

  async findMany(
    args?: TFindManyArgs<MarketDataCommoditiesD1, MarketDataCommoditiesD1>,
  ): Promise<MarketDataCommoditiesD1[]> {
    return (await this.prisma.market_datafeed_commodities_d1.findMany({
      where: args?.where,
      skip: args?.skip,
      take: args?.take,
      orderBy: args?.orderBy || { quotedate: 'asc' },
    })) as unknown as MarketDataCommoditiesD1[];
  }

  async findOne(
    args: TFindOneArgs<MarketDataCommoditiesD1, MarketDataCommoditiesD1>,
  ): Promise<MarketDataCommoditiesD1 | null> {
    return (await this.prisma.market_datafeed_commodities_d1.findFirst({
      where: args.where,
    })) as unknown as MarketDataCommoditiesD1 | null;
  }

  async count(filters: MarketDataCommoditiesD1): Promise<number> {
    return await this.prisma.market_datafeed_commodities_d1.count({
      where: filters,
    });
  }

  async countMany(
    args?: TCountManyArgs<MarketDataCommoditiesD1>,
    tx?: TTransactionArgs,
  ): Promise<number> {
    const client = tx ? (tx as StocksPrismaClient) : this.prisma;
    return await client.market_datafeed_commodities_d1.count({
      where: args?.where,
    });
  }

  // Implementación de métodos faltantes
  async transaction<T>(fn: (tx: any) => Promise<T>): Promise<T> {
    return await this.prisma.$transaction(fn);
  }

  async createOne(
    args: TCreateOneArgs<MarketDataCommoditiesD1, MarketDataCommoditiesD1>,
    tx?: TTransactionArgs,
  ): Promise<MarketDataCommoditiesD1> {
    const client = tx ? (tx as StocksPrismaClient) : this.prisma;
    return (await client.market_datafeed_commodities_d1.create({
      data: args.data,
    })) as MarketDataCommoditiesD1;
  }

  async createMany(
    args: TCreateManyArgs<MarketDataCommoditiesD1>,
    tx?: TTransactionArgs,
  ): Promise<void> {
    const client = tx ? (tx as StocksPrismaClient) : this.prisma;
    await client.market_datafeed_commodities_d1.createMany({ data: args.data });
  }

  async updateOne(
    args: TUpdateOneArgs<
      Partial<MarketDataCommoditiesD1>,
      MarketDataCommoditiesD1
    >,
    tx?: TTransactionArgs,
  ): Promise<MarketDataCommoditiesD1> {
    const client = tx ? (tx as StocksPrismaClient) : this.prisma;
    return (await client.market_datafeed_commodities_d1.update({
      where: { id: args.where.id },
      data: args.data,
    })) as MarketDataCommoditiesD1;
  }

  async deleteOne(
    args: TDeleteOneArgs<
      Partial<MarketDataCommoditiesD1>,
      MarketDataCommoditiesD1
    >,
    tx?: TTransactionArgs,
  ): Promise<MarketDataCommoditiesD1> {
    const client = tx ? (tx as StocksPrismaClient) : this.prisma;
    return (await client.market_datafeed_commodities_d1.delete({
      where: { id: args.where.id },
    })) as MarketDataCommoditiesD1;
  }

  async upsertOne(
    args: TUpsertOneArgs<
      Partial<MarketDataCommoditiesD1>,
      MarketDataCommoditiesD1
    >,
    tx?: TTransactionArgs,
  ): Promise<MarketDataCommoditiesD1> {
    const client = tx ? (tx as StocksPrismaClient) : this.prisma;
    return (await client.market_datafeed_commodities_d1.upsert({
      where: { id: args.where.id },
      update: args.update,
      create: args.create,
    })) as MarketDataCommoditiesD1;
  }

  // Métodos específicos del dominio
  async findBySymbolAndDateRange(symbol: string, from: Date, to: Date): Promise<MarketDataCommoditiesD1[]> {
    return (await this.prisma.market_datafeed_commodities_d1.findMany({
      where: {
        symbol: { equals: symbol },
        quotedate: {
          gte: from,
          lte: to,
        },
      },
      orderBy: { quotedate: 'asc' },
    })) as MarketDataCommoditiesD1[];
  }

  async findBySymbol(symbol: string): Promise<MarketDataCommoditiesD1[]> {
    return (await this.prisma.market_datafeed_commodities_d1.findMany({
      where: { symbol: { equals: symbol } },
      orderBy: { quotedate: 'asc' },
    })) as MarketDataCommoditiesD1[];
  }

  async findLatestBySymbol(symbol: string): Promise<MarketDataCommoditiesD1 | null> {
    return (await this.prisma.market_datafeed_commodities_d1.findFirst({
      where: { symbol: { equals: symbol } },
      orderBy: { quotedate: 'desc' },
    })) as MarketDataCommoditiesD1 | null;
  }

  async getDataLimits(symbol: string): Promise<{ earliestDate: number; latestDate: number; totalDataPoints: number }> {
    const [earliest, latest, count] = await Promise.all([
      this.prisma.market_datafeed_commodities_d1.findFirst({
        where: { symbol: { equals: symbol } },
        orderBy: { quotedate: 'asc' },
        select: { quotedate: true },
      }),
      this.prisma.market_datafeed_commodities_d1.findFirst({
        where: { symbol: { equals: symbol } },
        orderBy: { quotedate: 'desc' },
        select: { quotedate: true },
      }),
      this.prisma.market_datafeed_commodities_d1.count({
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
