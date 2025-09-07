import { IBaseDomainError } from './base-domain.error';

export class ConflictError implements IBaseDomainError {
  public readonly message = 'Conflict';
  public readonly statusCode = 409;

  constructor(
    public readonly description: string,
    public readonly errorCode: string,
  ) {}
}
