import { IBaseDomainError } from './base-domain.error';

export class UnauthorizedError implements IBaseDomainError {
  public readonly message = 'Unauthorized';
  public readonly statusCode = 401;

  constructor(
    public readonly description: string,
    public readonly errorCode: string,
  ) {}
}
