import { IFindManyRepository, IFindOneRepository, ICreateOneRepository, IUpdateOneRepository, IDeleteOneRepository } from '@app/core';
import { Products } from '../../models/users/products.model';

export interface ProductsFilters {
  Id?: number;
  Name?: string;
  Subscription?: boolean;
  TrialVersion?: boolean;
  Currency?: string;
  PriceMin?: number;
  PriceMax?: number;
}

export interface ProductsRepository 
  extends IFindManyRepository<ProductsFilters, Products>,
          IFindOneRepository<ProductsFilters, Products>,
          ICreateOneRepository<Products>,
          IUpdateOneRepository<ProductsFilters, Products>,
          IDeleteOneRepository<ProductsFilters, Products> {
  
  findByName(name: string): Promise<Products | null>;
  findSubscriptionProducts(): Promise<Products[]>;
  findTrialProducts(): Promise<Products[]>;
  findByCurrency(currency: string): Promise<Products[]>;
  findByPriceRange(minPrice: number, maxPrice: number): Promise<Products[]>;
}
