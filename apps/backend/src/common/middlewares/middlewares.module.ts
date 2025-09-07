import { Module } from '@nestjs/common';
import { DocsJwtAuthorizer } from './docs-jwt-authorizer';

@Module({
  exports: [DocsJwtAuthorizer],
})
export class MiddlewaresModule {}
