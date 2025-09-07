import { IBaseDomainError } from '../errors';

export class ActionResultsFactory<T> {
  private constructor(
    public readonly data?: T,
    public readonly error?: IBaseDomainError,
  ) {}

  static createSuccess<T>(data: T): ActionResultsFactory<T> {
    return new ActionResultsFactory(data, undefined);
  }

  static createError<T>(error: IBaseDomainError): ActionResultsFactory<T> {
    return new ActionResultsFactory<T>(undefined, error);
  }
}
