import { Injectable } from '@nestjs/common';
import {
  PrismaClient as UsersPrismaClient,
  UserSettings as PrismaUserSettings,
} from '@prisma/users-client';
import { UserSettingsRepository } from '../../../domain/repositories/users/user-settings.repository';
import { UserSettings } from '../../../domain/models/users/user-settings.model';
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
export class PrismaUserSettingsRepository implements UserSettingsRepository {
  constructor(private readonly prisma: UsersPrismaClient) {}

  async findMany(args?: TFindManyArgs<UserSettings, UserSettings>): Promise<UserSettings[]> {
    return (await this.prisma.userSettings.findMany({
      where: args?.where,
      skip: args?.skip,
      take: args?.take,
      orderBy: args?.orderBy || { Id: 'asc' },
    })) as unknown as UserSettings[];
  }

  async findOne(args: TFindOneArgs<UserSettings, UserSettings>): Promise<UserSettings | null> {
    return (await this.prisma.userSettings.findFirst({
      where: args.where,
    })) as unknown as UserSettings | null;
  }

  async count(filters: UserSettings): Promise<number> {
    return await this.prisma.userSettings.count({ where: filters });
  }

  async countMany(args?: TCountManyArgs<UserSettings>, tx?: TTransactionArgs): Promise<number> {
    const client = tx ? (tx as UsersPrismaClient) : this.prisma;
    return await client.userSettings.count({ where: args?.where });
  }

  // Implementación de métodos faltantes
  async transaction<T>(fn: (tx: any) => Promise<T>): Promise<T> {
    return await this.prisma.$transaction(fn);
  }

  async createOne(args: TCreateOneArgs<UserSettings, UserSettings>, tx?: TTransactionArgs): Promise<UserSettings> {
    const client = tx ? (tx as UsersPrismaClient) : this.prisma;
    return (await client.userSettings.create({ data: args.data as PrismaUserSettings })) as UserSettings;
  }

  async createMany(args: TCreateManyArgs<UserSettings>, tx?: TTransactionArgs): Promise<void> {
    const client = tx ? (tx as UsersPrismaClient) : this.prisma;
    await client.userSettings.createMany({ data: args.data as PrismaUserSettings[] });
  }

  async updateOne(args: TUpdateOneArgs<Partial<UserSettings>, UserSettings>, tx?: TTransactionArgs): Promise<UserSettings> {
    const client = tx ? (tx as UsersPrismaClient) : this.prisma;
    return (await client.userSettings.update({ 
      where: { Id: args.where.Id }, 
      data: args.data as Partial<PrismaUserSettings> 
    })) as UserSettings;
  }

  async deleteOne(args: TDeleteOneArgs<Partial<UserSettings>, UserSettings>, tx?: TTransactionArgs): Promise<UserSettings> {
    const client = tx ? (tx as UsersPrismaClient) : this.prisma;
    return (await client.userSettings.delete({ where: { Id: args.where.Id } })) as UserSettings;
  }

  async upsertOne(args: TUpsertOneArgs<Partial<UserSettings>, UserSettings>, tx?: TTransactionArgs): Promise<UserSettings> {
    const client = tx ? (tx as UsersPrismaClient) : this.prisma;
    return (await client.userSettings.upsert({ 
      where: { Id: args.where.Id }, 
      update: args.update as Partial<PrismaUserSettings>, 
      create: args.create as PrismaUserSettings 
    })) as UserSettings;
  }

  async findByUserId(userId: number): Promise<UserSettings[]> {
    const results = await this.prisma.userSettings.findMany({
      where: { IdUser: userId },
      orderBy: { Id: 'asc' },
    });

    return results;
  }

  async findByUserIdAndName(
    userId: number,
    name: string,
  ): Promise<UserSettings | null> {
    const result = await this.prisma.userSettings.findFirst({
      where: {
        IdUser: userId,
        Name: name,
      },
    });

    return result;
  }

  async updateUserSetting(
    userId: number,
    name: string,
    value: string,
  ): Promise<UserSettings> {
    const existing = await this.prisma.userSettings.findFirst({
      where: { IdUser: userId, Name: name },
    });

    if (existing) {
      return this.prisma.userSettings.update({
        where: { Id: existing.Id },
        data: { Value: value },
      });
    } else {
      return this.prisma.userSettings.create({
        data: { IdUser: userId, Name: name, Value: value },
      });
    }
  }

  async deleteUserSettings(userId: number): Promise<void> {
    await this.prisma.userSettings.deleteMany({
      where: { IdUser: userId },
    });
  }

}
