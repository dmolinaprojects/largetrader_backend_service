import { Controller, Put, Param, Body, UseGuards } from '@nestjs/common';
import {
  ApiOperation,
  ApiTags,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { UpdateUserRequestDto } from '../dto/update-user-request.dto';
import { UserResponseDto } from '../dto/user-response.dto';
import { UpdateUserHandlerUseCase } from '../handlers/update-user-handler.use-case';

@ApiTags('Authentication - Users')
@Controller('auth/users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('Authorization')
export class UpdateUserController {
  constructor(
    @InjectPinoLogger(UpdateUserController.name)
    private readonly logger: PinoLogger,
    private readonly updateUserHandlerUseCase: UpdateUserHandlerUseCase,
  ) {}

  @ApiOperation({
    summary: 'Update user',
    description: 'Endpoint to update an existing user',
  })
  @ApiParam({
    name: 'id',
    description: 'Unique user ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiBody({
    type: UpdateUserRequestDto,
    description: 'User data to update',
  })
  @ApiResponse({
    status: 200,
    description: 'User updated successfully',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  @ApiResponse({
    status: 409,
    description: 'Email is already in use by another user',
  })
  @Put(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() userData: UpdateUserRequestDto,
  ): Promise<UserResponseDto> {
    this.logger.info(
      `[UpdateUserController.updateUser] Updating user with ID: ${id}`,
    );

    const response = await this.updateUserHandlerUseCase.execute(id, userData);

    this.logger.info(
      `[UpdateUserController.updateUser] User updated successfully with ID: ${response.id}`,
    );

    return response;
  }
}
