import { IBaseDomainError } from './base-domain.error';

export class NotFoundError implements IBaseDomainError {
  public readonly message = 'Not Found';
  public readonly statusCode = 404;

  constructor(
    public readonly description: string,
    public readonly errorCode: string,
  ) {}
}
