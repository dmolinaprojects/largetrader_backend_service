import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import {
  ApiOperation,
  ApiTags,
  ApiResponse,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { UserResponseDto } from '../dto/user-response.dto';
import { GetAllUsersResponseDto } from '../dto/get-all-users-response.dto';
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
    summary: 'Get all users',
    description:
      'Endpoint to get a paginated list of all users',
  })
  @ApiQuery({
    name: 'page',
    description: 'Page number',
    example: 1,
    required: false,
  })
  @ApiQuery({
    name: 'limit',
    description: 'Number of items per page',
    example: 10,
    required: false,
  })
  @ApiResponse({
    status: 200,
    description: 'Users list retrieved successfully',
    type: GetAllUsersResponseDto,
  })
  @Get()
  async getAllUsers(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<GetAllUsersResponseDto> {
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
