import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import {
  ApiOperation,
  ApiTags,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
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
    summary: 'Create new user',
    description: 'Endpoint to create a new user in the system',
  })
  @ApiBody({
    type: RegisterUserRequestDto,
    description: 'User data to create',
  })
  @ApiResponse({
    status: 201,
    description: 'User created successfully',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
  })
  @ApiResponse({
    status: 409,
    description: 'User already exists',
  })
  @Post()
  async createUser(
    @Body() userData: RegisterUserRequestDto,
  ): Promise<UserResponseDto> {
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
