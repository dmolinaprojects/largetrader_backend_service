import { Injectable } from '@nestjs/common';
import {
  PrismaClient as StocksPrismaClient,
  market_tickers as PrismaMarketTickers,
} from '@prisma/stocks-client';
import { MarketTickersRepository } from '../../../domain/repositories/stocks/market-tickers.repository';
import { MarketTickers } from '../../../domain/models/stocks/market-tickers.model';
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
export class PrismaMarketTickersRepository implements MarketTickersRepository {
  constructor(private readonly prisma: StocksPrismaClient) {}

  async findMany(args?: TFindManyArgs<MarketTickers, MarketTickers>): Promise<MarketTickers[]> {
    return (await this.prisma.market_tickers.findMany({
      where: args?.where,
      skip: args?.skip,
      take: args?.take,
      orderBy: args?.orderBy || { Id: 'asc' },
    })) as unknown as MarketTickers[];
  }

  async findOne(args: TFindOneArgs<MarketTickers, MarketTickers>): Promise<MarketTickers | null> {
    return (await this.prisma.market_tickers.findFirst({
      where: args.where,
    })) as unknown as MarketTickers | null;
  }

  async countMany(args?: TCountManyArgs<MarketTickers>, tx?: TTransactionArgs): Promise<number> {
    const client = tx ? (tx as StocksPrismaClient) : this.prisma;
    return await client.market_tickers.count({ where: args?.where });
  }

  async transaction<T>(fn: (tx: any) => Promise<T>): Promise<T> {
    return await this.prisma.$transaction(fn);
  }

  async createOne(
    args: TCreateOneArgs<MarketTickers, MarketTickers>,
    tx?: TTransactionArgs,
  ): Promise<MarketTickers> {
    const client = tx ? (tx as StocksPrismaClient) : this.prisma;
    return (await client.market_tickers.create({
      data: {
        Code: args.data.Code,
        baseAsset: args.data.baseAsset,
        quoteAsset: args.data.quoteAsset,
        Name: args.data.Name,
        Country: args.data.Country,
        Exchange: args.data.Exchange,
        Currency: args.data.Currency,
        Type: args.data.Type,
        Isin: args.data.Isin,
        LastUpdateH1: args.data.LastUpdateH1,
        LastUpdateD1: args.data.LastUpdateD1,
        LastUpdateW1: args.data.LastUpdateW1,
        Enabled: args.data.Enabled,
      },
    })) as unknown as MarketTickers;
  }

  async createMany(
    args: TCreateManyArgs<MarketTickers>,
    tx?: TTransactionArgs,
  ): Promise<void> {
    const client = tx ? (tx as StocksPrismaClient) : this.prisma;
    await client.market_tickers.createMany({
      data: args.data.map(item => ({
        Code: item.Code,
        baseAsset: item.baseAsset,
        quoteAsset: item.quoteAsset,
        Name: item.Name,
        Country: item.Country,
        Exchange: item.Exchange,
        Currency: item.Currency,
        Type: item.Type,
        Isin: item.Isin,
        LastUpdateH1: item.LastUpdateH1,
        LastUpdateD1: item.LastUpdateD1,
        LastUpdateW1: item.LastUpdateW1,
        Enabled: item.Enabled,
      })),
    });
  }

  async updateOne(
    args: TUpdateOneArgs<Partial<MarketTickers>, MarketTickers>,
    tx?: TTransactionArgs,
  ): Promise<MarketTickers> {
    const client = tx ? (tx as StocksPrismaClient) : this.prisma;
    return (await client.market_tickers.update({
      where: { Id: args.where.Id },
      data: args.data,
    })) as unknown as MarketTickers;
  }

  async deleteOne(
    args: TDeleteOneArgs<Partial<MarketTickers>, MarketTickers>,
    tx?: TTransactionArgs,
  ): Promise<MarketTickers> {
    const client = tx ? (tx as StocksPrismaClient) : this.prisma;
    return (await client.market_tickers.delete({
      where: { Id: args.where.Id },
    })) as unknown as MarketTickers;
  }

  async upsertOne(
    args: TUpsertOneArgs<Pick<MarketTickers, 'Id'>, MarketTickers>,
    tx?: TTransactionArgs,
  ): Promise<MarketTickers> {
    const client = tx ? (tx as StocksPrismaClient) : this.prisma;
    return (await client.market_tickers.upsert({
      where: { Id: args.where.Id },
      update: {
        ...(args.update.Code && { Code: args.update.Code }),
        ...(args.update.baseAsset && { baseAsset: args.update.baseAsset }),
        ...(args.update.quoteAsset && { quoteAsset: args.update.quoteAsset }),
        ...(args.update.Name && { Name: args.update.Name }),
        ...(args.update.Country && { Country: args.update.Country }),
        ...(args.update.Exchange && { Exchange: args.update.Exchange }),
        ...(args.update.Currency && { Currency: args.update.Currency }),
        ...(args.update.Type && { Type: args.update.Type }),
        ...(args.update.Isin && { Isin: args.update.Isin }),
        ...(args.update.LastUpdateH1 && { LastUpdateH1: args.update.LastUpdateH1 }),
        ...(args.update.LastUpdateD1 && { LastUpdateD1: args.update.LastUpdateD1 }),
        ...(args.update.LastUpdateW1 && { LastUpdateW1: args.update.LastUpdateW1 }),
        ...(args.update.Enabled !== undefined && { Enabled: args.update.Enabled }),
      },
      create: {
        Code: args.create.Code,
        baseAsset: args.create.baseAsset,
        quoteAsset: args.create.quoteAsset,
        Name: args.create.Name,
        Country: args.create.Country,
        Exchange: args.create.Exchange,
        Currency: args.create.Currency,
        Type: args.create.Type,
        Isin: args.create.Isin,
        LastUpdateH1: args.create.LastUpdateH1,
        LastUpdateD1: args.create.LastUpdateD1,
        LastUpdateW1: args.create.LastUpdateW1,
        Enabled: args.create.Enabled,
      },
    })) as unknown as MarketTickers;
  }

  // Métodos específicos del dominio
  async findByCode(code: string): Promise<MarketTickers | null> {
    return (await this.prisma.market_tickers.findFirst({
      where: { Code: { equals: code } },
    })) as unknown as MarketTickers | null;
  }

  async findBySymbol(symbol: string): Promise<MarketTickers | null> {
    return (await this.prisma.market_tickers.findFirst({
      where: { 
        Code: { equals: symbol },
        Enabled: true
      },
    })) as unknown as MarketTickers | null;
  }

  async findByType(type: string): Promise<MarketTickers[]> {
    return (await this.prisma.market_tickers.findMany({
      where: { Type: type },
      orderBy: { Code: 'asc' },
    })) as unknown as MarketTickers[];
  }

  async findByExchange(exchange: string): Promise<MarketTickers[]> {
    return (await this.prisma.market_tickers.findMany({
      where: { Exchange: exchange },
      orderBy: { Code: 'asc' },
    })) as unknown as MarketTickers[];
  }

  async findByCountry(country: string): Promise<MarketTickers[]> {
    return (await this.prisma.market_tickers.findMany({
      where: { Country: country },
      orderBy: { Code: 'asc' },
    })) as unknown as MarketTickers[];
  }

  async findEnabled(): Promise<MarketTickers[]> {
    return (await this.prisma.market_tickers.findMany({
      where: { Enabled: true },
      orderBy: { Code: 'asc' },
    })) as unknown as MarketTickers[];
  }

  async searchByCodeOrName(query: string, limit: number = 50): Promise<MarketTickers[]> {
    return (await this.prisma.market_tickers.findMany({
      where: {
        OR: [
          { Code: { contains: query } },
          { Name: { contains: query } },
        ],
        AND: {
          Enabled: true,
        },
      },
      take: limit,
      orderBy: { Code: 'asc' },
    })) as unknown as MarketTickers[];
  }

  async updateLastUpdate(
    code: string,
    timeframe: 'H1' | 'D1' | 'W1',
    date: Date,
  ): Promise<MarketTickers> {
    const updateData: any = {};
    updateData[`LastUpdate${timeframe}`] = date;

    const ticker = await this.prisma.market_tickers.findFirst({
      where: { Code: code },
    });

    if (!ticker) {
      throw new Error(`Ticker with code ${code} not found`);
    }

    return (await this.prisma.market_tickers.update({
      where: { Id: ticker.Id },
      data: updateData,
    })) as unknown as MarketTickers;
  }
}
