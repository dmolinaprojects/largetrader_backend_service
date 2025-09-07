import { Controller, Post, Body } from '@nestjs/common';
import { ApiOperation, ApiTags, ApiResponse, ApiBody } from '@nestjs/swagger';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { GoogleLoginRequestDto } from '../dto/google-login-request.dto';
import { AuthResponseDto } from '../dto/auth-response.dto';
import { GoogleLoginHandlerUseCase } from '../handlers/google-login-handler.use-case';

@ApiTags('Authentication')
@Controller('auth')
export class GoogleLoginController {
  constructor(
    @InjectPinoLogger(GoogleLoginController.name)
    private readonly logger: PinoLogger,
    private readonly googleLoginHandlerUseCase: GoogleLoginHandlerUseCase,
  ) {}

  @ApiOperation({
    summary: 'Iniciar sesión con Google',
    description: 'Endpoint para autenticar usuarios usando credenciales de Google',
  })
  @ApiBody({
    type: GoogleLoginRequestDto,
    description: 'Datos de autenticación de Google',
  })
  @ApiResponse({
    status: 200,
    description: 'Inicio de sesión con Google exitoso',
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Datos de entrada inválidos',
  })
  @Post('google-login')
  async googleLogin(@Body() googleData: GoogleLoginRequestDto): Promise<AuthResponseDto> {
    this.logger.info(
      `[GoogleLoginController.googleLogin] Google login attempt for email: ${googleData.email}`,
    );

    const response = await this.googleLoginHandlerUseCase.execute(googleData);

    this.logger.info(
      `[GoogleLoginController.googleLogin] Google login successful for email: ${googleData.email}`,
    );

    return response;
  }
}
