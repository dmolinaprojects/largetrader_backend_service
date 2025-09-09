import { Inject, Injectable } from '@nestjs/common';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { GoogleIdTokenLoginRequestDto } from '../dto/google-id-token-login-request.dto';
import { AuthResponseDto } from '../dto/auth-response.dto';
import { GoogleIdTokenLoginUseCase } from '../use-cases/google-id-token-login.use-case';

@Injectable()
export class GoogleIdTokenLoginHandlerUseCase {
  constructor(
    @InjectPinoLogger(GoogleIdTokenLoginHandlerUseCase.name)
    private readonly logger: PinoLogger,
    private readonly googleIdTokenLoginUseCase: GoogleIdTokenLoginUseCase,
  ) {}

  async execute(
    googleData: GoogleIdTokenLoginRequestDto,
  ): Promise<AuthResponseDto> {
    this.logger.info(
      `[GoogleIdTokenLoginHandlerUseCase.execute] Processing Google ID token login request`,
    );

    const response = await this.googleIdTokenLoginUseCase.execute(googleData);

    this.logger.info(
      `[GoogleIdTokenLoginHandlerUseCase.execute] Google ID token login request processed successfully`,
    );

    return response;
  }
}
