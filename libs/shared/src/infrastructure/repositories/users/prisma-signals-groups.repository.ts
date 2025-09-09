import { Injectable } from '@nestjs/common';
import {
  PrismaClient as UsersPrismaClient,
  SignalsGroups as PrismaSignalsGroups,
} from '@prisma/users-client';
import {
  SignalsGroupsRepository,
} from '../../../domain/repositories/users/signals-groups.repository';
import { SignalsGroups } from '../../../domain/models/users/signals-groups.model';
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
export class PrismaSignalsGroupsRepository implements SignalsGroupsRepository {
  constructor(private readonly prisma: UsersPrismaClient) {}

  async findMany(
    args?: TFindManyArgs<SignalsGroups, SignalsGroups>,
  ): Promise<SignalsGroups[]> {
    return (await this.prisma.signalsGroups.findMany({
      where: args?.where,
      skip: args?.skip,
      take: args?.take,
      orderBy: args?.orderBy || { Id: 'desc' },
    })) as unknown as SignalsGroups[];
  }

  async findOne(
    args: TFindOneArgs<SignalsGroups, SignalsGroups>,
  ): Promise<SignalsGroups | null> {
    return (await this.prisma.signalsGroups.findFirst({
      where: args.where,
    })) as unknown as SignalsGroups | null;
  }

  async count(filters: SignalsGroups): Promise<number> {
    return await this.prisma.signalsGroups.count({ where: filters });
  }

  async countMany(
    args?: TCountManyArgs<SignalsGroups>,
    tx?: TTransactionArgs,
  ): Promise<number> {
    const client = tx ? (tx as UsersPrismaClient) : this.prisma;
    return await client.signalsGroups.count({ where: args?.where });
  }

  // Implementación de métodos faltantes
  async transaction<T>(fn: (tx: any) => Promise<T>): Promise<T> {
    return await this.prisma.$transaction(fn);
  }

  async createOne(
    args: TCreateOneArgs<SignalsGroups, SignalsGroups>,
    tx?: TTransactionArgs,
  ): Promise<SignalsGroups> {
    const client = tx ? (tx as UsersPrismaClient) : this.prisma;
    return (await client.signalsGroups.create({
      data: args.data as PrismaSignalsGroups,
    })) as SignalsGroups;
  }

  async createMany(
    args: TCreateManyArgs<SignalsGroups>,
    tx?: TTransactionArgs,
  ): Promise<void> {
    const client = tx ? (tx as UsersPrismaClient) : this.prisma;
    await client.signalsGroups.createMany({
      data: args.data as PrismaSignalsGroups[],
    });
  }

  async updateOne(
    args: TUpdateOneArgs<Partial<SignalsGroups>, SignalsGroups>,
    tx?: TTransactionArgs,
  ): Promise<SignalsGroups> {
    const client = tx ? (tx as UsersPrismaClient) : this.prisma;
    return (await client.signalsGroups.update({
      where: { Id: args.where.Id },
      data: args.data as Partial<PrismaSignalsGroups>,
    })) as SignalsGroups;
  }

  async deleteOne(
    args: TDeleteOneArgs<Partial<SignalsGroups>, SignalsGroups>,
    tx?: TTransactionArgs,
  ): Promise<SignalsGroups> {
    const client = tx ? (tx as UsersPrismaClient) : this.prisma;
    return (await client.signalsGroups.delete({
      where: { Id: args.where.Id },
    })) as SignalsGroups;
  }

  async upsertOne(
    args: TUpsertOneArgs<Partial<SignalsGroups>, SignalsGroups>,
    tx?: TTransactionArgs,
  ): Promise<SignalsGroups> {
    const client = tx ? (tx as UsersPrismaClient) : this.prisma;
    return (await client.signalsGroups.upsert({
      where: { Id: args.where.Id },
      update: args.update as Partial<PrismaSignalsGroups>,
      create: args.create as PrismaSignalsGroups,
    })) as SignalsGroups;
  }

  async findByName(name: string): Promise<SignalsGroups | null> {
    return this.prisma.signalsGroups.findFirst({ where: { Name: name } });
  }

  async findByNameContaining(searchTerm: string): Promise<SignalsGroups[]> {
    return this.prisma.signalsGroups.findMany({
      where: {
        Name: {
          contains: searchTerm,
        },
      },
    });
  }

  async findActiveGroups(): Promise<SignalsGroups[]> {
    return this.prisma.signalsGroups.findMany();
  }

  async countGroups(): Promise<number> {
    return this.prisma.signalsGroups.count();
  }
}
