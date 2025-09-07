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
    summary: 'Renovar token de acceso',
    description: 'Endpoint para renovar el access token usando el refresh token',
  })
  @ApiBody({
    type: RefreshTokenRequestDto,
    description: 'Refresh token para renovar el access token',
  })
  @ApiResponse({
    status: 200,
    description: 'Token renovado exitosamente',
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Refresh token inválido o expirado',
  })
  @ApiResponse({
    status: 400,
    description: 'Datos de entrada inválidos',
  })
  @Post('refresh')
  async refreshToken(@Body() body: RefreshTokenRequestDto): Promise<AuthResponseDto> {
    this.logger.info(
      `[RefreshTokenController.refreshToken] Token refresh attempt`,
    );

    const response = await this.refreshTokenHandlerUseCase.execute(body.refreshToken);

    this.logger.info(
      `[RefreshTokenController.refreshToken] Token refresh successful`,
    );

    return response;
  }
}
