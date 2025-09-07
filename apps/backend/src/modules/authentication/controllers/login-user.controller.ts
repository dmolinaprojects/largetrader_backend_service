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
    summary: 'Iniciar sesión',
    description: 'Endpoint para autenticar usuarios y obtener tokens JWT',
  })
  @ApiBody({
    type: LoginUserRequestDto,
    description: 'Credenciales de acceso del usuario',
  })
  @ApiResponse({
    status: 200,
    description: 'Inicio de sesión exitoso',
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Credenciales inválidas',
  })
  @ApiResponse({
    status: 400,
    description: 'Datos de entrada inválidos',
  })
  @Post('login')
  async login(@Body() loginData: LoginUserRequestDto): Promise<AuthResponseDto> {
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
