import { Injectable } from '@nestjs/common';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { LoginUserUseCase } from '../use-cases/login-user.use-case';
import { LoginUserRequestDto } from '../dto/login-user-request.dto';
import { AuthResponseDto } from '../dto/auth-response.dto';

@Injectable()
export class LoginUserHandlerUseCase {
  constructor(
    @InjectPinoLogger(LoginUserHandlerUseCase.name)
    private readonly logger: PinoLogger,
    private readonly loginUserUseCase: LoginUserUseCase,
  ) {}

  async execute(loginData: LoginUserRequestDto): Promise<AuthResponseDto> {
    this.logger.info(
      `[LoginUserHandlerUseCase.execute] Processing login for email: ${loginData.email}`,
    );

    const response = await this.loginUserUseCase.execute(loginData);

    this.logger.info(
      `[LoginUserHandlerUseCase.execute] Login processed successfully for email: ${loginData.email}`,
    );

    return response;
  }
}
