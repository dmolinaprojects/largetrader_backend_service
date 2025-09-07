import { Injectable } from '@nestjs/common';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { GoogleLoginUseCase } from '../use-cases/google-login.use-case';
import { GoogleLoginRequestDto } from '../dto/google-login-request.dto';
import { AuthResponseDto } from '../dto/auth-response.dto';

@Injectable()
export class GoogleLoginHandlerUseCase {
  constructor(
    @InjectPinoLogger(GoogleLoginHandlerUseCase.name)
    private readonly logger: PinoLogger,
    private readonly googleLoginUseCase: GoogleLoginUseCase,
  ) {}

  async execute(googleData: GoogleLoginRequestDto): Promise<AuthResponseDto> {
    this.logger.info(
      `[GoogleLoginHandlerUseCase.execute] Processing Google login for email: ${googleData.email}`,
    );

    const response = await this.googleLoginUseCase.execute(googleData);

    this.logger.info(
      `[GoogleLoginHandlerUseCase.execute] Google login processed successfully for email: ${googleData.email}`,
    );

    return response;
  }
}
