import { Injectable } from '@nestjs/common';
import { PrismaClient as UsersPrismaClient } from '@prisma/users-client';
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
import { LogLastTickersRepository } from '../../../domain/repositories/users/log-last-tickers.repository';
import { LogLastTickers } from '../../../domain/models/users/log-last-tickers.model';

@Injectable()
export class PrismaLogLastTickersRepository implements LogLastTickersRepository {
  constructor(private readonly prisma: UsersPrismaClient) {}

  async findMany(args?: TFindManyArgs<LogLastTickers, LogLastTickers>): Promise<LogLastTickers[]> {
    const result = await this.prisma.logLastTickers.findMany({
      where: args?.where,
      select: args?.select,
      orderBy: args?.orderBy,
      take: args?.take,
      skip: args?.skip,
    });

    return result.map(item => ({
      Id: item.Id,
      Ticker: item.Ticker,
      Date: item.Date,
    }));
  }

  async findOne(args?: TFindOneArgs<LogLastTickers, LogLastTickers>): Promise<LogLastTickers | null> {
    const result = await this.prisma.logLastTickers.findFirst({
      where: args?.where,
      select: args?.select,
    });

    if (!result) return null;

    return {
      Id: result.Id,
      Ticker: result.Ticker,
      Date: result.Date,
    };
  }

  async createOne(args: TCreateOneArgs<LogLastTickers>): Promise<LogLastTickers> {
    const result = await this.prisma.logLastTickers.create({
      data: {
        Ticker: args.data.Ticker,
        Date: args.data.Date,
      },
    });

    return {
      Id: result.Id,
      Ticker: result.Ticker,
      Date: result.Date,
    };
  }

  async createMany(args: TCreateManyArgs<LogLastTickers>): Promise<void> {
    await Promise.all(
      args.data.map(item =>
        this.prisma.logLastTickers.create({
          data: {
            Ticker: item.Ticker,
            Date: item.Date,
          },
        })
      )
    );
  }

  async updateOne(args: TUpdateOneArgs<Pick<LogLastTickers, 'Id'>, LogLastTickers>): Promise<LogLastTickers> {
    const result = await this.prisma.logLastTickers.update({
      where: { Id: args.where.Id },
      data: {
        Ticker: args.data.Ticker,
        Date: args.data.Date,
      },
    });

    return {
      Id: result.Id,
      Ticker: result.Ticker,
      Date: result.Date,
    };
  }

  async deleteOne(args: TDeleteOneArgs<Pick<LogLastTickers, 'Id'>, LogLastTickers>): Promise<LogLastTickers> {
    const result = await this.prisma.logLastTickers.delete({
      where: { Id: args.where.Id },
    });

    return {
      Id: result.Id,
      Ticker: result.Ticker,
      Date: result.Date,
    };
  }

  async upsertOne(args: TUpsertOneArgs<Pick<LogLastTickers, 'Id'>, LogLastTickers>): Promise<LogLastTickers> {
    const result = await this.prisma.logLastTickers.upsert({
      where: { Id: args.where.Id },
      update: {
        Ticker: args.update.Ticker,
        Date: args.update.Date,
      },
      create: {
        Ticker: args.create.Ticker || '',
        Date: args.create.Date,
      },
    });

    return {
      Id: result.Id,
      Ticker: result.Ticker,
      Date: result.Date,
    };
  }

  async countMany(args?: TCountManyArgs<LogLastTickers>): Promise<number> {
    return await this.prisma.logLastTickers.count({
      where: args?.where,
    });
  }

  async transaction<T>(fn: (prisma: UsersPrismaClient) => Promise<T>): Promise<T> {
    return await this.prisma.$transaction(fn);
  }

  // Métodos específicos del dominio
  async findActiveTickers(thresholdDate: Date): Promise<LogLastTickers[]> {
    const results = await this.prisma.logLastTickers.findMany({
      where: {
        Date: {
          gte: thresholdDate,
        },
      },
      orderBy: {
        Date: 'desc',
      },
    });

    return results.map(result => ({
      Id: result.Id,
      Ticker: result.Ticker,
      Date: result.Date,
    }));
  }

  async findByTicker(ticker: string): Promise<LogLastTickers | null> {
    const result = await this.prisma.logLastTickers.findFirst({
      where: {
        Ticker: ticker,
      },
      orderBy: {
        Date: 'desc',
      },
    });

    if (!result) return null;

    return {
      Id: result.Id,
      Ticker: result.Ticker,
      Date: result.Date,
    };
  }

  async findByDateRange(from: Date, to: Date): Promise<LogLastTickers[]> {
    const results = await this.prisma.logLastTickers.findMany({
      where: {
        Date: {
          gte: from,
          lte: to,
        },
      },
      orderBy: {
        Date: 'desc',
      },
    });

    return results.map(result => ({
      Id: result.Id,
      Ticker: result.Ticker,
      Date: result.Date,
    }));
  }

  async deleteOldEntries(beforeDate: Date): Promise<number> {
    const result = await this.prisma.logLastTickers.deleteMany({
      where: {
        Date: {
          lt: beforeDate,
        },
      },
    });

    return result.count;
  }

  async upsertTickerActivity(ticker: string, date: Date): Promise<LogLastTickers> {
    // Buscar si existe un registro para este ticker
    const existing = await this.prisma.logLastTickers.findFirst({
      where: { Ticker: ticker },
    });

    let result;
    if (existing) {
      // Actualizar el registro existente
      result = await this.prisma.logLastTickers.update({
        where: { Id: existing.Id },
        data: { Date: date },
      });
    } else {
      // Crear nuevo registro
      result = await this.prisma.logLastTickers.create({
        data: {
          Ticker: ticker,
          Date: date,
        },
      });
    }

    return {
      Id: result.Id,
      Ticker: result.Ticker,
      Date: result.Date,
    };
  }
}
