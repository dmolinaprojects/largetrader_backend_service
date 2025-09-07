/* eslint-disable @typescript-eslint/no-unused-vars */

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import {
  HttpErrorCode,
  InternalExceptionError,
} from '../../../common/filters/internal/internal-exception-error';
import { TokenService } from '../token-service';

@Injectable()
export class JwtTokenService implements TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) { }

  /**
   * Generates an access token using the provided payload.
   * The token is signed with a secret key and has an expiration time.
   *
   * @param payload - The data to be included in the token.
   * @returns The generated access token as a string.
   */
  generateAccessToken(payload: Record<string, any>): string {
    const secret = this.configService.get<string>('JWT_ACCESS_SECRET') || 'default-access-secret-change-in-production';
    const expiresIn = this.configService.get<string>('JWT_ACCESS_EXPIRES_IN') || '15m';

    return this.jwtService.sign(payload, {
      secret,
      expiresIn,
    });
  }

  /**
   * Generates a refresh token using the provided payload.
   * The token is signed with a secret key and has an expiration time.
   *
   * @param payload - The data to be included in the token.
   * @returns The generated refresh token as a string.
   */
  generateRefreshToken(payload: Record<string, any>): string {
    const secret = this.configService.get<string>('JWT_REFRESH_SECRET') || 'default-refresh-secret-change-in-production';
    const expiresIn = this.configService.get<string>('JWT_REFRESH_EXPIRES_IN') || '7d';

    return this.jwtService.sign(payload, {
      secret,
      expiresIn,
    });
  }

  /**
   * Validates the provided token based on its type (access or refresh).
   * The token is verified using the corresponding secret key.
   *
   * @param token - The token to be validated.
   * @param type - The type of the token ('access' or 'refresh').
   * @returns The decoded token payload if the token is valid.
   * @throws HttpCustomExceptionError if the token is invalid or expired.
   */
  validateToken(
    token: string,
    type: 'access' | 'refresh' | 'recoverAccount' | 'socialLogin',
  ): Record<string, any> {
    try {
      let secret: string;

      switch (type) {
        case 'access':
          secret = this.configService.get<string>('JWT_ACCESS_SECRET') || 'default-access-secret-change-in-production';
          break;
        case 'refresh':
          secret = this.configService.get<string>('JWT_REFRESH_SECRET') || 'default-refresh-secret-change-in-production';
          break;
        case 'socialLogin':
          secret = this.configService.get<string>('JWT_SOCIAL_LOGIN_SECRET') || 'default-social-login-secret-change-in-production';
          break;
        case 'recoverAccount':
          secret = this.configService.get<string>('JWT_RECOVER_ACCOUNT_SECRET') || 'default-recover-account-secret-change-in-production';
          break;
        default:
          throw new InternalExceptionError(HttpErrorCode.UNAUTHORIZED);
      }

      return this.jwtService.verify(token, { secret });
    } catch (e: any) {
      throw new InternalExceptionError(HttpErrorCode.UNAUTHORIZED);
    }
  }
}
