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
import {
  SignalsGroups,
  SignalsGroupsCreateInput,
  SignalsGroupsUpdateInput,
} from '../../models/users/signals-groups.model';

export interface SignalsGroupsRepository
  extends ITransactionRepository,
    ICreateOneRepository<SignalsGroups>,
    ICreateManyRepository<SignalsGroups>,
    IUpdateOneRepository<
      Pick<SignalsGroups, 'Id'> | Pick<SignalsGroups, 'Name'>,
      SignalsGroups
    >,
    IDeleteOneRepository<
      Pick<SignalsGroups, 'Id'> | Pick<SignalsGroups, 'Name'>,
      SignalsGroups
    >,
    IUpsertOneRepository<
      Pick<SignalsGroups, 'Id'> | Pick<SignalsGroups, 'Name'>,
      SignalsGroups
    >,
    IFindOneRepository<SignalsGroups, SignalsGroups>,
    IFindManyRepository<SignalsGroups, SignalsGroups>,
    ICountManyRepository<SignalsGroups> {
  findByName(name: string): Promise<SignalsGroups | null>;
  findByNameContaining(searchTerm: string): Promise<SignalsGroups[]>;
  findActiveGroups(): Promise<SignalsGroups[]>;
  countGroups(): Promise<number>;
}
