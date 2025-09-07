import { Injectable } from '@nestjs/common';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { GetAllUsersUseCase } from '../use-cases/get-all-users.use-case';
import { UserResponseDto } from '../dto/user-response.dto';

@Injectable()
export class GetAllUsersHandlerUseCase {
  constructor(
    @InjectPinoLogger(GetAllUsersHandlerUseCase.name)
    private readonly logger: PinoLogger,
    private readonly getAllUsersUseCase: GetAllUsersUseCase,
  ) {}

  async execute(
    page: number = 1,
    limit: number = 10,
  ): Promise<{
    users: UserResponseDto[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    this.logger.info(
      `[GetAllUsersHandlerUseCase.execute] Getting all users - page: ${page}, limit: ${limit}`,
    );

    const result = await this.getAllUsersUseCase.execute(page, limit);

    const users: UserResponseDto[] = result.users.map((user) => ({
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
    }));

    const totalPages = Math.ceil(result.total / result.limit);

    this.logger.info(
      `[GetAllUsersHandlerUseCase.execute] Retrieved ${users.length} users out of ${result.total} total`,
    );

    return {
      users,
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages,
    };
  }
}
