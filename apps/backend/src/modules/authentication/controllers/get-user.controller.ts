import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import {
  ApiOperation,
  ApiTags,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { UserResponseDto } from '../dto/user-response.dto';
import { GetUserHandlerUseCase } from '../handlers/get-user-handler.use-case';

@ApiTags('Authentication - Users')
@Controller('auth/users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('Authorization')
export class GetUserController {
  constructor(
    @InjectPinoLogger(GetUserController.name)
    private readonly logger: PinoLogger,
    private readonly getUserHandlerUseCase: GetUserHandlerUseCase,
  ) {}

  @ApiOperation({
    summary: 'Get user by ID',
    description: 'Endpoint to get a specific user by their ID',
  })
  @ApiParam({
    name: 'id',
    description: 'Unique user ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'User retrieved successfully',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  @Get(':id')
  async getUser(@Param('id') id: string): Promise<UserResponseDto> {
    this.logger.info(`[GetUserController.getUser] Getting user with ID: ${id}`);

    const response = await this.getUserHandlerUseCase.execute(id);

    this.logger.info(
      `[GetUserController.getUser] User retrieved successfully with ID: ${response.id}`,
    );

    return response;
  }
}
