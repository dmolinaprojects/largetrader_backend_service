import { Injectable } from '@nestjs/common';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { CreateUserUseCase } from '../use-cases/create-user.use-case';
import { RegisterUserRequestDto } from '../dto/register-user-request.dto';
import { UserResponseDto } from '../dto/user-response.dto';

@Injectable()
export class CreateUserHandlerUseCase {
  constructor(
    @InjectPinoLogger(CreateUserHandlerUseCase.name)
    private readonly logger: PinoLogger,
    private readonly createUserUseCase: CreateUserUseCase,
  ) {}

  async execute(userData: RegisterUserRequestDto): Promise<UserResponseDto> {
    this.logger.info(
      `[CreateUserHandlerUseCase.execute] Creating user with email: ${userData.email}`,
    );

    const user = await this.createUserUseCase.execute(userData);

    const response: UserResponseDto = {
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

    this.logger.info(
      `[CreateUserHandlerUseCase.execute] User created successfully with UUID: ${user.Id}`,
    );

    return response;
  }
}
