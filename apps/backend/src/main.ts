/* eslint-disable @typescript-eslint/no-unsafe-call */
import { CorrelationIdMiddlewareFn } from '@app/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { RmqOptions, Transport } from '@nestjs/microservices';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger } from 'nestjs-pino';
import { AppModule } from './app.module';
import { DatabaseExceptionFilter } from './common/filters/database/database-handler-exceptions';
import { InternalException } from './common/filters/internal/internal-exception.filter';
import { ResponseInterceptor } from './common/interceptors/response-interceptor';
import { sdk } from './opentelemetry';

async function bootstrap() {
  sdk.start();

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
    {
      bufferLogs: true,
    },
  );
  // Register multipart plugin for file uploads
  await app.register(require('@fastify/multipart'), {
    limits: {
      fieldNameSize: 200, // Max field name size in bytes
      fieldSize: 1024 * 1024, // Max field value size (1MB for JSON fields)
      fields: 20, // Max number of non-file fields
      fileSize: 100 * 1024 * 1024, // 100MB per file
      files: 15, // Maximum 15 files total
      headerPairs: 2000, // Max number of header key-value pairs
    },
    attachFieldsToBody: false, // Don't attach fields to body, we'll parse manually
  });

  const configService = app.get(ConfigService);
  const loggerService = app.get(Logger);
  const PORT = configService.getOrThrow<number>('APP_PORT');

  app.use(CorrelationIdMiddlewareFn);
  app.useLogger(loggerService);
  // app.setGlobalPrefix(PREFIX_RESTFUL, { exclude: ['/'] });
  app.enableCors({
    origin: '*',
    allowedHeaders:
      'Origin, X-Requested-With, Content-Type, Accept, Authorization, Social-Authorization',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalFilters(new DatabaseExceptionFilter(), new InternalException());
  app.setGlobalPrefix('api/v1/largetrader');

  const config = new DocumentBuilder()
    .setTitle('API LargeTrader')
    .setDescription(
      'This project is responsible exclusively for handling web3 related operations.',
    )
    .setVersion('1.0')
    .addApiKey({
      type: 'apiKey',
      name: 'x-kd-api-key',
      in: 'query',
    })
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      'Authorization',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api/v1/largetrader/docs', app, document);

  await app.startAllMicroservices();

  await app.listen(PORT, '0.0.0.0');

  const url = await app.getUrl();

  loggerService.log(`🚀 Application Restful is running on: ${url}/api/v1/largetrader`);
  loggerService.log(
    `🚀 Application Openapi Restful is running on: ${url}/api/v1/largetrader/docs`,
  );
}
void bootstrap();
