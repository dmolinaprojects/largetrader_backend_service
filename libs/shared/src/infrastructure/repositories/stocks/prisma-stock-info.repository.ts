import { Injectable } from '@nestjs/common';
import {
  PrismaClient as UsersPrismaClient,
  StockInfo as PrismaStockInfo,
} from '@prisma/users-client';
import { StockInfoRepository } from '../../../domain/repositories/stocks/stock-info.repository';
import { StockInfo } from '../../../domain/models/stocks/stock-info.model';
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
export class PrismaStockInfoRepository implements StockInfoRepository {
  constructor(private readonly prisma: UsersPrismaClient) {}

  async findMany(
    args?: TFindManyArgs<StockInfo, StockInfo>,
  ): Promise<StockInfo[]> {
    return (await this.prisma.stockInfo.findMany({
      where: args?.where,
      skip: args?.skip,
      take: args?.take,
      orderBy: args?.orderBy || { Ticker: 'asc' },
    })) as unknown as StockInfo[];
  }

  async findOne(
    args: TFindOneArgs<StockInfo, StockInfo>,
  ): Promise<StockInfo | null> {
    return (await this.prisma.stockInfo.findFirst({
      where: args.where,
    })) as unknown as StockInfo | null;
  }

  async count(filters: StockInfo): Promise<number> {
    return await this.prisma.stockInfo.count({ where: filters });
  }

  async countMany(
    args?: TCountManyArgs<StockInfo>,
    tx?: TTransactionArgs,
  ): Promise<number> {
    const client = tx ? (tx as UsersPrismaClient) : this.prisma;
    return await client.stockInfo.count({ where: args?.where });
  }

  // Implementación de métodos faltantes
  async transaction<T>(fn: (tx: any) => Promise<T>): Promise<T> {
    return await this.prisma.$transaction(fn);
  }

  async createOne(
    args: TCreateOneArgs<StockInfo, StockInfo>,
    tx?: TTransactionArgs,
  ): Promise<StockInfo> {
    const client = tx ? (tx as UsersPrismaClient) : this.prisma;
    return (await client.stockInfo.create({
      data: args.data as PrismaStockInfo,
    })) as StockInfo;
  }

  async createMany(
    args: TCreateManyArgs<StockInfo>,
    tx?: TTransactionArgs,
  ): Promise<void> {
    const client = tx ? (tx as UsersPrismaClient) : this.prisma;
    await client.stockInfo.createMany({ data: args.data as PrismaStockInfo[] });
  }

  async updateOne(
    args: TUpdateOneArgs<Partial<StockInfo>, StockInfo>,
    tx?: TTransactionArgs,
  ): Promise<StockInfo> {
    const client = tx ? (tx as UsersPrismaClient) : this.prisma;
    return (await client.stockInfo.update({
      where: { Id: args.where.Id },
      data: args.data as Partial<PrismaStockInfo>,
    })) as StockInfo;
  }

  async deleteOne(
    args: TDeleteOneArgs<Partial<StockInfo>, StockInfo>,
    tx?: TTransactionArgs,
  ): Promise<StockInfo> {
    const client = tx ? (tx as UsersPrismaClient) : this.prisma;
    return (await client.stockInfo.delete({
      where: { Id: args.where.Id },
    })) as StockInfo;
  }

  async upsertOne(
    args: TUpsertOneArgs<Partial<StockInfo>, StockInfo>,
    tx?: TTransactionArgs,
  ): Promise<StockInfo> {
    const client = tx ? (tx as UsersPrismaClient) : this.prisma;
    return (await client.stockInfo.upsert({
      where: { Id: args.where.Id },
      update: args.update as Partial<PrismaStockInfo>,
      create: args.create as PrismaStockInfo,
    })) as StockInfo;
  }

  async findByTicker(ticker: string): Promise<StockInfo | null> {
    const result = await this.prisma.stockInfo.findFirst({
      where: { Ticker: ticker },
    });

    return result;
  }

  async findByExchange(exchange: string): Promise<StockInfo[]> {
    const results = await this.prisma.stockInfo.findMany({
      where: { Exchange: exchange },
      orderBy: { Ticker: 'asc' },
    });

    return results;
  }

  async findBySector(sector: string): Promise<StockInfo[]> {
    const results = await this.prisma.stockInfo.findMany({
      where: { Sector: sector },
      orderBy: { Ticker: 'asc' },
    });

    return results;
  }

  async findByIndustry(industry: string): Promise<StockInfo[]> {
    const results = await this.prisma.stockInfo.findMany({
      where: { Industry: industry },
      orderBy: { Ticker: 'asc' },
    });

    return results;
  }

  async findActiveStocks(): Promise<StockInfo[]> {
    const results = await this.prisma.stockInfo.findMany({
      where: { IsDelisted: false },
      orderBy: { Ticker: 'asc' },
    });

    return results;
  }
}
