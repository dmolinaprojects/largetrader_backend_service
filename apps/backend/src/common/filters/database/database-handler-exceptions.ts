import { ExceptionFilter, Catch, Logger } from '@nestjs/common';
import { DatabaseExceptionError } from './database-exception-error';

/**
 * Exception filter to handle PostgreSQL errors.
 */
@Catch(DatabaseExceptionError)
export class DatabaseExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(DatabaseExceptionFilter.name);

  catch(exception: DatabaseExceptionError) {
    // Detailed log in the console
    this.logger.error({
      code: exception.code,
      detail: exception.detail,
      name: exception.name,
      message: exception.message,
      stack: exception.stack,
    });

    throw new Error('Database error');
  }
}
