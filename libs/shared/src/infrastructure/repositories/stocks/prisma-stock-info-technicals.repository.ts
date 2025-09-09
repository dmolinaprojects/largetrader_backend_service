import { Injectable } from '@nestjs/common';
import {
  PrismaClient as UsersPrismaClient,
  StockInfoTechnicals as PrismaStockInfoTechnicals,
} from '@prisma/users-client';
import { StockInfoTechnicalsRepository } from '../../../domain/repositories/stocks/stock-info-technicals.repository';
import { StockInfoTechnicals } from '../../../domain/models/stocks/stock-info-technicals.model';
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
export class PrismaStockInfoTechnicalsRepository
  implements StockInfoTechnicalsRepository
{
  constructor(private readonly prisma: UsersPrismaClient) {}

  async findMany(
    args?: TFindManyArgs<StockInfoTechnicals, StockInfoTechnicals>,
  ): Promise<StockInfoTechnicals[]> {
    return (await this.prisma.stockInfoTechnicals.findMany({
      where: args?.where,
      skip: args?.skip,
      take: args?.take,
      orderBy: args?.orderBy || { Id: 'asc' },
    })) as unknown as StockInfoTechnicals[];
  }

  async findOne(
    args: TFindOneArgs<StockInfoTechnicals, StockInfoTechnicals>,
  ): Promise<StockInfoTechnicals | null> {
    return (await this.prisma.stockInfoTechnicals.findFirst({
      where: args.where,
    })) as unknown as StockInfoTechnicals | null;
  }

  async count(filters: StockInfoTechnicals): Promise<number> {
    return await this.prisma.stockInfoTechnicals.count({ where: filters });
  }

  async countMany(
    args?: TCountManyArgs<StockInfoTechnicals>,
    tx?: TTransactionArgs,
  ): Promise<number> {
    const client = tx ? (tx as UsersPrismaClient) : this.prisma;
    return await client.stockInfoTechnicals.count({ where: args?.where });
  }

  // Implementación de métodos faltantes
  async transaction<T>(fn: (tx: any) => Promise<T>): Promise<T> {
    return await this.prisma.$transaction(fn);
  }

  async createOne(
    args: TCreateOneArgs<StockInfoTechnicals, StockInfoTechnicals>,
    tx?: TTransactionArgs,
  ): Promise<StockInfoTechnicals> {
    const client = tx ? (tx as UsersPrismaClient) : this.prisma;
    return (await client.stockInfoTechnicals.create({
      data: args.data as PrismaStockInfoTechnicals,
    })) as StockInfoTechnicals;
  }

  async createMany(
    args: TCreateManyArgs<StockInfoTechnicals>,
    tx?: TTransactionArgs,
  ): Promise<void> {
    const client = tx ? (tx as UsersPrismaClient) : this.prisma;
    await client.stockInfoTechnicals.createMany({
      data: args.data as PrismaStockInfoTechnicals[],
    });
  }

  async updateOne(
    args: TUpdateOneArgs<Partial<StockInfoTechnicals>, StockInfoTechnicals>,
    tx?: TTransactionArgs,
  ): Promise<StockInfoTechnicals> {
    const client = tx ? (tx as UsersPrismaClient) : this.prisma;
    return (await client.stockInfoTechnicals.update({
      where: { Id: args.where.Id },
      data: args.data as Partial<PrismaStockInfoTechnicals>,
    })) as StockInfoTechnicals;
  }

  async deleteOne(
    args: TDeleteOneArgs<Partial<StockInfoTechnicals>, StockInfoTechnicals>,
    tx?: TTransactionArgs,
  ): Promise<StockInfoTechnicals> {
    const client = tx ? (tx as UsersPrismaClient) : this.prisma;
    return (await client.stockInfoTechnicals.delete({
      where: { Id: args.where.Id },
    })) as StockInfoTechnicals;
  }

  async upsertOne(
    args: TUpsertOneArgs<Partial<StockInfoTechnicals>, StockInfoTechnicals>,
    tx?: TTransactionArgs,
  ): Promise<StockInfoTechnicals> {
    const client = tx ? (tx as UsersPrismaClient) : this.prisma;
    return (await client.stockInfoTechnicals.upsert({
      where: { Id: args.where.Id },
      update: args.update as Partial<PrismaStockInfoTechnicals>,
      create: args.create as PrismaStockInfoTechnicals,
    })) as StockInfoTechnicals;
  }

  async findByStockId(stockId: number): Promise<StockInfoTechnicals | null> {
    const result = await this.prisma.stockInfoTechnicals.findFirst({
      where: { IdStock: stockId },
    });

    return result;
  }

  async findHighPERatioStocks(
    minPeRatio: number,
  ): Promise<StockInfoTechnicals[]> {
    const results = await this.prisma.stockInfoTechnicals.findMany({
      where: { PeRatio: { gte: minPeRatio } },
      orderBy: { PeRatio: 'desc' },
    });

    return results;
  }

  async findHighDividendStocks(
    minDividendYield: number,
  ): Promise<StockInfoTechnicals[]> {
    const results = await this.prisma.stockInfoTechnicals.findMany({
      where: { DividendYield: { gte: minDividendYield } },
      orderBy: { DividendYield: 'desc' },
    });

    return results;
  }

  async findProfitableStocks(
    minProfitMargin: number,
  ): Promise<StockInfoTechnicals[]> {
    const results = await this.prisma.stockInfoTechnicals.findMany({
      where: { ProfitMargin: { gte: minProfitMargin } },
      orderBy: { ProfitMargin: 'desc' },
    });

    return results;
  }
}
