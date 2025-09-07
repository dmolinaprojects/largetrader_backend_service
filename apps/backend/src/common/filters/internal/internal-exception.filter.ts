import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import {
  HttpErrorCode,
  InternalExceptionError,
} from './internal-exception-error';
import { errorResponseMap } from './error-mapping';

/**
 * Exception filter to handle PostgreSQL errors.
 */

@Catch(InternalExceptionError)
export class InternalException implements ExceptionFilter {
  private readonly logger = new Logger(InternalException.name);

  catch(exception: InternalExceptionError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const errorInfo = errorResponseMap[exception.code as HttpErrorCode];
    const statusCode = errorInfo?.status ?? HttpStatus.INTERNAL_SERVER_ERROR;
    const message = errorInfo?.message ?? 'Internal server error';

    this.logger.debug({
      code: exception.code,
      name: exception.name,
      message: exception.message,
    });

    console.log('exception', exception);
    // Manejo de respuesta genérico
    if (
      typeof response.status === 'function' &&
      typeof response.json === 'function'
    ) {
      // Express
      response.status(statusCode).json({
        statusCode,
        content: { message },
      });
    } else {
      // Fastify
      response.status(statusCode);
      response.send({
        statusCode,
        content: { message },
      });
    }
  }
}
