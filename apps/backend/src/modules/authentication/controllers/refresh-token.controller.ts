import { Controller, Post, Body } from '@nestjs/common';
import { ApiOperation, ApiTags, ApiResponse, ApiBody } from '@nestjs/swagger';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { AuthResponseDto } from '../dto/auth-response.dto';
import { RefreshTokenRequestDto } from '../dto/refresh-token-request.dto';
import { RefreshTokenHandlerUseCase } from '../handlers/refresh-token-handler.use-case';

@ApiTags('Authentication')
@Controller('auth')
export class RefreshTokenController {
  constructor(
    @InjectPinoLogger(RefreshTokenController.name)
    private readonly logger: PinoLogger,
    private readonly refreshTokenHandlerUseCase: RefreshTokenHandlerUseCase,
  ) {}

  @ApiOperation({
    summary: 'Refresh access token',
    description:
      'Endpoint to refresh the access token using the refresh token',
  })
  @ApiBody({
    type: RefreshTokenRequestDto,
    description: 'Refresh token to renew the access token',
  })
  @ApiResponse({
    status: 200,
    description: 'Token refreshed successfully',
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid or expired refresh token',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
  })
  @Post('refresh')
  async refreshToken(
    @Body() body: RefreshTokenRequestDto,
  ): Promise<AuthResponseDto> {
    this.logger.info(
      `[RefreshTokenController.refreshToken] Token refresh attempt`,
    );

    const response = await this.refreshTokenHandlerUseCase.execute(
      body.refreshToken,
    );

    this.logger.info(
      `[RefreshTokenController.refreshToken] Token refresh successful`,
    );

    return response;
  }
}
