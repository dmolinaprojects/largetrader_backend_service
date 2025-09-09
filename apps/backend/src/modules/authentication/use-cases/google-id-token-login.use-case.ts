import { TTransactionArgs } from '@app/core';
import { Users, UsersRepository } from '@app/shared';
import { Inject, Injectable } from '@nestjs/common';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { GoogleIdTokenLoginRequestDto } from '../dto/google-id-token-login-request.dto';
import { TokenService } from '../../../shared/token/token-service';
import { AuthResponseDto } from '../dto/auth-response.dto';
import { UserResponseDto } from '../dto/user-response.dto';
import {
  GoogleAuthService,
  GoogleTokenPayload,
} from '../services/google-auth.service';

@Injectable()
export class GoogleIdTokenLoginUseCase {
  constructor(
    @InjectPinoLogger(GoogleIdTokenLoginUseCase.name)
    private readonly logger: PinoLogger,
    @Inject('UsersRepository')
    private readonly usersRepository: UsersRepository,
    @Inject(TokenService)
    private readonly tokenService: TokenService,
    private readonly googleAuthService: GoogleAuthService,
  ) {}

  async execute(
    googleData: GoogleIdTokenLoginRequestDto,
    tx?: TTransactionArgs,
  ): Promise<AuthResponseDto> {
    this.logger.info(
      `[GoogleIdTokenLoginUseCase.execute] Attempting Google ID token login`,
    );

    // Verificar el token de Google
    const payload: GoogleTokenPayload =
      await this.googleAuthService.verifyIdToken(googleData.id_token);

    // Buscar usuario por Google ID (sub)
    let user = await this.usersRepository.findByGoogleId(payload.sub);

    // Si no existe por Google ID, buscar por email
    if (!user) {
      user = await this.usersRepository.findByEmail(payload.email);

      if (user) {
        // Si existe por email pero no tiene Google ID, actualizar con datos de Google
        this.logger.info(
          `[GoogleIdTokenLoginUseCase.execute] Updating existing user with Google data: ${payload.email}`,
        );

        const updatedUser = await this.usersRepository.updateOne(
          {
            where: { Id: user.Id },
            data: {
              GoogleId: payload.sub,
              GoogleName: payload.given_name || payload.name,
              GoogleSurname: payload.family_name || '',
              GoogleAvatar: payload.picture || null,
            },
          },
          tx,
        );

        user = updatedUser;
      } else {
        // Si no existe, crear nuevo usuario con datos de Google
        this.logger.info(
          `[GoogleIdTokenLoginUseCase.execute] Creating new user with Google data: ${payload.email}`,
        );

        const newUser = await this.usersRepository.createOne(
          {
            data: {
              Id: 0, // Auto-assigned by DB
              Name: payload.given_name || payload.name,
              Surname: payload.family_name || '',
              Email: payload.email,
              GoogleId: payload.sub,
              GoogleName: payload.given_name || payload.name,
              GoogleSurname: payload.family_name || '',
              GoogleAvatar: payload.picture || null,
              GoogleGender: null,
              Phone: null,
              NickName: null,
              Password: null,
              FacebookName: null,
              FacebookId: null,
              Company: null,
              Country: null,
              Address: null,
              PostalCode: null,
              City: null,
              Admin: false,
              Publisher: false,
              Token: null,
              TokenApp: null,
              Ip: null,
              Browser: null,
              Language: null,
              ActiveCampaign: false,
              Bitrix: null,
              RestoreDate: null,
              RestoreKey: null,
              PushWooshId: null,
              DateRegister: new Date(),
            },
          },
          tx,
        );

        user = newUser;
      }
    }

    // Generar tokens
    const tokenPayload = {
      sub: user.Id,
      email: user.Email,
      role: user.Admin ? 'ADMIN' : 'USER',
      name: user.Name,
      surname: user.Surname,
      googleId: user.GoogleId,
    };

    const accessToken = this.tokenService.generateAccessToken(tokenPayload);
    const refreshToken = this.tokenService.generateRefreshToken(tokenPayload);

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
      `[GoogleIdTokenLoginUseCase.execute] Google ID token login successful for user: ${user.Email}`,
    );

    return response;
  }
}
