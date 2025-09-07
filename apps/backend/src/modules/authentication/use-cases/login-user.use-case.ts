import { TTransactionArgs } from '@app/core';
import {
  Users,
  UsersRepository,
} from '@app/shared';
import { ConflictException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { HttpErrorCode } from '../../../common/filters/internal/internal-exception-error';
import { LoginUserRequestDto } from '../dto/login-user-request.dto';
import { TokenService } from '../../../shared/token/token-service';
import { AuthResponseDto } from '../dto/auth-response.dto';
import { UserResponseDto } from '../dto/user-response.dto';

@Injectable()
export class LoginUserUseCase {
  constructor(
    @InjectPinoLogger(LoginUserUseCase.name)
    private readonly logger: PinoLogger,
    @Inject('UsersRepository')
    private readonly usersRepository: UsersRepository,
    @Inject(TokenService)
    private readonly tokenService: TokenService,
  ) {}

  async execute(
    loginData: LoginUserRequestDto,
    tx?: TTransactionArgs,
  ): Promise<AuthResponseDto> {
    this.logger.info(
      `[LoginUserUseCase.execute] Attempting login for email: ${loginData.email}`,
    );

    // Buscar usuario por email
    const user = await this.usersRepository.findByEmail(loginData.email);

    if (!user) {
      this.logger.error(
        `[LoginUserUseCase.execute] User not found with email: ${loginData.email}`,
      );
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Verificar contraseña
    if (!user.Password) {
      this.logger.error(
        `[LoginUserUseCase.execute] User has no password set: ${loginData.email}`,
      );
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Intentar verificar con bcrypt primero
    let isPasswordValid = false;
    try {
      isPasswordValid = await bcrypt.compare(loginData.password, user.Password);
    } catch (error) {
      // Si falla bcrypt, intentar con MD5
      this.logger.info(
        `[LoginUserUseCase.execute] Bcrypt failed, trying MD5 for email: ${loginData.email}`,
      );
    }

    // Si bcrypt falló, intentar con MD5
    if (!isPasswordValid) {
      const md5Hash = crypto.createHash('md5').update(loginData.password).digest('hex');
      isPasswordValid = user.Password === md5Hash;
      
      if (isPasswordValid) {
        this.logger.info(
          `[LoginUserUseCase.execute] MD5 password match for email: ${loginData.email}`,
        );
      }
    }

    if (!isPasswordValid) {
      this.logger.error(
        `[LoginUserUseCase.execute] Invalid password for email: ${loginData.email}`,
      );
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Generar tokens
    const payload = {
      sub: user.Id,
      email: user.Email,
      role: user.Admin ? 'ADMIN' : 'USER',
      name: user.Name,
      surname: user.Surname,
    };

    const accessToken = this.tokenService.generateAccessToken(payload);
    const refreshToken = this.tokenService.generateRefreshToken(payload);

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
      refreshToken,
      expiresIn,
      user: userResponse,
    };

    this.logger.info(
      `[LoginUserUseCase.execute] Login successful for user: ${user.Email}`,
    );

    return response;
  }
}
