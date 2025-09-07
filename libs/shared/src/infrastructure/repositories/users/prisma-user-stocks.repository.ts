import { Injectable } from '@nestjs/common';
import { PrismaClient as UsersPrismaClient, Users as PrismaUsers } from '@prisma/users-client';
import { 
  UserStocksRepository, 
  UserStocksFilters 
} from '../../../domain/repositories/users/user-stocks.repository';
import { UserStocks } from '../../../domain/models/users/user-stocks.model';
import { TFindManyArgs, TFindOneArgs, TCreateOneArgs, TUpdateOneArgs, TDeleteOneArgs, TTransactionArgs } from '@app/core';

@Injectable()
export class PrismaUserStocksRepository implements UserStocksRepository {
  constructor(private readonly prisma: UsersPrismaClient) {}

  async findMany(args?: TFindManyArgs<UserStocksFilters, UserStocks>, tx?: TTransactionArgs): Promise<UserStocks[]> {
    const where = args?.where ? this.buildWhereClause(args.where) : {};
    
    const results = await this.prisma.users.findMany({
      where,
      skip: args?.skip,
      take: args?.take,
      orderBy: { Id: 'asc' },
    });

    return results;
  }

  async findOne(args: TFindOneArgs<UserStocksFilters, UserStocks>, tx?: TTransactionArgs): Promise<UserStocks | null> {
    const where = this.buildWhereClause(args.where);
    
    const result = await this.prisma.users.findFirst({ where });
    
    return result;
  }

  async createOne(args: TCreateOneArgs<UserStocks, UserStocks>, tx?: TTransactionArgs): Promise<UserStocks> {
    const result = await this.prisma.users.create({
      data: args.data as PrismaUsers,
    });

    return result;
  }

  async updateOne(args: TUpdateOneArgs<UserStocksFilters, UserStocks>, tx?: TTransactionArgs): Promise<UserStocks> {
    const result = await this.prisma.users.update({
      where: { Id: args.where.Id },
      data: args.data as Partial<PrismaUsers>,
    });

    return result;
  }

  async deleteOne(args: TDeleteOneArgs<UserStocksFilters, UserStocks>, tx?: TTransactionArgs): Promise<UserStocks> {
    const result = await this.prisma.users.delete({
      where: { Id: args.where.Id },
    });

    return result;
  }

  async count(filters: UserStocksFilters): Promise<number> {
    const where = this.buildWhereClause(filters);
    return this.prisma.users.count({ where });
  }

  async findByEmail(email: string): Promise<UserStocks | null> {
    const result = await this.prisma.users.findFirst({
      where: { Email: email },
    });

    return result;
  }

  async findByGoogleId(googleId: string): Promise<UserStocks | null> {
    const result = await this.prisma.users.findFirst({
      where: { GoogleId: googleId },
    });

    return result;
  }

  async findByFacebookId(facebookId: string): Promise<UserStocks | null> {
    const result = await this.prisma.users.findFirst({
      where: { FacebookId: facebookId },
    });

    return result;
  }

  async findByToken(token: string): Promise<UserStocks | null> {
    const result = await this.prisma.users.findFirst({
      where: { Token: token },
    });

    return result;
  }

  async findAdmins(): Promise<UserStocks[]> {
    const results = await this.prisma.users.findMany({
      where: { Admin: true },
      orderBy: { Id: 'asc' },
    });

    return results;
  }

  async findPublishers(): Promise<UserStocks[]> {
    const results = await this.prisma.users.findMany({
      where: { Publisher: true },
      orderBy: { Id: 'asc' },
    });

    return results;
  }

  async findByCountry(countryId: number): Promise<UserStocks[]> {
    const results = await this.prisma.users.findMany({
      where: { Country: countryId },
      orderBy: { Id: 'asc' },
    });

    return results;
  }

  async findByLanguage(language: string): Promise<UserStocks[]> {
    const results = await this.prisma.users.findMany({
      where: { Language: language },
      orderBy: { Id: 'asc' },
    });

    return results;
  }

  private buildWhereClause(filters: UserStocksFilters) {
    return {
      ...(filters.Id && { Id: filters.Id }),
      ...(filters.Email && { Email: { contains: filters.Email } }),
      ...(filters.Name && { Name: { contains: filters.Name } }),
      ...(filters.NickName && { NickName: { contains: filters.NickName } }),
      ...(filters.Company && { Company: { contains: filters.Company } }),
      ...(filters.Country && { Country: filters.Country }),
      ...(filters.City && { City: { contains: filters.City } }),
      ...(filters.Admin !== undefined && { Admin: filters.Admin }),
      ...(filters.Publisher !== undefined && { Publisher: filters.Publisher }),
      ...(filters.Language && { Language: filters.Language }),
      ...(filters.ActiveCampaign !== undefined && { ActiveCampaign: filters.ActiveCampaign }),
      ...(filters.Bitrix !== undefined && { Bitrix: filters.Bitrix }),
    };
  }
}
