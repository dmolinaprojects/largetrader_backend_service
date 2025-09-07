import { Injectable } from '@nestjs/common';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { RegisterUserUseCase } from '../use-cases/register-user.use-case';
import { RegisterUserRequestDto } from '../dto/register-user-request.dto';
import { AuthResponseDto } from '../dto/auth-response.dto';

@Injectable()
export class RegisterUserHandlerUseCase {
  constructor(
    @InjectPinoLogger(RegisterUserHandlerUseCase.name)
    private readonly logger: PinoLogger,
    private readonly registerUserUseCase: RegisterUserUseCase,
  ) {}

  async execute(userData: RegisterUserRequestDto): Promise<AuthResponseDto> {
    this.logger.info(
      `[RegisterUserHandlerUseCase.execute] Processing registration for email: ${userData.email}`,
    );

    const response = await this.registerUserUseCase.execute(userData);

    this.logger.info(
      `[RegisterUserHandlerUseCase.execute] Registration processed successfully for email: ${userData.email}`,
    );

    return response;
  }
}
