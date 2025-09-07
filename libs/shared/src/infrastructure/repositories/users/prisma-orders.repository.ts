import { Injectable } from '@nestjs/common';
import { PrismaClient as UsersPrismaClient, Orders as PrismaOrders } from '@prisma/users-client';
import { 
  OrdersRepository, 
  OrdersFilters 
} from '../../../domain/repositories/users/orders.repository';
import { Orders } from '../../../domain/models/users/orders.model';
import { TFindManyArgs, TFindOneArgs, TCreateOneArgs, TUpdateOneArgs, TDeleteOneArgs, TTransactionArgs } from '@app/core';

@Injectable()
export class PrismaOrdersRepository implements OrdersRepository {
  constructor(private readonly prisma: UsersPrismaClient) {}

  async findMany(args?: TFindManyArgs<OrdersFilters, Orders>, tx?: TTransactionArgs): Promise<Orders[]> {
    const where = args?.where ? this.buildWhereClause(args.where) : {};
    
    const results = await this.prisma.orders.findMany({
      where,
      skip: args?.skip,
      take: args?.take,
      orderBy: { Id: 'desc' },
    });

    return results;
  }

  async findOne(args: TFindOneArgs<OrdersFilters, Orders>, tx?: TTransactionArgs): Promise<Orders | null> {
    const where = this.buildWhereClause(args.where);
    
    const result = await this.prisma.orders.findFirst({ where });
    
    return result;
  }

  async createOne(args: TCreateOneArgs<Orders, Orders>, tx?: TTransactionArgs): Promise<Orders> {
    const result = await this.prisma.orders.create({
      data: args.data as PrismaOrders,
    });

    return result;
  }

  async updateOne(args: TUpdateOneArgs<OrdersFilters, Orders>, tx?: TTransactionArgs): Promise<Orders> {
    const result = await this.prisma.orders.update({
      where: { Id: args.where.Id },
      data: args.data as Partial<PrismaOrders>,
    });

    return result;
  }

  async deleteOne(args: TDeleteOneArgs<OrdersFilters, Orders>, tx?: TTransactionArgs): Promise<Orders> {
    const result = await this.prisma.orders.delete({
      where: { Id: args.where.Id },
    });

    return result;
  }

  async count(filters: OrdersFilters): Promise<number> {
    const where = this.buildWhereClause(filters);
    return this.prisma.orders.count({ where });
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
        SubscriptionPaused: false 
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
          lt: now
        }
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

  private buildWhereClause(filters: OrdersFilters) {
    return {
      ...(filters.Id && { Id: filters.Id }),
      ...(filters.IdUser && { IdUser: filters.IdUser }),
      ...(filters.IdProduct && { IdProduct: filters.IdProduct }),
      ...(filters.PaymentStatus && { PaymentStatus: filters.PaymentStatus }),
      ...(filters.Subscription !== undefined && { Subscription: filters.Subscription }),
      ...(filters.DateFrom && { DateInsert: { gte: filters.DateFrom } }),
      ...(filters.DateTo && { DateInsert: { lte: filters.DateTo } }),
    };
  }
}
