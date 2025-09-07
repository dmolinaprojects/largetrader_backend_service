import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags, ApiResponse, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { UserResponseDto } from '../dto/user-response.dto';
import { GetAllUsersHandlerUseCase } from '../handlers/get-all-users-handler.use-case';

@ApiTags('Authentication - Users')
@Controller('auth/users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('Authorization')
export class GetAllUsersController {
  constructor(
    @InjectPinoLogger(GetAllUsersController.name)
    private readonly logger: PinoLogger,
    private readonly getAllUsersHandlerUseCase: GetAllUsersHandlerUseCase,
  ) {}

  @ApiOperation({
    summary: 'Obtener todos los usuarios',
    description: 'Endpoint para obtener una lista paginada de todos los usuarios',
  })
  @ApiQuery({
    name: 'page',
    description: 'Número de página',
    example: 1,
    required: false,
  })
  @ApiQuery({
    name: 'limit',
    description: 'Número de elementos por página',
    example: 10,
    required: false,
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de usuarios obtenida exitosamente',
    schema: {
      type: 'object',
      properties: {
        users: {
          type: 'array',
          items: { $ref: '#/components/schemas/UserResponseDto' },
        },
        total: {
          type: 'number',
          example: 100,
        },
        page: {
          type: 'number',
          example: 1,
        },
        limit: {
          type: 'number',
          example: 10,
        },
        totalPages: {
          type: 'number',
          example: 10,
        },
      },
    },
  })
  @Get()
  async getAllUsers(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<{
    users: UserResponseDto[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    this.logger.info(
      `[GetAllUsersController.getAllUsers] Getting all users - page: ${page}, limit: ${limit}`,
    );

    const response = await this.getAllUsersHandlerUseCase.execute(page, limit);

    this.logger.info(
      `[GetAllUsersController.getAllUsers] Retrieved ${response.users.length} users out of ${response.total} total`,
    );

    return response;
  }
}
