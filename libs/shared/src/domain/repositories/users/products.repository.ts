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
import { Products } from '../../models/users/products.model';


export interface ProductsRepository
  extends ITransactionRepository,
    ICreateOneRepository<Products>,
    ICreateManyRepository<Products>,
    IUpdateOneRepository<
      Pick<Products, 'Id'> | Pick<Products, 'Name'>,
      Products
    >,
    IDeleteOneRepository<
      Pick<Products, 'Id'> | Pick<Products, 'Name'>,
      Products
    >,
    IUpsertOneRepository<
      Pick<Products, 'Id'> | Pick<Products, 'Name'>,
      Products
    >,
    IFindOneRepository<Products, Products>,
    IFindManyRepository<Products, Products>,
    ICountManyRepository<Products> {
  findByName(name: string): Promise<Products | null>;
  findSubscriptionProducts(): Promise<Products[]>;
  findTrialProducts(): Promise<Products[]>;
  findByCurrency(currency: string): Promise<Products[]>;
  findByPriceRange(minPrice: number, maxPrice: number): Promise<Products[]>;
}
