import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags, ApiResponse, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RegisterUserRequestDto } from '../dto/register-user-request.dto';
import { UserResponseDto } from '../dto/user-response.dto';
import { CreateUserHandlerUseCase } from '../handlers/create-user-handler.use-case';

@ApiTags('Authentication - Users')
@Controller('auth/users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('Authorization')
export class CreateUserController {
  constructor(
    @InjectPinoLogger(CreateUserController.name)
    private readonly logger: PinoLogger,
    private readonly createUserHandlerUseCase: CreateUserHandlerUseCase,
  ) {}

  @ApiOperation({
    summary: 'Crear nuevo usuario',
    description: 'Endpoint para crear un nuevo usuario en el sistema',
  })
  @ApiBody({
    type: RegisterUserRequestDto,
    description: 'Datos del usuario a crear',
  })
  @ApiResponse({
    status: 201,
    description: 'Usuario creado exitosamente',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Datos de entrada inválidos',
  })
  @ApiResponse({
    status: 409,
    description: 'El usuario ya existe',
  })
  @Post()
  async createUser(@Body() userData: RegisterUserRequestDto): Promise<UserResponseDto> {
    this.logger.info(
      `[CreateUserController.createUser] Creating user with email: ${userData.email}`,
    );

    const response = await this.createUserHandlerUseCase.execute(userData);

    this.logger.info(
      `[CreateUserController.createUser] User created successfully with ID: ${response.id}`,
    );

    return response;
  }
}
