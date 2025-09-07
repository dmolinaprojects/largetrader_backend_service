export interface IBaseDomainError {
  readonly message: string;
  readonly description: string;
  readonly statusCode: number;
  readonly errorCode: string;
}
