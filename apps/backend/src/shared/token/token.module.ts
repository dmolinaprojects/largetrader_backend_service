/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JwtTokenService } from './jwt/jwt-token.service';
import { TokenService } from './token-service';

@Module({
  imports: [JwtModule.register({})],
  providers: [{ provide: TokenService, useClass: JwtTokenService }],
  exports: [TokenService],
})
export class TokenModule {}
