import { HttpStatus } from '@nestjs/common';

export interface IErrorResponse<TStatusCode = HttpStatus> {
  message: string[];
  statusCode: TStatusCode;
  error: string;
}
