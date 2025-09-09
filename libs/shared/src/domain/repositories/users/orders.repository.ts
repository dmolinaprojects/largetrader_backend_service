import {
  ITransactionRepository,
  ICreateOneRepository,
  ICreateManyRepository,
  IUpdateOneRepository,
  IDeleteOneRepository,
  IUpsertOneRepository,
  IFindOneRepository,
  IFindManyRepository,
  ICountManyRepository,
} from '@app/core';
import { Orders } from '../../models/users/orders.model';

export interface OrdersRepository
  extends ITransactionRepository,
    ICreateOneRepository<Orders>,
    ICreateManyRepository<Orders>,
    IUpdateOneRepository<
      Pick<Orders, 'Id'> | Pick<Orders, 'IdUser'> | Pick<Orders, 'IdProduct'>,
      Orders
    >,
    IDeleteOneRepository<
      Pick<Orders, 'Id'> | Pick<Orders, 'IdUser'> | Pick<Orders, 'IdProduct'>,
      Orders
    >,
    IUpsertOneRepository<
      Pick<Orders, 'Id'> | Pick<Orders, 'IdUser'> | Pick<Orders, 'IdProduct'>,
      Orders
    >,
    IFindOneRepository<Orders, Orders>,
    IFindManyRepository<Orders, Orders>,
    ICountManyRepository<Orders> {
  findByUserId(userId: number): Promise<Orders[]>;
  findByProductId(productId: number): Promise<Orders[]>;
  findActiveSubscriptions(): Promise<Orders[]>;
  findExpiredOrders(): Promise<Orders[]>;
  findByPaymentStatus(status: string): Promise<Orders[]>;
}
