import { Controller, Post, Body } from '@nestjs/common';
import { ApiOperation, ApiTags, ApiResponse, ApiBody } from '@nestjs/swagger';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { RegisterUserRequestDto } from '../dto/register-user-request.dto';
import { AuthResponseDto } from '../dto/auth-response.dto';
import { RegisterUserHandlerUseCase } from '../handlers/register-user-handler.use-case';

@ApiTags('Authentication')
@Controller('auth')
export class RegisterUserController {
  constructor(
    @InjectPinoLogger(RegisterUserController.name)
    private readonly logger: PinoLogger,
    private readonly registerUserHandlerUseCase: RegisterUserHandlerUseCase,
  ) {}

  @ApiOperation({
    summary: 'Registrar usuario',
    description: 'Endpoint para crear nuevos usuarios y obtener tokens JWT',
  })
  @ApiBody({
    type: RegisterUserRequestDto,
    description: 'Datos del usuario a registrar',
  })
  @ApiResponse({
    status: 201,
    description: 'Usuario registrado exitosamente',
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: 409,
    description: 'El usuario ya existe',
  })
  @ApiResponse({
    status: 400,
    description: 'Datos de entrada inválidos',
  })
  @Post('register')
  async register(@Body() userData: RegisterUserRequestDto): Promise<AuthResponseDto> {
    this.logger.info(
      `[RegisterUserController.register] Registration attempt for email: ${userData.email}`,
    );

    const response = await this.registerUserHandlerUseCase.execute(userData);

    this.logger.info(
      `[RegisterUserController.register] Registration successful for email: ${userData.email}`,
    );

    return response;
  }
}
