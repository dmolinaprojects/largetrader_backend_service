import { Injectable } from '@nestjs/common';
import {
  PrismaClient as StocksPrismaClient,
  settings as PrismaSettings,
} from '@prisma/stocks-client';
import { SettingsRepository } from '../../../domain/repositories/stocks/settings.repository';
import { Settings } from '../../../domain/models/stocks/settings.model';
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
export class PrismaSettingsRepository implements SettingsRepository {
  constructor(private readonly prisma: StocksPrismaClient) {}

  async findMany(args?: TFindManyArgs<Settings, Settings>): Promise<Settings[]> {
    return (await this.prisma.settings.findMany({
      where: args?.where,
      skip: args?.skip,
      take: args?.take,
      orderBy: args?.orderBy || { name: 'asc' },
    })) as unknown as Settings[];
  }

  async findOne(args: TFindOneArgs<Settings, Settings>): Promise<Settings | null> {
    return (await this.prisma.settings.findFirst({
      where: args.where,
    })) as unknown as Settings | null;
  }

  async countMany(args?: TCountManyArgs<Settings>, tx?: TTransactionArgs): Promise<number> {
    const client = tx ? (tx as StocksPrismaClient) : this.prisma;
    return await client.settings.count({ where: args?.where });
  }

  async transaction<T>(fn: (tx: any) => Promise<T>): Promise<T> {
    return await this.prisma.$transaction(fn);
  }

  async createOne(
    args: TCreateOneArgs<Settings, Settings>,
    tx?: TTransactionArgs,
  ): Promise<Settings> {
    const client = tx ? (tx as StocksPrismaClient) : this.prisma;
    return (await client.settings.create({
      data: {
        name: args.data.name,
        value: args.data.value,
      },
    })) as unknown as Settings;
  }

  async createMany(
    args: TCreateManyArgs<Settings>,
    tx?: TTransactionArgs,
  ): Promise<void> {
    const client = tx ? (tx as StocksPrismaClient) : this.prisma;
    await client.settings.createMany({
      data: args.data.map(item => ({
        name: item.name,
        value: item.value,
      })),
    });
  }

  async updateOne(
    args: TUpdateOneArgs<Partial<Settings>, Settings>,
    tx?: TTransactionArgs,
  ): Promise<Settings> {
    const client = tx ? (tx as StocksPrismaClient) : this.prisma;
    return (await client.settings.update({
      where: { id: args.where.id },
      data: args.data,
    })) as unknown as Settings;
  }

  async deleteOne(
    args: TDeleteOneArgs<Partial<Settings>, Settings>,
    tx?: TTransactionArgs,
  ): Promise<Settings> {
    const client = tx ? (tx as StocksPrismaClient) : this.prisma;
    return (await client.settings.delete({
      where: { id: args.where.id },
    })) as unknown as Settings;
  }

  async upsertOne(
    args: TUpsertOneArgs<Pick<Settings, 'id'>, Settings>,
    tx?: TTransactionArgs,
  ): Promise<Settings> {
    const client = tx ? (tx as StocksPrismaClient) : this.prisma;
    return (await client.settings.upsert({
      where: { id: args.where.id },
      update: args.update,
      create: args.create,
    })) as unknown as Settings;
  }

  // Métodos específicos del dominio
  async findByName(name: string): Promise<Settings | null> {
    return (await this.prisma.settings.findFirst({
      where: { name: { equals: name } },
    })) as unknown as Settings | null;
  }

  async findByNamePattern(pattern: string): Promise<Settings[]> {
    return (await this.prisma.settings.findMany({
      where: { name: { contains: pattern } },
      orderBy: { name: 'asc' },
    })) as unknown as Settings[];
  }

  async updateByName(name: string, value: string): Promise<Settings> {
    return (await this.prisma.settings.update({
      where: { name },
      data: { value: value },
    })) as unknown as Settings;
  }

  async upsertByName(name: string, value: string): Promise<Settings> {
    return (await this.prisma.settings.upsert({
      where: { name },
      update: { value: value },
      create: { name: name, value: value },
    })) as unknown as Settings;
  }
}
