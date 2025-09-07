import { IBaseDomainError } from './base-domain.error';

export class BadRequestError implements IBaseDomainError {
  public readonly message = 'Bad Request';
  public readonly statusCode = 400;

  constructor(
    public readonly description: string,
    public readonly errorCode: string,
  ) {}
}
