import { Injectable } from '@nestjs/common';
import {
  PrismaClient as UsersPrismaClient,
  Products as PrismaProducts,
} from '@prisma/users-client';
import {
  ProductsRepository,
} from '../../../domain/repositories/users/products.repository';
import { Products } from '../../../domain/models/users/products.model';
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
export class PrismaProductsRepository implements ProductsRepository {
  constructor(private readonly prisma: UsersPrismaClient) {}

  async findMany(
    args?: TFindManyArgs<Products, Products>,
  ): Promise<Products[]> {
    return (await this.prisma.products.findMany({
      where: args?.where,
      skip: args?.skip,
      take: args?.take,
      orderBy: args?.orderBy || { Id: 'asc' },
    })) as unknown as Products[];
  }

  async findOne(
    args: TFindOneArgs<Products, Products>,
  ): Promise<Products | null> {
    return (await this.prisma.products.findFirst({
      where: args.where,
    })) as unknown as Products | null;
  }

  async count(filters: Products): Promise<number> {
    return await this.prisma.products.count({ where: filters });
  }

  async countMany(
    args?: TCountManyArgs<Products>,
    tx?: TTransactionArgs,
  ): Promise<number> {
    const client = tx ? (tx as UsersPrismaClient) : this.prisma;
    return await client.products.count({ where: args?.where });
  }

  // Implementación de métodos faltantes
  async transaction<T>(fn: (tx: any) => Promise<T>): Promise<T> {
    return await this.prisma.$transaction(fn);
  }

  async createOne(
    args: TCreateOneArgs<Products, Products>,
    tx?: TTransactionArgs,
  ): Promise<Products> {
    const client = tx ? (tx as UsersPrismaClient) : this.prisma;
    return (await client.products.create({
      data: args.data as PrismaProducts,
    })) as Products;
  }

  async createMany(
    args: TCreateManyArgs<Products>,
    tx?: TTransactionArgs,
  ): Promise<void> {
    const client = tx ? (tx as UsersPrismaClient) : this.prisma;
    await client.products.createMany({ data: args.data as PrismaProducts[] });
  }

  async updateOne(
    args: TUpdateOneArgs<Partial<Products>, Products>,
    tx?: TTransactionArgs,
  ): Promise<Products> {
    const client = tx ? (tx as UsersPrismaClient) : this.prisma;
    return (await client.products.update({
      where: { Id: args.where.Id },
      data: args.data as Partial<PrismaProducts>,
    })) as Products;
  }

  async deleteOne(
    args: TDeleteOneArgs<Partial<Products>, Products>,
    tx?: TTransactionArgs,
  ): Promise<Products> {
    const client = tx ? (tx as UsersPrismaClient) : this.prisma;
    return (await client.products.delete({
      where: { Id: args.where.Id },
    })) as Products;
  }

  async upsertOne(
    args: TUpsertOneArgs<Partial<Products>, Products>,
    tx?: TTransactionArgs,
  ): Promise<Products> {
    const client = tx ? (tx as UsersPrismaClient) : this.prisma;
    return (await client.products.upsert({
      where: { Id: args.where.Id },
      update: args.update as Partial<PrismaProducts>,
      create: args.create as PrismaProducts,
    })) as Products;
  }

  async findByName(name: string): Promise<Products | null> {
    const result = await this.prisma.products.findFirst({
      where: { Name: { contains: name } },
    });

    return result;
  }

  async findSubscriptionProducts(): Promise<Products[]> {
    const results = await this.prisma.products.findMany({
      where: { Subscription: true },
      orderBy: { Id: 'asc' },
    });

    return results;
  }

  async findTrialProducts(): Promise<Products[]> {
    const results = await this.prisma.products.findMany({
      where: { TrialVersion: true },
      orderBy: { Id: 'asc' },
    });

    return results;
  }

  async findByCurrency(currency: string): Promise<Products[]> {
    const results = await this.prisma.products.findMany({
      where: { Currency: currency },
      orderBy: { Id: 'asc' },
    });

    return results;
  }

  async findByPriceRange(
    minPrice: number,
    maxPrice: number,
  ): Promise<Products[]> {
    const results = await this.prisma.products.findMany({
      where: {
        Price: {
          gte: minPrice,
          lte: maxPrice,
        },
      },
      orderBy: { Price: 'asc' },
    });

    return results;
  }
}
