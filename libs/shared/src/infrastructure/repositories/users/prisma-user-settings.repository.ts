import { Injectable } from '@nestjs/common';
import { PrismaClient as UsersPrismaClient, UserSettings as PrismaUserSettings } from '@prisma/users-client';
import { 
  UserSettingsRepository, 
  UserSettingsFilters 
} from '../../../domain/repositories/users/user-settings.repository';
import { UserSettings } from '../../../domain/models/users/user-settings.model';
import { TFindManyArgs, TFindOneArgs, TCreateOneArgs, TUpdateOneArgs, TDeleteOneArgs, TTransactionArgs } from '@app/core';

@Injectable()
export class PrismaUserSettingsRepository implements UserSettingsRepository {
  constructor(private readonly prisma: UsersPrismaClient) {}

  async findMany(args?: TFindManyArgs<UserSettingsFilters, UserSettings>, tx?: TTransactionArgs): Promise<UserSettings[]> {
    const where = args?.where ? this.buildWhereClause(args.where) : {};
    
    const results = await this.prisma.userSettings.findMany({
      where,
      skip: args?.skip,
      take: args?.take,
      orderBy: { Id: 'asc' },
    });

    return results;
  }

  async findOne(args: TFindOneArgs<UserSettingsFilters, UserSettings>, tx?: TTransactionArgs): Promise<UserSettings | null> {
    const where = this.buildWhereClause(args.where);
    
    const result = await this.prisma.userSettings.findFirst({ where });
    
    return result;
  }

  async createOne(args: TCreateOneArgs<UserSettings, UserSettings>, tx?: TTransactionArgs): Promise<UserSettings> {
    const result = await this.prisma.userSettings.create({
      data: args.data as PrismaUserSettings,
    });

    return result;
  }

  async updateOne(args: TUpdateOneArgs<UserSettingsFilters, UserSettings>, tx?: TTransactionArgs): Promise<UserSettings> {
    const result = await this.prisma.userSettings.update({
      where: { Id: args.where.Id },
      data: args.data as Partial<PrismaUserSettings>,
    });

    return result;
  }

  async deleteOne(args: TDeleteOneArgs<UserSettingsFilters, UserSettings>, tx?: TTransactionArgs): Promise<UserSettings> {
    const result = await this.prisma.userSettings.delete({
      where: { Id: args.where.Id },
    });

    return result;
  }

  async count(filters: UserSettingsFilters): Promise<number> {
    const where = this.buildWhereClause(filters);
    return this.prisma.userSettings.count({ where });
  }

  async findByUserId(userId: number): Promise<UserSettings[]> {
    const results = await this.prisma.userSettings.findMany({
      where: { IdUser: userId },
      orderBy: { Id: 'asc' },
    });

    return results;
  }

  async findByUserIdAndName(userId: number, name: string): Promise<UserSettings | null> {
    const result = await this.prisma.userSettings.findFirst({
      where: { 
        IdUser: userId,
        Name: name 
      },
    });

    return result;
  }

  async updateUserSetting(userId: number, name: string, value: string): Promise<UserSettings> {
    const existing = await this.prisma.userSettings.findFirst({
      where: { IdUser: userId, Name: name }
    });

    if (existing) {
      return this.prisma.userSettings.update({
        where: { Id: existing.Id },
        data: { Value: value }
      });
    } else {
      return this.prisma.userSettings.create({
        data: { IdUser: userId, Name: name, Value: value }
      });
    }
  }

  async deleteUserSettings(userId: number): Promise<void> {
    await this.prisma.userSettings.deleteMany({
      where: { IdUser: userId },
    });
  }

  private buildWhereClause(filters: UserSettingsFilters) {
    return {
      ...(filters.Id && { Id: filters.Id }),
      ...(filters.IdUser && { IdUser: filters.IdUser }),
      ...(filters.Name && { Name: { contains: filters.Name } }),
    };
  }
}
