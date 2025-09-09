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
import { MarketSplitUsaRepository } from '../../../domain/repositories/stocks/market-split-usa.repository';
import { MarketSplitUsa } from '../../../domain/models/stocks/market-split-usa.model';

@Injectable()
export class PrismaMarketSplitUsaRepository
  implements MarketSplitUsaRepository
{
  constructor(private readonly prisma: StocksPrismaClient) {}

  async findMany(
    args?: TFindManyArgs<MarketSplitUsa, MarketSplitUsa>,
  ): Promise<MarketSplitUsa[]> {
    return (await this.prisma.market_split_usa.findMany({
      where: args?.where,
      skip: args?.skip,
      take: args?.take,
      orderBy: args?.orderBy || { Date: 'asc' },
    })) as unknown as MarketSplitUsa[];
  }

  async findOne(
    args: TFindOneArgs<MarketSplitUsa, MarketSplitUsa>,
  ): Promise<MarketSplitUsa | null> {
    return (await this.prisma.market_split_usa.findFirst({
      where: args.where,
    })) as unknown as MarketSplitUsa | null;
  }

  async count(filters: MarketSplitUsa): Promise<number> {
    return await this.prisma.market_split_usa.count({ where: filters });
  }

  async countMany(
    args?: TCountManyArgs<MarketSplitUsa>,
    tx?: TTransactionArgs,
  ): Promise<number> {
    const client = tx ? (tx as StocksPrismaClient) : this.prisma;
    return await client.market_split_usa.count({ where: args?.where });
  }

  // Implementación de métodos faltantes
  async transaction<T>(fn: (tx: any) => Promise<T>): Promise<T> {
    return await this.prisma.$transaction(fn);
  }

  async createOne(
    args: TCreateOneArgs<MarketSplitUsa, MarketSplitUsa>,
    tx?: TTransactionArgs,
  ): Promise<MarketSplitUsa> {
    const client = tx ? (tx as StocksPrismaClient) : this.prisma;
    return (await client.market_split_usa.create({
      data: args.data,
    })) as MarketSplitUsa;
  }

  async createMany(
    args: TCreateManyArgs<MarketSplitUsa>,
    tx?: TTransactionArgs,
  ): Promise<void> {
    const client = tx ? (tx as StocksPrismaClient) : this.prisma;
    await client.market_split_usa.createMany({ data: args.data });
  }

  async updateOne(
    args: TUpdateOneArgs<Partial<MarketSplitUsa>, MarketSplitUsa>,
    tx?: TTransactionArgs,
  ): Promise<MarketSplitUsa> {
    const client = tx ? (tx as StocksPrismaClient) : this.prisma;
    return (await client.market_split_usa.update({
      where: { Id: args.where.Id },
      data: args.data,
    })) as MarketSplitUsa;
  }

  async deleteOne(
    args: TDeleteOneArgs<Partial<MarketSplitUsa>, MarketSplitUsa>,
    tx?: TTransactionArgs,
  ): Promise<MarketSplitUsa> {
    const client = tx ? (tx as StocksPrismaClient) : this.prisma;
    return (await client.market_split_usa.delete({
      where: { Id: args.where.Id },
    })) as MarketSplitUsa;
  }

  async upsertOne(
    args: TUpsertOneArgs<Partial<MarketSplitUsa>, MarketSplitUsa>,
    tx?: TTransactionArgs,
  ): Promise<MarketSplitUsa> {
    const client = tx ? (tx as StocksPrismaClient) : this.prisma;
    return (await client.market_split_usa.upsert({
      where: { Id: args.where.Id },
      update: args.update,
      create: args.create,
    })) as MarketSplitUsa;
  }

  // Métodos específicos del dominio
  async findByCode(code: string): Promise<MarketSplitUsa[]> {
    return (await this.prisma.market_split_usa.findMany({
      where: { Code: { equals: code } },
      orderBy: { Date: 'asc' },
    })) as MarketSplitUsa[];
  }
}
