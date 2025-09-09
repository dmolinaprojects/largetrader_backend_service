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
import { TickersRepository } from '../../../domain/repositories/stocks/tickers.repository';
import { Ticker } from '../../../domain/models/stocks/ticker.model';

@Injectable()
export class PrismaTickersRepository implements TickersRepository {
  constructor(private readonly prisma: StocksPrismaClient) {}

  async findMany(args?: TFindManyArgs<Ticker, Ticker>): Promise<Ticker[]> {
    return (await this.prisma.tickers.findMany({
      where: args?.where,
      skip: args?.skip,
      take: args?.take,
      orderBy: args?.orderBy || { tiker: 'asc' },
    })) as unknown as Ticker[];
  }

  async findOne(args: TFindOneArgs<Ticker, Ticker>): Promise<Ticker | null> {
    return (await this.prisma.tickers.findFirst({
      where: args.where,
    })) as unknown as Ticker | null;
  }

  async count(filters: Partial<Ticker>): Promise<number> {
    return await this.prisma.tickers.count({ where: filters });
  }

  async countMany(
    args?: TCountManyArgs<Ticker>,
    tx?: TTransactionArgs,
  ): Promise<number> {
    const client = tx ? (tx as StocksPrismaClient) : this.prisma;
    return await client.tickers.count({ where: args?.where });
  }

  // Implementación de métodos faltantes
  async transaction<T>(fn: (tx: any) => Promise<T>): Promise<T> {
    return await this.prisma.$transaction(fn);
  }

  async createOne(
    args: TCreateOneArgs<Ticker, Ticker>,
    tx?: TTransactionArgs,
  ): Promise<Ticker> {
    const client = tx ? (tx as StocksPrismaClient) : this.prisma;
    return (await client.tickers.create({ data: args.data })) as Ticker;
  }

  async createMany(
    args: TCreateManyArgs<Ticker>,
    tx?: TTransactionArgs,
  ): Promise<void> {
    const client = tx ? (tx as StocksPrismaClient) : this.prisma;
    await client.tickers.createMany({ data: args.data });
  }

  async updateOne(
    args: TUpdateOneArgs<Partial<Ticker>, Ticker>,
    tx?: TTransactionArgs,
  ): Promise<Ticker> {
    const client = tx ? (tx as StocksPrismaClient) : this.prisma;
    return (await client.tickers.update({
      where: { id: args.where.id },
      data: args.data,
    })) as Ticker;
  }

  async deleteOne(
    args: TDeleteOneArgs<Partial<Ticker>, Ticker>,
    tx?: TTransactionArgs,
  ): Promise<Ticker> {
    const client = tx ? (tx as StocksPrismaClient) : this.prisma;
    return (await client.tickers.delete({
      where: { id: args.where.id },
    })) as Ticker;
  }

  async upsertOne(
    args: TUpsertOneArgs<Partial<Ticker>, Ticker>,
    tx?: TTransactionArgs,
  ): Promise<Ticker> {
    const client = tx ? (tx as StocksPrismaClient) : this.prisma;
    return (await client.tickers.upsert({
      where: { id: args.where.id },
      update: args.update,
      create: args.create,
    })) as Ticker;
  }
}
