import { Controller, Post, Body } from '@nestjs/common';
import { ApiOperation, ApiTags, ApiResponse, ApiBody } from '@nestjs/swagger';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { GoogleIdTokenLoginRequestDto } from '../dto/google-id-token-login-request.dto';
import { AuthResponseDto } from '../dto/auth-response.dto';
import { GoogleIdTokenLoginHandlerUseCase } from '../handlers/google-id-token-login-handler.use-case';

@ApiTags('Authentication')
@Controller('auth')
export class GoogleLoginController {
  constructor(
    @InjectPinoLogger(GoogleLoginController.name)
    private readonly logger: PinoLogger,
    private readonly googleIdTokenLoginHandlerUseCase: GoogleIdTokenLoginHandlerUseCase,
  ) {}

  @ApiOperation({
    summary: 'Login with Google ID Token',
    description: 'Endpoint to authenticate users using Google ID Token',
  })
  @ApiBody({
    type: GoogleIdTokenLoginRequestDto,
    description: 'Google ID Token for authentication',
  })
  @ApiResponse({
    status: 200,
    description: 'Google login successful',
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid Google token',
  })
  @Post('google/login')
  async googleLogin(
    @Body() googleData: GoogleIdTokenLoginRequestDto,
  ): Promise<AuthResponseDto> {
    this.logger.info(
      `[GoogleLoginController.googleLogin] Google ID token login attempt`,
    );

    const response =
      await this.googleIdTokenLoginHandlerUseCase.execute(googleData);

    this.logger.info(
      `[GoogleLoginController.googleLogin] Google ID token login successful`,
    );

    return response;
  }
}
