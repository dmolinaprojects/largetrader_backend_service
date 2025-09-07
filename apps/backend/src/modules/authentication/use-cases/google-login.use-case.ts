import { TTransactionArgs } from '@app/core';
import {
  Users,
  UsersRepository,
} from '@app/shared';
import { Inject, Injectable } from '@nestjs/common';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { HttpErrorCode } from '../../../common/filters/internal/internal-exception-error';
import { GoogleLoginRequestDto } from '../dto/google-login-request.dto';
import { TokenService } from '../../../shared/token/token-service';
import { AuthResponseDto } from '../dto/auth-response.dto';
import { UserResponseDto } from '../dto/user-response.dto';

@Injectable()
export class GoogleLoginUseCase {
  constructor(
    @InjectPinoLogger(GoogleLoginUseCase.name)
    private readonly logger: PinoLogger,
    @Inject('UsersRepository')
    private readonly usersRepository: UsersRepository,
    @Inject(TokenService)
    private readonly tokenService: TokenService,
  ) {}

  async execute(
    googleData: GoogleLoginRequestDto,
    tx?: TTransactionArgs,
  ): Promise<AuthResponseDto> {
    this.logger.info(
      `[GoogleLoginUseCase.execute] Attempting Google login for email: ${googleData.email}`,
    );

    // Buscar usuario por Google ID
    let user = await this.usersRepository.findByGoogleId(googleData.googleId);

    // Si no existe por Google ID, buscar por email
    if (!user) {
      user = await this.usersRepository.findByEmail(googleData.email);
      
      if (user) {
        // Si existe por email pero no tiene Google ID, actualizar con datos de Google
        this.logger.info(
          `[GoogleLoginUseCase.execute] Updating existing user with Google data: ${googleData.email}`,
        );
        
        const updatedUser = await this.usersRepository.updateOne(
          {
            where: { Id: user.Id },
            data: {
              GoogleId: googleData.googleId,
              GoogleName: googleData.name,
              GoogleSurname: googleData.surname,
              GoogleAvatar: googleData.avatar || null,
              GoogleGender: googleData.gender || null,
            },
          },
          tx,
        );
        
        user = updatedUser;
      } else {
        // Si no existe, crear nuevo usuario con datos de Google
        this.logger.info(
          `[GoogleLoginUseCase.execute] Creating new user with Google data: ${googleData.email}`,
        );
        
        const newUser = await this.usersRepository.createOne(
          {
            data: {
              Id: 0, // Auto-assigned by DB
              Name: googleData.name,
              Surname: googleData.surname,
              Email: googleData.email,
              GoogleId: googleData.googleId,
              GoogleName: googleData.name,
              GoogleSurname: googleData.surname,
              GoogleAvatar: googleData.avatar || null,
              GoogleGender: googleData.gender || null,
              Phone: null, NickName: null, Password: null,
              FacebookName: null, FacebookId: null, Company: null, Country: null, Address: null, PostalCode: null, City: null,
              Admin: false, Publisher: false, Token: null, TokenApp: null, Ip: null, Browser: null, Language: null,
              ActiveCampaign: false, Bitrix: null, RestoreDate: null, RestoreKey: null, PushWooshId: null,
              DateRegister: new Date(),
            },
          },
          tx,
        );
        
        user = newUser;
      }
    }

    // Generar tokens
    const payload = {
      sub: user.Id,
      email: user.Email,
      role: user.Admin ? 'ADMIN' : 'USER',
      name: user.Name,
      surname: user.Surname,
      googleId: user.GoogleId,
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
      `[GoogleLoginUseCase.execute] Google login successful for user: ${user.Email}`,
    );

    return response;
  }
}
