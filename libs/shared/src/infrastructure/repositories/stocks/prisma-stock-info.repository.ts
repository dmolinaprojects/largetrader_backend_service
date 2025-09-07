import { Injectable } from '@nestjs/common';
import { PrismaClient as UsersPrismaClient, StockInfo as PrismaStockInfo } from '@prisma/users-client';
import { 
  StockInfoRepository, 
  StockInfoFilters 
} from '../../../domain/repositories/stocks/stock-info.repository';
import { StockInfo } from '../../../domain/models/stocks/stock-info.model';
import { TFindManyArgs, TFindOneArgs, TCreateOneArgs, TUpdateOneArgs, TDeleteOneArgs, TTransactionArgs } from '@app/core';

@Injectable()
export class PrismaStockInfoRepository implements StockInfoRepository {
  constructor(private readonly prisma: UsersPrismaClient) {}

  async findMany(args?: TFindManyArgs<StockInfoFilters, StockInfo>, tx?: TTransactionArgs): Promise<StockInfo[]> {
    const where = args?.where ? this.buildWhereClause(args.where) : {};
    
    const results = await this.prisma.stockInfo.findMany({
      where,
      skip: args?.skip,
      take: args?.take,
      orderBy: { Ticker: 'asc' },
    });

    return results;
  }

  async findOne(args: TFindOneArgs<StockInfoFilters, StockInfo>, tx?: TTransactionArgs): Promise<StockInfo | null> {
    const where = this.buildWhereClause(args.where);
    
    const result = await this.prisma.stockInfo.findFirst({ where });
    
    return result;
  }

  async createOne(args: TCreateOneArgs<StockInfo, StockInfo>, tx?: TTransactionArgs): Promise<StockInfo> {
    const result = await this.prisma.stockInfo.create({
      data: args.data as PrismaStockInfo,
    });

    return result;
  }

  async updateOne(args: TUpdateOneArgs<StockInfoFilters, StockInfo>, tx?: TTransactionArgs): Promise<StockInfo> {
    const result = await this.prisma.stockInfo.update({
      where: { Id: args.where.Id },
      data: args.data as Partial<PrismaStockInfo>,
    });

    return result;
  }

  async deleteOne(args: TDeleteOneArgs<StockInfoFilters, StockInfo>, tx?: TTransactionArgs): Promise<StockInfo> {
    const result = await this.prisma.stockInfo.delete({
      where: { Id: args.where.Id },
    });

    return result;
  }

  async count(filters: StockInfoFilters): Promise<number> {
    const where = this.buildWhereClause(filters);
    return this.prisma.stockInfo.count({ where });
  }

  async findByTicker(ticker: string): Promise<StockInfo | null> {
    const result = await this.prisma.stockInfo.findFirst({
      where: { Ticker: ticker },
    });

    return result;
  }

  async findByExchange(exchange: string): Promise<StockInfo[]> {
    const results = await this.prisma.stockInfo.findMany({
      where: { Exchange: exchange },
      orderBy: { Ticker: 'asc' },
    });

    return results;
  }

  async findBySector(sector: string): Promise<StockInfo[]> {
    const results = await this.prisma.stockInfo.findMany({
      where: { Sector: sector },
      orderBy: { Ticker: 'asc' },
    });

    return results;
  }

  async findByIndustry(industry: string): Promise<StockInfo[]> {
    const results = await this.prisma.stockInfo.findMany({
      where: { Industry: industry },
      orderBy: { Ticker: 'asc' },
    });

    return results;
  }

  async findActiveStocks(): Promise<StockInfo[]> {
    const results = await this.prisma.stockInfo.findMany({
      where: { IsDelisted: false },
      orderBy: { Ticker: 'asc' },
    });

    return results;
  }

  private buildWhereClause(filters: StockInfoFilters) {
    return {
      ...(filters.Id && { Id: filters.Id }),
      ...(filters.Ticker && { Ticker: { contains: filters.Ticker } }),
      ...(filters.Name && { Name: { contains: filters.Name } }),
      ...(filters.Country && { Country: { contains: filters.Country } }),
      ...(filters.Exchange && { Exchange: filters.Exchange }),
      ...(filters.Currency && { Currency: filters.Currency }),
      ...(filters.Type && { Type: filters.Type }),
      ...(filters.Sector && { Sector: { contains: filters.Sector } }),
      ...(filters.Industry && { Industry: { contains: filters.Industry } }),
      ...(filters.IsDelisted !== undefined && { IsDelisted: filters.IsDelisted }),
    };
  }
}
