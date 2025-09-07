import { IFindManyRepository, IFindOneRepository, ICreateOneRepository, IUpdateOneRepository, IDeleteOneRepository } from '@app/core';
import { Orders } from '../../models/users/orders.model';

export interface OrdersFilters {
  Id?: number;
  IdUser?: number;
  IdProduct?: number;
  PaymentStatus?: string;
  Subscription?: boolean;
  DateFrom?: Date;
  DateTo?: Date;
}

export interface OrdersRepository 
  extends IFindManyRepository<OrdersFilters, Orders>,
          IFindOneRepository<OrdersFilters, Orders>,
          ICreateOneRepository<Orders>,
          IUpdateOneRepository<OrdersFilters, Orders>,
          IDeleteOneRepository<OrdersFilters, Orders> {
  
  findByUserId(userId: number): Promise<Orders[]>;
  findByProductId(productId: number): Promise<Orders[]>;
  findActiveSubscriptions(): Promise<Orders[]>;
  findExpiredOrders(): Promise<Orders[]>;
  findByPaymentStatus(status: string): Promise<Orders[]>;
}
