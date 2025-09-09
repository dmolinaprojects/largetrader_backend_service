import { TTransactionArgs } from '@app/core';
import { Users, UsersRepository } from '@app/shared';
import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import * as bcrypt from 'bcrypt';
import { HttpErrorCode } from '../../../common/filters/internal/internal-exception-error';
import { RegisterUserRequestDto } from '../dto/register-user-request.dto';

@Injectable()
export class CreateUserUseCase {
  constructor(
    @InjectPinoLogger(CreateUserUseCase.name)
    private readonly logger: PinoLogger,
    @Inject('UsersRepository')
    private readonly usersRepository: UsersRepository,
  ) {}

  async execute(
    userData: RegisterUserRequestDto,
    tx?: TTransactionArgs,
  ): Promise<Users> {
    this.logger.info(
      `[CreateUserUseCase.execute] Creating user with email: ${userData.email}`,
    );

    // Verificar si el usuario ya existe
    const existingUser = await this.usersRepository.findByEmail(userData.email);

    if (existingUser) {
      this.logger.error(
        `[CreateUserUseCase.execute] User with email ${userData.email} already exists`,
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
      `[CreateUserUseCase.execute] User created successfully with ID: ${createdUser.Id}`,
    );

    return createdUser;
  }
}
