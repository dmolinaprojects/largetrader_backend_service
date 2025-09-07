import { Injectable } from '@nestjs/common';
import { PrismaClient as UsersPrismaClient, Users as PrismaUsers } from '@prisma/users-client';
import { 
  UsersRepository, 
  UsersFilters 
} from '../../../domain/repositories/users/users.repository';
import { Users } from '../../../domain/models/users/users.model';
import { TFindManyArgs, TFindOneArgs, TCreateOneArgs, TUpdateOneArgs, TDeleteOneArgs, TTransactionArgs } from '@app/core';

@Injectable()
export class PrismaUsersRepository implements UsersRepository {
  constructor(private readonly prisma: UsersPrismaClient) {}

  async findMany(args?: TFindManyArgs<UsersFilters, Users>, tx?: TTransactionArgs): Promise<Users[]> {
    const where = args?.where ? this.buildWhereClause(args.where) : {};
    
    const results = await this.prisma.users.findMany({
      where,
      skip: args?.skip,
      take: args?.take,
      orderBy: { Id: 'desc' },
    });

    return results;
  }

  async findOne(args: TFindOneArgs<UsersFilters, Users>, tx?: TTransactionArgs): Promise<Users | null> {
    const where = this.buildWhereClause(args.where);
    
    const result = await this.prisma.users.findFirst({ where });
    
    return result;
  }

  async createOne(args: TCreateOneArgs<Users, Users>, tx?: TTransactionArgs): Promise<Users> {
    const result = await this.prisma.users.create({
      data: args.data as PrismaUsers,
    });

    return result;
  }

  async updateOne(args: TUpdateOneArgs<UsersFilters, Users>, tx?: TTransactionArgs): Promise<Users> {
    const result = await this.prisma.users.update({
      where: { Id: args.where.Id },
      data: args.data as Partial<PrismaUsers>,
    });

    return result;
  }

  async deleteOne(args: TDeleteOneArgs<UsersFilters, Users>, tx?: TTransactionArgs): Promise<Users> {
    const result = await this.prisma.users.delete({
      where: { Id: args.where.Id },
    });

    return result;
  }

  async count(filters: UsersFilters): Promise<number> {
    const where = this.buildWhereClause(filters);
    return this.prisma.users.count({ where });
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
          gte: dateLimit
        }
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
          lte: endDate
        }
      },
      orderBy: { DateRegister: 'desc' },
    });

    return results;
  }

  private buildWhereClause(filters: UsersFilters) {
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
      ...(filters.DateFrom && { DateRegister: { gte: filters.DateFrom } }),
      ...(filters.DateTo && { DateRegister: { lte: filters.DateTo } }),
    };
  }
}
