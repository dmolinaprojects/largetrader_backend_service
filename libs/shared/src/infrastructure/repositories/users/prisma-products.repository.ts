import { Injectable } from '@nestjs/common';
import { PrismaClient as UsersPrismaClient, Products as PrismaProducts } from '@prisma/users-client';
import { 
  ProductsRepository, 
  ProductsFilters 
} from '../../../domain/repositories/users/products.repository';
import { Products } from '../../../domain/models/users/products.model';
import { TFindManyArgs, TFindOneArgs, TCreateOneArgs, TUpdateOneArgs, TDeleteOneArgs, TTransactionArgs } from '@app/core';

@Injectable()
export class PrismaProductsRepository implements ProductsRepository {
  constructor(private readonly prisma: UsersPrismaClient) {}

  async findMany(args?: TFindManyArgs<ProductsFilters, Products>, tx?: TTransactionArgs): Promise<Products[]> {
    const where = args?.where ? this.buildWhereClause(args.where) : {};
    
    const results = await this.prisma.products.findMany({
      where,
      skip: args?.skip,
      take: args?.take,
      orderBy: { Id: 'asc' },
    });

    return results;
  }

  async findOne(args: TFindOneArgs<ProductsFilters, Products>, tx?: TTransactionArgs): Promise<Products | null> {
    const where = this.buildWhereClause(args.where);
    
    const result = await this.prisma.products.findFirst({ where });
    
    return result;
  }

  async createOne(args: TCreateOneArgs<Products, Products>, tx?: TTransactionArgs): Promise<Products> {
    const result = await this.prisma.products.create({
      data: args.data as PrismaProducts,
    });

    return result;
  }

  async updateOne(args: TUpdateOneArgs<ProductsFilters, Products>, tx?: TTransactionArgs): Promise<Products> {
    const result = await this.prisma.products.update({
      where: { Id: args.where.Id },
      data: args.data as Partial<PrismaProducts>,
    });

    return result;
  }

  async deleteOne(args: TDeleteOneArgs<ProductsFilters, Products>, tx?: TTransactionArgs): Promise<Products> {
    const result = await this.prisma.products.delete({
      where: { Id: args.where.Id },
    });

    return result;
  }

  async count(filters: ProductsFilters): Promise<number> {
    const where = this.buildWhereClause(filters);
    return this.prisma.products.count({ where });
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

  async findByPriceRange(minPrice: number, maxPrice: number): Promise<Products[]> {
    const results = await this.prisma.products.findMany({
      where: {
        Price: {
          gte: minPrice,
          lte: maxPrice
        }
      },
      orderBy: { Price: 'asc' },
    });

    return results;
  }

  private buildWhereClause(filters: ProductsFilters) {
    return {
      ...(filters.Id && { Id: filters.Id }),
      ...(filters.Name && { Name: { contains: filters.Name } }),
      ...(filters.Subscription !== undefined && { Subscription: filters.Subscription }),
      ...(filters.TrialVersion !== undefined && { TrialVersion: filters.TrialVersion }),
      ...(filters.Currency && { Currency: filters.Currency }),
      ...(filters.PriceMin && { Price: { gte: filters.PriceMin } }),
      ...(filters.PriceMax && { Price: { lte: filters.PriceMax } }),
    };
  }
}
