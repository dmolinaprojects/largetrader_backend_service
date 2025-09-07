/* eslint-disable @typescript-eslint/no-unsafe-assignment */
export enum HttpErrorCode {
  NOT_FOUND = 'NOT_FOUND',
  USER_NOT_FOUND = 'USER_NOT_FOUND',
  UNAUTHORIZED = 'UNAUTHORIZED',
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  ALREADY_EXISTS = 'ALREADY_EXISTS',
  FILE_NOT_PROVIDED = 'FILE_NOT_PROVIDED',
  WRONG_FILE_EXTENSION = 'WRONG_FILE_EXTENSION',
  TOKEN_NOT_PROVIDED = 'TOKEN_NOT_PROVIDED',
}

export class InternalExceptionError extends Error {
  public readonly code: string;

  constructor(code: HttpErrorCode, message: any = null) {
    super();
    this.name = 'InternalExceptionError';
    this.code = code;
    this.message = message;
  }
}
