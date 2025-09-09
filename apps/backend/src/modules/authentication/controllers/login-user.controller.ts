import { Controller, Post, Body } from '@nestjs/common';
import { ApiOperation, ApiTags, ApiResponse, ApiBody } from '@nestjs/swagger';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { LoginUserRequestDto } from '../dto/login-user-request.dto';
import { AuthResponseDto } from '../dto/auth-response.dto';
import { LoginUserHandlerUseCase } from '../handlers/login-user-handler.use-case';

@ApiTags('Authentication')
@Controller('auth')
export class LoginUserController {
  constructor(
    @InjectPinoLogger(LoginUserController.name)
    private readonly logger: PinoLogger,
    private readonly loginUserHandlerUseCase: LoginUserHandlerUseCase,
  ) {}

  @ApiOperation({
    summary: 'Login',
    description: 'Endpoint to authenticate users and obtain JWT tokens',
  })
  @ApiBody({
    type: LoginUserRequestDto,
    description: 'User login credentials',
  })
  @ApiResponse({
    status: 200,
    description: 'Login successful',
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid credentials',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
  })
  @Post('email/login')
  async login(
    @Body() loginData: LoginUserRequestDto,
  ): Promise<AuthResponseDto> {
    this.logger.info(
      `[LoginUserController.login] Login attempt for email: ${loginData.email}`,
    );

    const response = await this.loginUserHandlerUseCase.execute(loginData);

    this.logger.info(
      `[LoginUserController.login] Login successful for email: ${loginData.email}`,
    );

    return response;
  }
}
