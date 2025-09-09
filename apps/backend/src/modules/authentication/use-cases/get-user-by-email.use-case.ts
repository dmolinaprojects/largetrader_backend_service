import { TTransactionArgs } from '@app/core';
import { Users, UsersRepository } from '@app/shared';
import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { HttpErrorCode } from '../../../common/filters/internal/internal-exception-error';

@Injectable()
export class GetUserByEmailUseCase {
  constructor(
    @InjectPinoLogger(GetUserByEmailUseCase.name)
    private readonly logger: PinoLogger,
    @Inject('UsersRepository')
    private readonly usersRepository: UsersRepository,
  ) {}

  async execute(email: string, tx?: TTransactionArgs): Promise<Users> {
    this.logger.info(
      `[GetUserByEmailUseCase.execute] Fetching user with email: ${email}`,
    );

    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      this.logger.error(
        `[GetUserByEmailUseCase.execute] User with email ${email} not found`,
      );
      throw new ConflictException(HttpErrorCode.NOT_FOUND);
    }

    this.logger.info(
      `[GetUserByEmailUseCase.execute] User found successfully with email: ${email}`,
    );

    return user;
  }
}
