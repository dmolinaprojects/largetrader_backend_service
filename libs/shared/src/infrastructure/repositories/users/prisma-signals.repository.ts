import { Injectable } from '@nestjs/common';
import {
  PrismaClient as UsersPrismaClient,
  Signals as PrismaSignals,
} from '@prisma/users-client';
import { SignalsRepository } from '../../../domain/repositories/users/signals.repository';
import { Signals } from '../../../domain/models/users/signals.model';
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
export class PrismaSignalsRepository implements SignalsRepository {
  constructor(private readonly prisma: UsersPrismaClient) {}

  async findMany(args?: TFindManyArgs<Signals, Signals>): Promise<Signals[]> {
    return (await this.prisma.signals.findMany({
      where: args?.where,
      skip: args?.skip,
      take: args?.take,
      orderBy: args?.orderBy || { Id: 'desc' },
    })) as unknown as Signals[];
  }

  async findOne(args: TFindOneArgs<Signals, Signals>): Promise<Signals | null> {
    return (await this.prisma.signals.findFirst({
      where: args.where,
    })) as unknown as Signals | null;
  }

  async count(filters: Signals): Promise<number> {
    return await this.prisma.signals.count({ where: filters });
  }

  async countMany(
    args?: TCountManyArgs<Signals>,
    tx?: TTransactionArgs,
  ): Promise<number> {
    const client = tx ? (tx as UsersPrismaClient) : this.prisma;
    return await client.signals.count({ where: args?.where });
  }

  // Implementación de métodos faltantes
  async transaction<T>(fn: (tx: any) => Promise<T>): Promise<T> {
    return await this.prisma.$transaction(fn);
  }

  async createOne(
    args: TCreateOneArgs<Signals, Signals>,
    tx?: TTransactionArgs,
  ): Promise<Signals> {
    const client = tx ? (tx as UsersPrismaClient) : this.prisma;
    return (await client.signals.create({
      data: args.data as PrismaSignals,
    })) as Signals;
  }

  async createMany(
    args: TCreateManyArgs<Signals>,
    tx?: TTransactionArgs,
  ): Promise<void> {
    const client = tx ? (tx as UsersPrismaClient) : this.prisma;
    await client.signals.createMany({ data: args.data as PrismaSignals[] });
  }

  async updateOne(
    args: TUpdateOneArgs<Partial<Signals>, Signals>,
    tx?: TTransactionArgs,
  ): Promise<Signals> {
    const client = tx ? (tx as UsersPrismaClient) : this.prisma;
    return (await client.signals.update({
      where: { Id: args.where.Id },
      data: args.data as Partial<PrismaSignals>,
    })) as Signals;
  }

  async deleteOne(
    args: TDeleteOneArgs<Partial<Signals>, Signals>,
    tx?: TTransactionArgs,
  ): Promise<Signals> {
    const client = tx ? (tx as UsersPrismaClient) : this.prisma;
    return (await client.signals.delete({
      where: { Id: args.where.Id },
    })) as Signals;
  }

  async upsertOne(
    args: TUpsertOneArgs<Partial<Signals>, Signals>,
    tx?: TTransactionArgs,
  ): Promise<Signals> {
    const client = tx ? (tx as UsersPrismaClient) : this.prisma;
    return (await client.signals.upsert({
      where: { Id: args.where.Id },
      update: args.update as Partial<PrismaSignals>,
      create: args.create as PrismaSignals,
    })) as Signals;
  }

  async findByGroup(groupId: number): Promise<Signals[]> {
    return this.prisma.signals.findMany({ where: { IdGroup: groupId } });
  }

  async findByTicker(ticker: string): Promise<Signals[]> {
    return this.prisma.signals.findMany({ where: { Ticker: ticker } });
  }

  async findByOrderType(orderType: string): Promise<Signals[]> {
    return this.prisma.signals.findMany({ where: { OrderType: orderType } });
  }

  async findByDateRange(startDate: Date, endDate: Date): Promise<Signals[]> {
    return this.prisma.signals.findMany({
      where: {
        DateSignal: {
          gte: startDate,
          lte: endDate,
        },
      },
    });
  }

  async findByPriceRange(
    minPrice: number,
    maxPrice: number,
  ): Promise<Signals[]> {
    return this.prisma.signals.findMany({
      where: {
        Price: {
          gte: minPrice,
          lte: maxPrice,
        },
      },
    });
  }

  async findRecentSignals(days: number): Promise<Signals[]> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    return this.prisma.signals.findMany({
      where: {
        DateSignal: {
          gte: startDate,
        },
      },
    });
  }

  async findSignalsByGroupAndTicker(
    groupId: number,
    ticker: string,
  ): Promise<Signals[]> {
    return this.prisma.signals.findMany({
      where: {
        IdGroup: groupId,
        Ticker: ticker,
      },
    });
  }

  async findSignalsByGroupAndDateRange(
    groupId: number,
    startDate: Date,
    endDate: Date,
  ): Promise<Signals[]> {
    return this.prisma.signals.findMany({
      where: {
        IdGroup: groupId,
        DateSignal: {
          gte: startDate,
          lte: endDate,
        },
      },
    });
  }

  async countSignalsByGroup(groupId: number): Promise<number> {
    return this.prisma.signals.count({ where: { IdGroup: groupId } });
  }

  async countSignalsByTicker(ticker: string): Promise<number> {
    return this.prisma.signals.count({ where: { Ticker: ticker } });
  }
}
