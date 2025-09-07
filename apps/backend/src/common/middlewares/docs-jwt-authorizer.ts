/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class DocsJwtAuthorizer {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  validateToken(jwtToken: string): boolean {
    try {
      const secret = this.configService.get<string>(
        'APP_DOCUMENTATION_SECRET_TOKEN',
      );

      if (!secret) {
        return false;
      }

      const decoded = this.jwtService.verify(jwtToken, { secret });
      return !!decoded;
    } catch (error: any) {
      return false;
    }
  }
}
