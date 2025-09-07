import { Controller, Put, Param, Body, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags, ApiResponse, ApiParam, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
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
    summary: 'Actualizar usuario',
    description: 'Endpoint para actualizar un usuario existente',
  })
  @ApiParam({
    name: 'id',
    description: 'ID único del usuario',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiBody({
    type: UpdateUserRequestDto,
    description: 'Datos del usuario a actualizar',
  })
  @ApiResponse({
    status: 200,
    description: 'Usuario actualizado exitosamente',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Datos de entrada inválidos',
  })
  @ApiResponse({
    status: 404,
    description: 'Usuario no encontrado',
  })
  @ApiResponse({
    status: 409,
    description: 'El email ya está en uso por otro usuario',
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
