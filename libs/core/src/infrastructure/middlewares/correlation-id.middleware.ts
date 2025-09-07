import { Injectable, NestMiddleware } from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';
import { v7 as uuidv7 } from 'uuid';

export const CORRELATION_ID_HEADER = 'x-correlation-id';

@Injectable()
export class CorrelationIdMiddleware implements NestMiddleware {
  use(req: FastifyRequest['raw'], res: FastifyReply['raw'], next: () => void) {
    const headerValues = req.headers[CORRELATION_ID_HEADER];
    const headerValue = Array.isArray(headerValues)
      ? headerValues.at(0)
      : headerValues;
    const uuid = headerValue ?? uuidv7();

    req.headers[CORRELATION_ID_HEADER] = uuid;
    res.setHeader(CORRELATION_ID_HEADER, uuid);
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
    res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');

    next();
  }
}

export const CorrelationIdMiddlewareFn = (
  req: FastifyRequest['raw'],
  res: FastifyReply['raw'],
  next: () => void,
) => {
  const headerValues = req.headers[CORRELATION_ID_HEADER];
  const headerValue = Array.isArray(headerValues)
    ? headerValues.at(0)
    : headerValues;
  const uuid = headerValue ?? uuidv7();

  req.headers[CORRELATION_ID_HEADER] = uuid;
  res.setHeader(CORRELATION_ID_HEADER, uuid);

  next();
};
