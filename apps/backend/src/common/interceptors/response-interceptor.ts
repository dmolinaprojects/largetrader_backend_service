import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const response = context.switchToHttp().getResponse();

    return next.handle().pipe(
      map((data) => {
        let statusCode = response.statusCode; // Automatically capture the HTTP status

        // Personalize status codes based on your conditions
        if (data && data.overrideStatusCode) {
          statusCode = data.overrideStatusCode; // Dynamically set the status code
          delete data.overrideStatusCode; // Remove it from the final response
        }

        const dataJson = JSON.stringify(data, (_, value) => {
          if (typeof value === 'bigint') {
            return value.toString();
          }
          return value;
        });

        return {
          statusCode,
          content: JSON.parse(dataJson), // Preserve what was already in the response
        };
      }),
    );
  }
}
