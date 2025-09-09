import { TTransactionArgs } from '@app/core';
import { Users, UsersRepository } from '@app/shared';
import {
  ConflictException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { HttpErrorCode } from '../../../common/filters/internal/internal-exception-error';
import { TokenService } from '../../../shared/token/token-service';
import { AuthResponseDto } from '../dto/auth-response.dto';
import { UserResponseDto } from '../dto/user-response.dto';

@Injectable()
export class RefreshTokenUseCase {
  constructor(
    @InjectPinoLogger(RefreshTokenUseCase.name)
    private readonly logger: PinoLogger,
    @Inject('UsersRepository')
    private readonly usersRepository: UsersRepository,
    @Inject(TokenService)
    private readonly tokenService: TokenService,
  ) {}

  async execute(
    refreshToken: string,
    tx?: TTransactionArgs,
  ): Promise<AuthResponseDto> {
    this.logger.info(`[RefreshTokenUseCase.execute] Refreshing token`);

    try {
      // Validar el refresh token
      const payload = this.tokenService.validateToken(refreshToken, 'refresh');

      // Buscar el usuario
      const user = await this.usersRepository.findOne(
        { where: { Id: payload.sub } },
        tx,
      );

      if (!user) {
        this.logger.error(
          `[RefreshTokenUseCase.execute] User not found with ID: ${payload.sub}`,
        );
        throw new UnauthorizedException('Usuario no encontrado');
      }

      // Generar nuevos tokens
      const newPayload = {
        sub: user.Id,
        email: user.Email,
        role: user.Admin ? 'ADMIN' : 'USER',
        name: user.Name,
        surname: user.Surname,
      };

      const accessToken = this.tokenService.generateAccessToken(newPayload);
      const newRefreshToken =
        this.tokenService.generateRefreshToken(newPayload);

      // Obtener tiempo de expiración del access token (15 minutos)
      const expiresIn = 15 * 60; // 15 minutos en segundos

      // Crear respuesta del usuario
      const userResponse: UserResponseDto = {
        id: user.Id,
        dateRegister: user.DateRegister || undefined,
        nickName: user.NickName || undefined,
        name: user.Name || undefined,
        surname: user.Surname || undefined,
        phone: user.Phone || undefined,
        googleName: user.GoogleName || undefined,
        googleSurname: user.GoogleSurname || undefined,
        email: user.Email,
        googleId: user.GoogleId || undefined,
        googleAvatar: user.GoogleAvatar || undefined,
        googleGender: user.GoogleGender || undefined,
        facebookName: user.FacebookName || undefined,
        facebookId: user.FacebookId || undefined,
        company: user.Company || undefined,
        country: user.Country || undefined,
        address: user.Address || undefined,
        postalCode: user.PostalCode || undefined,
        city: user.City || undefined,
        admin: user.Admin,
        publisher: user.Publisher,
        token: user.Token || undefined,
        tokenApp: user.TokenApp || undefined,
        ip: user.Ip || undefined,
        browser: user.Browser || undefined,
        language: user.Language || undefined,
        activeCampaign: user.ActiveCampaign,
        bitrix: user.Bitrix || undefined,
        restoreDate: user.RestoreDate || undefined,
        restoreKey: user.RestoreKey || undefined,
        pushWooshId: user.PushWooshId || undefined,
      };

      const response: AuthResponseDto = {
        accessToken,
        refreshToken: newRefreshToken,
        expiresIn,
        user: userResponse,
      };

      this.logger.info(
        `[RefreshTokenUseCase.execute] Token refreshed successfully for user: ${user.Email}`,
      );

      return response;
    } catch (error) {
      this.logger.error(
        `[RefreshTokenUseCase.execute] Token refresh failed: ${error.message}`,
      );
      throw new UnauthorizedException('Refresh token inválido o expirado');
    }
  }
}
