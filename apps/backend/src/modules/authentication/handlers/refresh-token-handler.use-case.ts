import { Injectable } from '@nestjs/common';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { RefreshTokenUseCase } from '../use-cases/refresh-token.use-case';
import { AuthResponseDto } from '../dto/auth-response.dto';

@Injectable()
export class RefreshTokenHandlerUseCase {
  constructor(
    @InjectPinoLogger(RefreshTokenHandlerUseCase.name)
    private readonly logger: PinoLogger,
    private readonly refreshTokenUseCase: RefreshTokenUseCase,
  ) {}

  async execute(refreshToken: string): Promise<AuthResponseDto> {
    this.logger.info(
      `[RefreshTokenHandlerUseCase.execute] Processing token refresh`,
    );

    const response = await this.refreshTokenUseCase.execute(refreshToken);

    this.logger.info(
      `[RefreshTokenHandlerUseCase.execute] Token refresh processed successfully`,
    );

    return response;
  }
}
