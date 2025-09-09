import { TTransactionArgs } from '@app/core';
import { Users, UsersRepository } from '@app/shared';
import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import * as bcrypt from 'bcrypt';
import { HttpErrorCode } from '../../../common/filters/internal/internal-exception-error';
import { RegisterUserRequestDto } from '../dto/register-user-request.dto';
import { TokenService } from '../../../shared/token/token-service';
import { AuthResponseDto } from '../dto/auth-response.dto';
import { UserResponseDto } from '../dto/user-response.dto';

@Injectable()
export class RegisterUserUseCase {
  constructor(
    @InjectPinoLogger(RegisterUserUseCase.name)
    private readonly logger: PinoLogger,
    @Inject('UsersRepository')
    private readonly usersRepository: UsersRepository,
    @Inject(TokenService)
    private readonly tokenService: TokenService,
  ) {}

  async execute(
    userData: RegisterUserRequestDto,
    tx?: TTransactionArgs,
  ): Promise<AuthResponseDto> {
    this.logger.info(
      `[RegisterUserUseCase.execute] Registering user with email: ${userData.email}`,
    );

    // Verificar si el usuario ya existe
    const existingUser = await this.usersRepository.findByEmail(userData.email);

    if (existingUser) {
      this.logger.error(
        `[RegisterUserUseCase.execute] User already exists with email: ${userData.email}`,
      );
      throw new ConflictException(HttpErrorCode.ALREADY_EXISTS);
    }

    // Hash de la contraseña
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(userData.password, saltRounds);

    // Crear el usuario
    const userToCreate = {
      Id: 0, // Se asignará automáticamente por la base de datos
      Name: userData.firstName,
      Surname: userData.lastName,
      Email: userData.email,
      Phone: userData.phone || null,
      Password: passwordHash,
      NickName: null,
      GoogleName: null,
      GoogleSurname: null,
      GoogleId: null,
      GoogleAvatar: null,
      GoogleGender: null,
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
    };

    const createdUser = await this.usersRepository.createOne(
      { data: userToCreate },
      tx,
    );

    this.logger.info(
      `[RegisterUserUseCase.execute] User created successfully with ID: ${createdUser.Id}`,
    );

    // Generar tokens para el usuario recién creado
    const payload = {
      sub: createdUser.Id,
      email: createdUser.Email,
      role: 'USER',
      name: createdUser.Name,
      surname: createdUser.Surname,
    };

    const accessToken = this.tokenService.generateAccessToken(payload);
    const refreshToken = this.tokenService.generateRefreshToken(payload);

    // Obtener tiempo de expiración del access token (15 minutos)
    const expiresIn = 15 * 60; // 15 minutos en segundos

    // Crear respuesta del usuario
    const userResponse: UserResponseDto = {
      id: createdUser.Id,
      dateRegister: createdUser.DateRegister || undefined,
      nickName: createdUser.NickName || undefined,
      name: createdUser.Name || undefined,
      surname: createdUser.Surname || undefined,
      phone: createdUser.Phone || undefined,
      googleName: createdUser.GoogleName || undefined,
      googleSurname: createdUser.GoogleSurname || undefined,
      email: createdUser.Email,
      googleId: createdUser.GoogleId || undefined,
      googleAvatar: createdUser.GoogleAvatar || undefined,
      googleGender: createdUser.GoogleGender || undefined,
      facebookName: createdUser.FacebookName || undefined,
      facebookId: createdUser.FacebookId || undefined,
      company: createdUser.Company || undefined,
      country: createdUser.Country || undefined,
      address: createdUser.Address || undefined,
      postalCode: createdUser.PostalCode || undefined,
      city: createdUser.City || undefined,
      admin: createdUser.Admin,
      publisher: createdUser.Publisher,
      token: createdUser.Token || undefined,
      tokenApp: createdUser.TokenApp || undefined,
      ip: createdUser.Ip || undefined,
      browser: createdUser.Browser || undefined,
      language: createdUser.Language || undefined,
      activeCampaign: createdUser.ActiveCampaign,
      bitrix: createdUser.Bitrix || undefined,
      restoreDate: createdUser.RestoreDate || undefined,
      restoreKey: createdUser.RestoreKey || undefined,
      pushWooshId: createdUser.PushWooshId || undefined,
    };

    const response: AuthResponseDto = {
      accessToken,
      refreshToken,
      expiresIn,
      user: userResponse,
    };

    this.logger.info(
      `[RegisterUserUseCase.execute] Registration successful for user: ${createdUser.Email}`,
    );

    return response;
  }
}
