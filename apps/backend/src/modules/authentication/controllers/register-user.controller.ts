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
    summary: 'Register user',
    description: 'Endpoint to create new users and obtain JWT tokens',
  })
  @ApiBody({
    type: RegisterUserRequestDto,
    description: 'User data to register',
  })
  @ApiResponse({
    status: 201,
    description: 'User registered successfully',
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: 409,
    description: 'User already exists',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
  })
  @Post('register')
  async register(
    @Body() userData: RegisterUserRequestDto,
  ): Promise<AuthResponseDto> {
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
