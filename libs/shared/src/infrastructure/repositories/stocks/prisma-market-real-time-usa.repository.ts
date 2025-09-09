import { Injectable } from '@nestjs/common';
import {
  PrismaClient as StocksPrismaClient,
  market_real_time_usa as PrismaMarketRealTimeUsa,
} from '@prisma/stocks-client';
import { MarketRealTimeUsaRepository } from '../../../domain/repositories/stocks/market-real-time-usa.repository';
import { MarketRealTimeUsa } from '../../../domain/models/stocks/market-real-time-usa.model';
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
export class PrismaMarketRealTimeUsaRepository implements MarketRealTimeUsaRepository {
  constructor(private readonly prisma: StocksPrismaClient) {}

  async findMany(args?: TFindManyArgs<MarketRealTimeUsa, MarketRealTimeUsa>): Promise<MarketRealTimeUsa[]> {
    return (await this.prisma.market_real_time_usa.findMany({
      where: args?.where,
      skip: args?.skip,
      take: args?.take,
      orderBy: args?.orderBy || { Id: 'asc' },
    })) as unknown as MarketRealTimeUsa[];
  }

  async findOne(args: TFindOneArgs<MarketRealTimeUsa, MarketRealTimeUsa>): Promise<MarketRealTimeUsa | null> {
    return (await this.prisma.market_real_time_usa.findFirst({
      where: args.where,
    })) as unknown as MarketRealTimeUsa | null;
  }

  async countMany(args?: TCountManyArgs<MarketRealTimeUsa>, tx?: TTransactionArgs): Promise<number> {
    const client = tx ? (tx as StocksPrismaClient) : this.prisma;
    return await client.market_real_time_usa.count({ where: args?.where });
  }

  async transaction<T>(fn: (tx: any) => Promise<T>): Promise<T> {
    return await this.prisma.$transaction(fn);
  }

  async createOne(
    args: TCreateOneArgs<MarketRealTimeUsa, MarketRealTimeUsa>,
    tx?: TTransactionArgs,
  ): Promise<MarketRealTimeUsa> {
    const client = tx ? (tx as StocksPrismaClient) : this.prisma;
    return (await client.market_real_time_usa.create({
      data: {
        Ticker: args.data.Ticker,
        Type: args.data.Type,
        Open: args.data.Open,
        High: args.data.High,
        Low: args.data.Low,
        Close: args.data.Close,
        UpdateTime: args.data.UpdateTime,
      },
    })) as unknown as MarketRealTimeUsa;
  }

  async createMany(
    args: TCreateManyArgs<MarketRealTimeUsa>,
    tx?: TTransactionArgs,
  ): Promise<void> {
    const client = tx ? (tx as StocksPrismaClient) : this.prisma;
    await client.market_real_time_usa.createMany({
      data: args.data.map(item => ({
        Ticker: item.Ticker,
        Type: item.Type,
        Open: item.Open,
        High: item.High,
        Low: item.Low,
        Close: item.Close,
        UpdateTime: item.UpdateTime,
      })),
    });
  }

  async updateOne(
    args: TUpdateOneArgs<Partial<MarketRealTimeUsa>, MarketRealTimeUsa>,
    tx?: TTransactionArgs,
  ): Promise<MarketRealTimeUsa> {
    const client = tx ? (tx as StocksPrismaClient) : this.prisma;
    return (await client.market_real_time_usa.update({
      where: { Id: args.where.Id },
      data: args.data,
    })) as unknown as MarketRealTimeUsa;
  }

  async deleteOne(
    args: TDeleteOneArgs<Partial<MarketRealTimeUsa>, MarketRealTimeUsa>,
    tx?: TTransactionArgs,
  ): Promise<MarketRealTimeUsa> {
    const client = tx ? (tx as StocksPrismaClient) : this.prisma;
    return (await client.market_real_time_usa.delete({
      where: { Id: args.where.Id },
    })) as unknown as MarketRealTimeUsa;
  }

  async upsertOne(
    args: TUpsertOneArgs<Pick<MarketRealTimeUsa, 'Id'>, MarketRealTimeUsa>,
    tx?: TTransactionArgs,
  ): Promise<MarketRealTimeUsa> {
    const client = tx ? (tx as StocksPrismaClient) : this.prisma;
    return (await client.market_real_time_usa.upsert({
      where: { Id: args.where.Id },
      update: args.update,
      create: args.create,
    })) as unknown as MarketRealTimeUsa;
  }

  // Métodos específicos del dominio
  async findByTicker(ticker: string): Promise<MarketRealTimeUsa | null> {
    return (await this.prisma.market_real_time_usa.findFirst({
      where: { Ticker: { equals: ticker } },
    })) as unknown as MarketRealTimeUsa | null;
  }

  async findByType(type: string): Promise<MarketRealTimeUsa[]> {
    return (await this.prisma.market_real_time_usa.findMany({
      where: { Type: { equals: type } },
      orderBy: { Ticker: 'asc' },
    })) as unknown as MarketRealTimeUsa[];
  }

  async findLatestByTicker(ticker: string): Promise<MarketRealTimeUsa | null> {
    return (await this.prisma.market_real_time_usa.findFirst({
      where: { Ticker: { equals: ticker } },
      orderBy: { UpdateTime: 'desc' },
    })) as unknown as MarketRealTimeUsa | null;
  }

  async updateByTicker(ticker: string, data: Partial<MarketRealTimeUsa>): Promise<MarketRealTimeUsa> {
    return (await this.prisma.market_real_time_usa.update({
      where: { Ticker: ticker },
      data: {
        ...(data.Type && { Type: data.Type }),
        ...(data.Open !== undefined && { Open: data.Open }),
        ...(data.High !== undefined && { High: data.High }),
        ...(data.Low !== undefined && { Low: data.Low }),
        ...(data.Close !== undefined && { Close: data.Close }),
        ...(data.UpdateTime !== undefined && { UpdateTime: data.UpdateTime }),
      },
    })) as unknown as MarketRealTimeUsa;
  }
}
