import { Injectable } from '@nestjs/common';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { GetUserByIdUseCase } from '../use-cases/get-user-by-id.use-case';
import { UserResponseDto } from '../dto/user-response.dto';

@Injectable()
export class GetUserHandlerUseCase {
  constructor(
    @InjectPinoLogger(GetUserHandlerUseCase.name)
    private readonly logger: PinoLogger,
    private readonly getUserByIdUseCase: GetUserByIdUseCase,
  ) {}

  async execute(id: string): Promise<UserResponseDto> {
    this.logger.info(
      `[GetUserHandlerUseCase.execute] Getting user with ID: ${id}`,
    );

    const user = await this.getUserByIdUseCase.execute(id);

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
      `[GetUserHandlerUseCase.execute] User retrieved successfully with UUID: ${user.Id}`,
    );

    return response;
  }
}
