/* eslint-disable @typescript-eslint/require-await */
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { TokenService } from '../../shared/token/token-service';
import {
  InternalExceptionError,
  HttpErrorCode,
} from '../filters/internal/internal-exception-error';
import { CreateNewUserWithGoogleDto } from '../../modules/authentication/dto/create-new-user-with-google.dto';

@Injectable()
export class SocialAuthGuard implements CanActivate {
  constructor(private readonly tokenService: TokenService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new InternalExceptionError(HttpErrorCode.TOKEN_NOT_PROVIDED);
    }

    const payload = this.tokenService.validateToken(token, 'socialLogin');
    request['user'] = payload as CreateNewUserWithGoogleDto;

    return true;
  }

  private extractTokenFromHeader(request: Request): string | null {
    const authHeader = String(request.headers['social-authorization']);
    if (!authHeader) {
      return null;
    }

    const [type, token] = authHeader.split(' ');
    return type === 'Bearer' ? token : null;
  }
}