import { CORRELATION_ID_HEADER } from '@app/core';
import {
  ATTR_SERVICE_NAME,
  ATTR_SERVICE_VERSION,
} from '@opentelemetry/semantic-conventions';
import { IncomingMessage } from 'http';
import { v7 as uuidv7 } from 'uuid';
import { serviceName, serviceVersion } from '../opentelemetry';

export const loggerConfig = {
  pinoHttp: {
    transport: {
      targets: [
        {
          target: 'pino-pretty',
          options: { colorize: true },
        },
        {
          target: 'pino-opentelemetry-transport',
          options: {
            resourceAttributes: {
              [ATTR_SERVICE_NAME]: serviceName,
              [ATTR_SERVICE_VERSION]: serviceVersion,
            },
          },
        },
      ],
      options: {
        prettyPrint: true,
        level: 'debug',
      },
    },
    customProps: (req: IncomingMessage) => {
      const headerValues = req.headers[CORRELATION_ID_HEADER];
      const headerValue = Array.isArray(headerValues)
        ? headerValues.at(0)
        : headerValues;

      return {
        correlationId: headerValue ?? uuidv7(),
      };
    },
    autoLogging: true,
  },
};
