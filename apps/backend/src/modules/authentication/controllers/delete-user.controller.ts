import { Controller, Delete, Param, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags, ApiResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { DeleteUserHandlerUseCase } from '../handlers/delete-user-handler.use-case';

@ApiTags('Authentication - Users')
@Controller('auth/users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('Authorization')
export class DeleteUserController {
  constructor(
    @InjectPinoLogger(DeleteUserController.name)
    private readonly logger: PinoLogger,
    private readonly deleteUserHandlerUseCase: DeleteUserHandlerUseCase,
  ) {}

  @ApiOperation({
    summary: 'Eliminar usuario',
    description: 'Endpoint para eliminar un usuario del sistema',
  })
  @ApiParam({
    name: 'id',
    description: 'ID único del usuario',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Usuario eliminado exitosamente',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Usuario eliminado exitosamente',
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Usuario no encontrado',
  })
  @Delete(':id')
  async deleteUser(@Param('id') id: string): Promise<{ message: string }> {
    this.logger.info(
      `[DeleteUserController.deleteUser] Deleting user with ID: ${id}`,
    );

    const response = await this.deleteUserHandlerUseCase.execute(id);

    this.logger.info(
      `[DeleteUserController.deleteUser] User deleted successfully with ID: ${id}`,
    );

    return response;
  }
}
