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
import { CryptoGlobalD1Repository } from '../../../domain/repositories/stocks/crypto-global-d1.repository';

import { CryptoGlobalD1 } from '../../../domain/models/stocks/crypto-global-d1.model';

@Injectable()
export class PrismaCryptoGlobalD1Repository
  implements CryptoGlobalD1Repository
{
  constructor(private readonly prisma: StocksPrismaClient) {}

  async findMany(
    args?: TFindManyArgs<CryptoGlobalD1, CryptoGlobalD1>,
  ): Promise<CryptoGlobalD1[]> {
    return (await this.prisma.crypto_global_d1.findMany({
      where: args?.where,
      skip: args?.skip,
      take: args?.take,
      orderBy: args?.orderBy || { OpenTime: 'asc' },
    })) as unknown as CryptoGlobalD1[];
  }

  async findOne(
    args: TFindOneArgs<CryptoGlobalD1, CryptoGlobalD1>,
  ): Promise<CryptoGlobalD1 | null> {
    return (await this.prisma.crypto_global_d1.findFirst({
      where: args.where,
    })) as unknown as CryptoGlobalD1 | null;
  }

  async count(filters: CryptoGlobalD1): Promise<number> {
    return await this.prisma.crypto_global_d1.count({ where: filters });
  }

  async countMany(
    args?: TCountManyArgs<CryptoGlobalD1>,
    tx?: TTransactionArgs,
  ): Promise<number> {
    const client = tx ? (tx as StocksPrismaClient) : this.prisma;
    return await client.crypto_global_d1.count({ where: args?.where });
  }

  // Implementación de métodos faltantes
  async transaction<T>(fn: (tx: any) => Promise<T>): Promise<T> {
    return await this.prisma.$transaction(fn);
  }

  async createOne(
    args: TCreateOneArgs<CryptoGlobalD1, CryptoGlobalD1>,
    tx?: TTransactionArgs,
  ): Promise<CryptoGlobalD1> {
    const client = tx ? (tx as StocksPrismaClient) : this.prisma;
    return (await client.crypto_global_d1.create({
      data: args.data,
    })) as CryptoGlobalD1;
  }

  async createMany(
    args: TCreateManyArgs<CryptoGlobalD1>,
    tx?: TTransactionArgs,
  ): Promise<void> {
    const client = tx ? (tx as StocksPrismaClient) : this.prisma;
    await client.crypto_global_d1.createMany({ data: args.data });
  }

  async updateOne(
    args: TUpdateOneArgs<Partial<CryptoGlobalD1>, CryptoGlobalD1>,
    tx?: TTransactionArgs,
  ): Promise<CryptoGlobalD1> {
    const client = tx ? (tx as StocksPrismaClient) : this.prisma;
    return (await client.crypto_global_d1.update({
      where: { id: args.where.id },
      data: args.data,
    })) as CryptoGlobalD1;
  }

  async deleteOne(
    args: TDeleteOneArgs<Partial<CryptoGlobalD1>, CryptoGlobalD1>,
    tx?: TTransactionArgs,
  ): Promise<CryptoGlobalD1> {
    const client = tx ? (tx as StocksPrismaClient) : this.prisma;
    return (await client.crypto_global_d1.delete({
      where: { id: args.where.id },
    })) as CryptoGlobalD1;
  }

  async upsertOne(
    args: TUpsertOneArgs<Partial<CryptoGlobalD1>, CryptoGlobalD1>,
    tx?: TTransactionArgs,
  ): Promise<CryptoGlobalD1> {
    const client = tx ? (tx as StocksPrismaClient) : this.prisma;
    return (await client.crypto_global_d1.upsert({
      where: { id: args.where.id },
      update: args.update,
      create: args.create,
    })) as CryptoGlobalD1;
  }

  // Métodos específicos del dominio
  async findBySymbolAndDateRange(symbol: string, from: Date, to: Date): Promise<CryptoGlobalD1[]> {
    return (await this.prisma.crypto_global_d1.findMany({
      where: {
        Symbol: { equals: symbol },
        OpenTime: {
          gte: from,
          lte: to,
        },
      },
      orderBy: { OpenTime: 'asc' },
    })) as CryptoGlobalD1[];
  }

  async findBySymbol(symbol: string): Promise<CryptoGlobalD1[]> {
    return (await this.prisma.crypto_global_d1.findMany({
      where: { Symbol: { equals: symbol } },
      orderBy: { OpenTime: 'asc' },
    })) as CryptoGlobalD1[];
  }

  async findLatestBySymbol(symbol: string): Promise<CryptoGlobalD1 | null> {
    return (await this.prisma.crypto_global_d1.findFirst({
      where: { Symbol: { equals: symbol } },
      orderBy: { OpenTime: 'desc' },
    })) as CryptoGlobalD1 | null;
  }

  async getDataLimits(symbol: string): Promise<{ earliestDate: number; latestDate: number; totalDataPoints: number }> {
    const [earliest, latest, count] = await Promise.all([
      this.prisma.crypto_global_d1.findFirst({
        where: { Symbol: { equals: symbol } },
        orderBy: { OpenTime: 'asc' },
        select: { OpenTime: true },
      }),
      this.prisma.crypto_global_d1.findFirst({
        where: { Symbol: { equals: symbol } },
        orderBy: { OpenTime: 'desc' },
        select: { OpenTime: true },
      }),
      this.prisma.crypto_global_d1.count({
        where: { Symbol: { equals: symbol } },
      }),
    ]);

    if (!earliest || !latest) {
      throw new Error(`No data found for symbol ${symbol}`);
    }

    return {
      earliestDate: Math.floor(earliest.OpenTime.getTime() / 1000),
      latestDate: Math.floor(latest.OpenTime.getTime() / 1000),
      totalDataPoints: count,
    };
  }
}
