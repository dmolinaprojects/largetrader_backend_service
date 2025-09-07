import { PrismaClient as UsersPrismaClient } from '@prisma/users-client';
import { PrismaClient as StocksPrismaClient } from '@prisma/stocks-client';

export type TTransactionArgs = Omit<
  UsersPrismaClient | StocksPrismaClient,
  '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
>;

export type TTransactionCallback<T = void> = (
  tx: TTransactionArgs,
) => Promise<T>;

export interface ITransactionRepository {
  transaction<T = void>(callback: TTransactionCallback<T>): Promise<T>;
}
