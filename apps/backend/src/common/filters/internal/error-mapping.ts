// error-mapping.ts
import { HttpStatus } from '@nestjs/common';
import { HttpErrorCode } from './internal-exception-error';

export const errorResponseMap: Record<
  HttpErrorCode,
  { status: number; message: string }
> = {
  [HttpErrorCode.INTERNAL_ERROR]: {
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    message: 'Intenal error',
  },
  [HttpErrorCode.NOT_FOUND]: {
    status: HttpStatus.NOT_FOUND,
    message: 'Resource not found.',
  },
  [HttpErrorCode.USER_NOT_FOUND]: {
    status: HttpStatus.NOT_FOUND,
    message: 'User not found.',
  },
  [HttpErrorCode.UNAUTHORIZED]: {
    status: HttpStatus.UNAUTHORIZED,
    message: 'Unauthorized access.',
  },
  [HttpErrorCode.TOKEN_EXPIRED]: {
    status: HttpStatus.UNAUTHORIZED,
    message: 'Token has expired.',
  },
  [HttpErrorCode.ALREADY_EXISTS]: {
    status: HttpStatus.CONFLICT,
    message: 'Resource already exists.',
  },
  [HttpErrorCode.TOKEN_NOT_PROVIDED]: {
    status: HttpStatus.UNAUTHORIZED,
    message: 'Token not provided.',
  },
  [HttpErrorCode.WRONG_FILE_EXTENSION]: {
    status: HttpStatus.BAD_REQUEST,
    message: 'Wrong file extension.',
  },
  [HttpErrorCode.FILE_NOT_PROVIDED]: {
    status: HttpStatus.BAD_REQUEST,
    message: 'File not provided.',
  },
};
