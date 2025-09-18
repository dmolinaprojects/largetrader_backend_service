import { Injectable } from '@nestjs/common';
import {
  PrismaClient as StocksPrismaClient,
  RealTimeData as PrismaRealTimeData,
} from '@prisma/stocks-client';
import { RealTimeDataRepository } from '../../../domain/repositories/stocks/real-time-data.repository';
import { RealTimeData } from '../../../domain/models/stocks/real-time-data.model';
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
export class PrismaRealTimeDataRepository implements RealTimeDataRepository {
  constructor(private readonly prisma: StocksPrismaClient) {}

  async findMany(args?: TFindManyArgs<RealTimeData, RealTimeData>): Promise<RealTimeData[]> {
    const result = await this.prisma.realTimeData.findMany({
      where: args?.where,
      select: args?.select,
      orderBy: args?.orderBy,
      take: args?.take,
      skip: args?.skip,
    });
    
    return result.map(item => ({
      id: item.id,
      Ticker: item.Ticker,
      Open: item.Open,
      High: item.High,
      Low: item.Low,
      Close: item.Close,
      AskPrice: item.AskPrice,
      AskSize: item.AskSize,
      BidPrice: item.BidPrice,
      BidSize: item.BidSize,
    }));
  }

  async findOne(args: TFindOneArgs<RealTimeData, RealTimeData>): Promise<RealTimeData | null> {
    const result = await this.prisma.realTimeData.findFirst({
      where: args.where,
      select: args.select,
    });
    
    if (!result) return null;
    
    return {
      id: result.id,
      Ticker: result.Ticker,
      Open: result.Open,
      High: result.High,
      Low: result.Low,
      Close: result.Close,
      AskPrice: result.AskPrice,
      AskSize: result.AskSize,
      BidPrice: result.BidPrice,
      BidSize: result.BidSize,
    };
  }

  async count(args?: TCountManyArgs<RealTimeData>): Promise<number> {
    return await this.prisma.realTimeData.count({
      where: args?.where,
    });
  }

  async countMany(args?: TCountManyArgs<RealTimeData>): Promise<number> {
    return await this.prisma.realTimeData.count({
      where: args?.where,
    });
  }

  async transaction<T>(fn: (tx: StocksPrismaClient) => Promise<T>): Promise<T> {
    return await this.prisma.$transaction(fn);
  }

  async createOne(
    args: TCreateOneArgs<RealTimeData, RealTimeData>,
    tx?: TTransactionArgs,
  ): Promise<RealTimeData> {
    const client = tx ? (tx as StocksPrismaClient) : this.prisma;
    const result = await client.realTimeData.create({
      data: {
        Ticker: args.data.Ticker,
        Open: args.data.Open,
        High: args.data.High,
        Low: args.data.Low,
        Close: args.data.Close,
        AskPrice: args.data.AskPrice,
        AskSize: args.data.AskSize,
        BidPrice: args.data.BidPrice,
        BidSize: args.data.BidSize,
      },
    });
    
    return {
      id: result.id,
      Ticker: result.Ticker,
      Open: result.Open,
      High: result.High,
      Low: result.Low,
      Close: result.Close,
      AskPrice: result.AskPrice,
      AskSize: result.AskSize,
      BidPrice: result.BidPrice,
      BidSize: result.BidSize,
    };
  }

  async createMany(
    args: TCreateManyArgs<RealTimeData>,
    tx?: TTransactionArgs,
  ): Promise<void> {
    const client = tx ? (tx as StocksPrismaClient) : this.prisma;
    
    const data = args.data.map((item) => ({
      Ticker: item.Ticker,
      Open: item.Open,
      High: item.High,
      Low: item.Low,
      Close: item.Close,
      AskPrice: item.AskPrice,
      AskSize: item.AskSize,
      BidPrice: item.BidPrice,
      BidSize: item.BidSize,
    }));

    await client.realTimeData.createMany({
      data,
    });
  }

  async updateOne(
    args: TUpdateOneArgs<Pick<RealTimeData, 'id'>, RealTimeData>,
    tx?: TTransactionArgs,
  ): Promise<RealTimeData> {
    const client = tx ? (tx as StocksPrismaClient) : this.prisma;

    const result = await client.realTimeData.update({
      where: { id: args.where.id },
      data: {
        Ticker: args.data.Ticker,
        Open: args.data.Open,
        High: args.data.High,
        Low: args.data.Low,
        Close: args.data.Close,
        AskPrice: args.data.AskPrice,
        AskSize: args.data.AskSize,
        BidPrice: args.data.BidPrice,
        BidSize: args.data.BidSize,
      },
    });
    
    return {
      id: result.id,
      Ticker: result.Ticker,
      Open: result.Open,
      High: result.High,
      Low: result.Low,
      Close: result.Close,
      AskPrice: result.AskPrice,
      AskSize: result.AskSize,
      BidPrice: result.BidPrice,
      BidSize: result.BidSize,
    };
  }

  async deleteOne(
    args: TDeleteOneArgs<Pick<RealTimeData, 'id'>, RealTimeData>,
    tx?: TTransactionArgs,
  ): Promise<RealTimeData> {
    const client = tx ? (tx as StocksPrismaClient) : this.prisma;

    const result = await client.realTimeData.delete({
      where: { id: args.where.id },
    });
    
    return {
      id: result.id,
      Ticker: result.Ticker,
      Open: result.Open,
      High: result.High,
      Low: result.Low,
      Close: result.Close,
      AskPrice: result.AskPrice,
      AskSize: result.AskSize,
      BidPrice: result.BidPrice,
      BidSize: result.BidSize,
    };
  }

  async upsertOne(
    args: TUpsertOneArgs<Pick<RealTimeData, 'id'>, RealTimeData>,
    tx?: TTransactionArgs,
  ): Promise<RealTimeData> {
    const client = tx ? (tx as StocksPrismaClient) : this.prisma;

    const data = {
      Ticker: args.create.Ticker,
      Open: args.create.Open,
      High: args.create.High,
      Low: args.create.Low,
      Close: args.create.Close,
      AskPrice: args.create.AskPrice,
      AskSize: args.create.AskSize,
      BidPrice: args.create.BidPrice,
      BidSize: args.create.BidSize,
    };

    const result = await client.realTimeData.upsert({
      where: { id: args.where.id },
      create: data,
      update: args.update ? {
        Ticker: args.update.Ticker,
        Open: args.update.Open,
        High: args.update.High,
        Low: args.update.Low,
        Close: args.update.Close,
        AskPrice: args.update.AskPrice,
        AskSize: args.update.AskSize,
        BidPrice: args.update.BidPrice,
        BidSize: args.update.BidSize,
      } : data,
    });
    
    return {
      id: result.id,
      Ticker: result.Ticker,
      Open: result.Open,
      High: result.High,
      Low: result.Low,
      Close: result.Close,
      AskPrice: result.AskPrice,
      AskSize: result.AskSize,
      BidPrice: result.BidPrice,
      BidSize: result.BidSize,
    };
  }

  // Métodos específicos del dominio

  async findByTicker(ticker: string): Promise<RealTimeData[]> {
    const results = await this.prisma.realTimeData.findMany({
      where: { Ticker: ticker },
      orderBy: { id: 'desc' },
    });
    
    return results.map(result => ({
      id: result.id,
      Ticker: result.Ticker,
      Open: result.Open,
      High: result.High,
      Low: result.Low,
      Close: result.Close,
      AskPrice: result.AskPrice,
      AskSize: result.AskSize,
      BidPrice: result.BidPrice,
      BidSize: result.BidSize,
    }));
  }

  async findByTickers(tickers: string[]): Promise<RealTimeData[]> {
    const results = await this.prisma.realTimeData.findMany({
      where: {
        Ticker: {
          in: tickers,
        },
      },
      orderBy: { id: 'desc' },
    });
    
    return results.map(result => ({
      id: result.id,
      Ticker: result.Ticker,
      Open: result.Open,
      High: result.High,
      Low: result.Low,
      Close: result.Close,
      AskPrice: result.AskPrice,
      AskSize: result.AskSize,
      BidPrice: result.BidPrice,
      BidSize: result.BidSize,
    }));
  }

  async findLatestByTicker(ticker: string): Promise<RealTimeData | null> {
    const result = await this.prisma.realTimeData.findFirst({
      where: { Ticker: ticker },
      orderBy: { id: 'desc' },
    });
    
    if (!result) return null;
    
    return {
      id: result.id,
      Ticker: result.Ticker,
      Open: result.Open,
      High: result.High,
      Low: result.Low,
      Close: result.Close,
      AskPrice: result.AskPrice,
      AskSize: result.AskSize,
      BidPrice: result.BidPrice,
      BidSize: result.BidSize,
    };
  }

  async deleteByTicker(ticker: string): Promise<number> {
    const result = await this.prisma.realTimeData.deleteMany({
      where: { Ticker: ticker },
    });
    return result.count;
  }

  async findLatestData(limit: number = 100): Promise<RealTimeData[]> {
    const results = await this.prisma.realTimeData.findMany({
      orderBy: { id: 'desc' },
      take: limit,
    });
    
    return results.map(result => ({
      id: result.id,
      Ticker: result.Ticker,
      Open: result.Open,
      High: result.High,
      Low: result.Low,
      Close: result.Close,
      AskPrice: result.AskPrice,
      AskSize: result.AskSize,
      BidPrice: result.BidPrice,
      BidSize: result.BidSize,
    }));
  }

  async findTickersWithBidAskSpread(minSpread: number = 0): Promise<RealTimeData[]> {
    // Usar raw query para calcular el spread
    const results = await this.prisma.$queryRaw<Array<{
      id: number;
      Ticker: string;
      Open: number;
      High: number;
      Low: number;
      Close: number;
      AskPrice: number;
      AskSize: number;
      BidPrice: number;
      BidSize: number;
    }>>`
      SELECT * FROM RealTimeData 
      WHERE AskPrice > 0 
        AND BidPrice > 0 
        AND (AskPrice - BidPrice) >= ${minSpread}
      ORDER BY id DESC
    `;
    
    return results.map(result => ({
      id: result.id,
      Ticker: result.Ticker,
      Open: result.Open,
      High: result.High,
      Low: result.Low,
      Close: result.Close,
      AskPrice: result.AskPrice,
      AskSize: result.AskSize,
      BidPrice: result.BidPrice,
      BidSize: result.BidSize,
    }));
  }

  async bulkInsert(data: Array<Omit<RealTimeData, 'id'>>): Promise<void> {
    const insertData = data.map(item => ({
      Ticker: item.Ticker,
      Open: item.Open,
      High: item.High,
      Low: item.Low,
      Close: item.Close,
      AskPrice: item.AskPrice,
      AskSize: item.AskSize,
      BidPrice: item.BidPrice,
      BidSize: item.BidSize,
    }));

    await this.prisma.realTimeData.createMany({
      data: insertData,
      skipDuplicates: false, // Permitir duplicados ya que no hay constraint único
    });
  }
}
