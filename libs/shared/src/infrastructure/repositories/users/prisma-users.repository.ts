import { Injectable } from '@nestjs/common';
import {
  PrismaClient as UsersPrismaClient,
  Users as PrismaUsers,
} from '@prisma/users-client';
import {
  UsersRepository,
} from '../../../domain/repositories/users/users.repository';
import { Users } from '../../../domain/models/users/users.model';
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
export class PrismaUsersRepository implements UsersRepository {
  constructor(private readonly prisma: UsersPrismaClient) {}

  async findMany(args?: TFindManyArgs<Users, Users>): Promise<Users[]> {
    return (await this.prisma.users.findMany({
      where: args?.where,
      skip: args?.skip,
      take: args?.take,
      orderBy: args?.orderBy || { Id: 'desc' },
    })) as unknown as Users[];
  }

  async findOne(args: TFindOneArgs<Users, Users>): Promise<Users | null> {
    return (await this.prisma.users.findFirst({
      where: args.where,
    })) as unknown as Users | null;
  }

  async count(filters: Users): Promise<number> {
    return await this.prisma.users.count({ where: filters });
  }

  async countMany(
    args?: TCountManyArgs<Users>,
    tx?: TTransactionArgs,
  ): Promise<number> {
    const client = tx ? (tx as UsersPrismaClient) : this.prisma;
    return await client.users.count({ where: args?.where });
  }

  // Implementación de métodos faltantes
  async transaction<T>(fn: (tx: any) => Promise<T>): Promise<T> {
    return await this.prisma.$transaction(fn);
  }

  async createOne(
    args: TCreateOneArgs<Users, Users>,
    tx?: TTransactionArgs,
  ): Promise<Users> {
    const client = tx ? (tx as UsersPrismaClient) : this.prisma;
    return (await client.users.create({
      data: args.data as PrismaUsers,
    })) as Users;
  }

  async createMany(
    args: TCreateManyArgs<Users>,
    tx?: TTransactionArgs,
  ): Promise<void> {
    const client = tx ? (tx as UsersPrismaClient) : this.prisma;
    await client.users.createMany({ data: args.data as PrismaUsers[] });
  }

  async updateOne(
    args: TUpdateOneArgs<Partial<Users>, Users>,
    tx?: TTransactionArgs,
  ): Promise<Users> {
    const client = tx ? (tx as UsersPrismaClient) : this.prisma;
    return (await client.users.update({
      where: { Id: args.where.Id },
      data: args.data as Partial<PrismaUsers>,
    })) as Users;
  }

  async deleteOne(
    args: TDeleteOneArgs<Partial<Users>, Users>,
    tx?: TTransactionArgs,
  ): Promise<Users> {
    const client = tx ? (tx as UsersPrismaClient) : this.prisma;
    return (await client.users.delete({
      where: { Id: args.where.Id },
    })) as Users;
  }

  async upsertOne(
    args: TUpsertOneArgs<Partial<Users>, Users>,
    tx?: TTransactionArgs,
  ): Promise<Users> {
    const client = tx ? (tx as UsersPrismaClient) : this.prisma;
    return (await client.users.upsert({
      where: { Id: args.where.Id },
      update: args.update as Partial<PrismaUsers>,
      create: args.create as PrismaUsers,
    })) as Users;
  }

  async findByEmail(email: string): Promise<Users | null> {
    const result = await this.prisma.users.findFirst({
      where: { Email: email },
    });

    return result;
  }

  async findByGoogleId(googleId: string): Promise<Users | null> {
    const result = await this.prisma.users.findFirst({
      where: { GoogleId: googleId },
    });

    return result;
  }

  async findByFacebookId(facebookId: string): Promise<Users | null> {
    const result = await this.prisma.users.findFirst({
      where: { FacebookId: facebookId },
    });

    return result;
  }

  async findByToken(token: string): Promise<Users | null> {
    const result = await this.prisma.users.findFirst({
      where: { Token: token },
    });

    return result;
  }

  async findByTokenApp(tokenApp: string): Promise<Users | null> {
    const result = await this.prisma.users.findFirst({
      where: { TokenApp: tokenApp },
    });

    return result;
  }

  async findAdmins(): Promise<Users[]> {
    const results = await this.prisma.users.findMany({
      where: { Admin: true },
      orderBy: { Id: 'asc' },
    });

    return results;
  }

  async findPublishers(): Promise<Users[]> {
    const results = await this.prisma.users.findMany({
      where: { Publisher: true },
      orderBy: { Id: 'asc' },
    });

    return results;
  }

  async findByCountry(countryId: number): Promise<Users[]> {
    const results = await this.prisma.users.findMany({
      where: { Country: countryId },
      orderBy: { Id: 'asc' },
    });

    return results;
  }

  async findByLanguage(language: string): Promise<Users[]> {
    const results = await this.prisma.users.findMany({
      where: { Language: language },
      orderBy: { Id: 'asc' },
    });

    return results;
  }

  async findByActiveCampaign(): Promise<Users[]> {
    const results = await this.prisma.users.findMany({
      where: { ActiveCampaign: true },
      orderBy: { Id: 'asc' },
    });

    return results;
  }

  async findByBitrix(): Promise<Users[]> {
    const results = await this.prisma.users.findMany({
      where: { Bitrix: true },
      orderBy: { Id: 'asc' },
    });

    return results;
  }

  async findRecentUsers(days: number): Promise<Users[]> {
    const dateLimit = new Date();
    dateLimit.setDate(dateLimit.getDate() - days);

    const results = await this.prisma.users.findMany({
      where: {
        DateRegister: {
          gte: dateLimit,
        },
      },
      orderBy: { DateRegister: 'desc' },
    });

    return results;
  }

  async findUsersByDateRange(startDate: Date, endDate: Date): Promise<Users[]> {
    const results = await this.prisma.users.findMany({
      where: {
        DateRegister: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: { DateRegister: 'desc' },
    });

    return results;
  }
}
