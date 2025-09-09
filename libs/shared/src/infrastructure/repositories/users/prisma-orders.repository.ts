import { Injectable } from '@nestjs/common';
import {
  PrismaClient as UsersPrismaClient,
  Orders as PrismaOrders,
} from '@prisma/users-client';
import {
  OrdersRepository,
} from '../../../domain/repositories/users/orders.repository';
import { Orders } from '../../../domain/models/users/orders.model';
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
export class PrismaOrdersRepository implements OrdersRepository {
  constructor(private readonly prisma: UsersPrismaClient) {}

  async findMany(args?: TFindManyArgs<Orders, Orders>): Promise<Orders[]> {
    return (await this.prisma.orders.findMany({
      where: args?.where,
      skip: args?.skip,
      take: args?.take,
      orderBy: args?.orderBy || { Id: 'desc' },
    })) as unknown as Orders[];
  }

  async findOne(args: TFindOneArgs<Orders, Orders>): Promise<Orders | null> {
    return (await this.prisma.orders.findFirst({
      where: args.where,
    })) as unknown as Orders | null;
  }

  async count(filters: Orders): Promise<number> {
    return await this.prisma.orders.count({ where: filters });
  }

  async countMany(
    args?: TCountManyArgs<Orders>,
    tx?: TTransactionArgs,
  ): Promise<number> {
    const client = tx ? (tx as UsersPrismaClient) : this.prisma;
    return await client.orders.count({ where: args?.where });
  }

  // Implementación de métodos faltantes
  async transaction<T>(fn: (tx: any) => Promise<T>): Promise<T> {
    return await this.prisma.$transaction(fn);
  }

  async createOne(
    args: TCreateOneArgs<Orders, Orders>,
    tx?: TTransactionArgs,
  ): Promise<Orders> {
    const client = tx ? (tx as UsersPrismaClient) : this.prisma;
    return (await client.orders.create({
      data: args.data as PrismaOrders,
    })) as Orders;
  }

  async createMany(
    args: TCreateManyArgs<Orders>,
    tx?: TTransactionArgs,
  ): Promise<void> {
    const client = tx ? (tx as UsersPrismaClient) : this.prisma;
    await client.orders.createMany({ data: args.data as PrismaOrders[] });
  }

  async updateOne(
    args: TUpdateOneArgs<Partial<Orders>, Orders>,
    tx?: TTransactionArgs,
  ): Promise<Orders> {
    const client = tx ? (tx as UsersPrismaClient) : this.prisma;
    return (await client.orders.update({
      where: { Id: args.where.Id },
      data: args.data as Partial<PrismaOrders>,
    })) as Orders;
  }

  async deleteOne(
    args: TDeleteOneArgs<Partial<Orders>, Orders>,
    tx?: TTransactionArgs,
  ): Promise<Orders> {
    const client = tx ? (tx as UsersPrismaClient) : this.prisma;
    return (await client.orders.delete({
      where: { Id: args.where.Id },
    })) as Orders;
  }

  async upsertOne(
    args: TUpsertOneArgs<Partial<Orders>, Orders>,
    tx?: TTransactionArgs,
  ): Promise<Orders> {
    const client = tx ? (tx as UsersPrismaClient) : this.prisma;
    return (await client.orders.upsert({
      where: { Id: args.where.Id },
      update: args.update as Partial<PrismaOrders>,
      create: args.create as PrismaOrders,
    })) as Orders;
  }

  async findByUserId(userId: number): Promise<Orders[]> {
    const results = await this.prisma.orders.findMany({
      where: { IdUser: userId },
      orderBy: { DateInsert: 'desc' },
    });

    return results;
  }

  async findByProductId(productId: number): Promise<Orders[]> {
    const results = await this.prisma.orders.findMany({
      where: { IdProduct: productId },
      orderBy: { DateInsert: 'desc' },
    });

    return results;
  }

  async findActiveSubscriptions(): Promise<Orders[]> {
    const results = await this.prisma.orders.findMany({
      where: {
        Subscription: true,
        SubscriptionPaused: false,
      },
      orderBy: { DateInsert: 'desc' },
    });

    return results;
  }

  async findExpiredOrders(): Promise<Orders[]> {
    const now = new Date();
    const results = await this.prisma.orders.findMany({
      where: {
        DateNextPayment: {
          lt: now,
        },
      },
      orderBy: { DateNextPayment: 'asc' },
    });

    return results;
  }

  async findByPaymentStatus(status: string): Promise<Orders[]> {
    const results = await this.prisma.orders.findMany({
      where: { PaymentStatus: status },
      orderBy: { DateInsert: 'desc' },
    });

    return results;
  }
}
