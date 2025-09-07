import { Injectable } from '@nestjs/common';
import { PrismaClient as UsersPrismaClient, StockInfoTechnicals as PrismaStockInfoTechnicals } from '@prisma/users-client';
import { 
  StockInfoTechnicalsRepository, 
  StockInfoTechnicalsFilters 
} from '../../../domain/repositories/stocks/stock-info-technicals.repository';
import { StockInfoTechnicals } from '../../../domain/models/stocks/stock-info-technicals.model';
import { TFindManyArgs, TFindOneArgs, TCreateOneArgs, TUpdateOneArgs, TDeleteOneArgs, TTransactionArgs } from '@app/core';

@Injectable()
export class PrismaStockInfoTechnicalsRepository implements StockInfoTechnicalsRepository {
  constructor(private readonly prisma: UsersPrismaClient) {}

  async findMany(args?: TFindManyArgs<StockInfoTechnicalsFilters, StockInfoTechnicals>, tx?: TTransactionArgs): Promise<StockInfoTechnicals[]> {
    const where = args?.where ? this.buildWhereClause(args.where) : {};
    
    const results = await this.prisma.stockInfoTechnicals.findMany({
      where,
      skip: args?.skip,
      take: args?.take,
      orderBy: { Id: 'asc' },
    });

    return results;
  }

  async findOne(args: TFindOneArgs<StockInfoTechnicalsFilters, StockInfoTechnicals>, tx?: TTransactionArgs): Promise<StockInfoTechnicals | null> {
    const where = this.buildWhereClause(args.where);
    
    const result = await this.prisma.stockInfoTechnicals.findFirst({ where });
    
    return result;
  }

  async createOne(args: TCreateOneArgs<StockInfoTechnicals, StockInfoTechnicals>, tx?: TTransactionArgs): Promise<StockInfoTechnicals> {
    const result = await this.prisma.stockInfoTechnicals.create({
      data: args.data as PrismaStockInfoTechnicals,
    });

    return result;
  }

  async updateOne(args: TUpdateOneArgs<StockInfoTechnicalsFilters, StockInfoTechnicals>, tx?: TTransactionArgs): Promise<StockInfoTechnicals> {
    const result = await this.prisma.stockInfoTechnicals.update({
      where: { Id: args.where.Id },
      data: args.data as Partial<PrismaStockInfoTechnicals>,
    });

    return result;
  }

  async deleteOne(args: TDeleteOneArgs<StockInfoTechnicalsFilters, StockInfoTechnicals>, tx?: TTransactionArgs): Promise<StockInfoTechnicals> {
    const result = await this.prisma.stockInfoTechnicals.delete({
      where: { Id: args.where.Id },
    });

    return result;
  }

  async count(filters: StockInfoTechnicalsFilters): Promise<number> {
    const where = this.buildWhereClause(filters);
    return this.prisma.stockInfoTechnicals.count({ where });
  }

  async findByStockId(stockId: number): Promise<StockInfoTechnicals | null> {
    const result = await this.prisma.stockInfoTechnicals.findFirst({
      where: { IdStock: stockId },
    });

    return result;
  }

  async findHighPERatioStocks(minPeRatio: number): Promise<StockInfoTechnicals[]> {
    const results = await this.prisma.stockInfoTechnicals.findMany({
      where: { PeRatio: { gte: minPeRatio } },
      orderBy: { PeRatio: 'desc' },
    });

    return results;
  }

  async findHighDividendStocks(minDividendYield: number): Promise<StockInfoTechnicals[]> {
    const results = await this.prisma.stockInfoTechnicals.findMany({
      where: { DividendYield: { gte: minDividendYield } },
      orderBy: { DividendYield: 'desc' },
    });

    return results;
  }

  async findProfitableStocks(minProfitMargin: number): Promise<StockInfoTechnicals[]> {
    const results = await this.prisma.stockInfoTechnicals.findMany({
      where: { ProfitMargin: { gte: minProfitMargin } },
      orderBy: { ProfitMargin: 'desc' },
    });

    return results;
  }

  private buildWhereClause(filters: StockInfoTechnicalsFilters) {
    return {
      ...(filters.Id && { Id: filters.Id }),
      ...(filters.IdStock && { IdStock: filters.IdStock }),
      ...(filters.PeRatioMin && { PeRatio: { gte: filters.PeRatioMin } }),
      ...(filters.PeRatioMax && { PeRatio: { lte: filters.PeRatioMax } }),
      ...(filters.PegRatioMin && { PegRatio: { gte: filters.PegRatioMin } }),
      ...(filters.PegRatioMax && { PegRatio: { lte: filters.PegRatioMax } }),
      ...(filters.DividendYieldMin && { DividendYield: { gte: filters.DividendYieldMin } }),
      ...(filters.DividendYieldMax && { DividendYield: { lte: filters.DividendYieldMax } }),
      ...(filters.ProfitMarginMin && { ProfitMargin: { gte: filters.ProfitMarginMin } }),
      ...(filters.ProfitMarginMax && { ProfitMargin: { lte: filters.ProfitMarginMax } }),
    };
  }
}
