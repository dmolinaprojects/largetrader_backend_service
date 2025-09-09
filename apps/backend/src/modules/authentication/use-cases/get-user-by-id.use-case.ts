import { TTransactionArgs } from '@app/core';
import { Users, UsersRepository } from '@app/shared';
import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { HttpErrorCode } from '../../../common/filters/internal/internal-exception-error';

@Injectable()
export class GetUserByIdUseCase {
  constructor(
    @InjectPinoLogger(GetUserByIdUseCase.name)
    private readonly logger: PinoLogger,
    @Inject('UsersRepository')
    private readonly usersRepository: UsersRepository,
  ) {}

  async execute(id: string, tx?: TTransactionArgs): Promise<Users> {
    this.logger.info(
      `[GetUserByIdUseCase.execute] Fetching user with ID: ${id}`,
    );

    const user = await this.usersRepository.findOne(
      { where: { Id: parseInt(id) } },
      tx,
    );

    if (!user) {
      this.logger.error(
        `[GetUserByIdUseCase.execute] User with ID ${id} not found`,
      );
      throw new ConflictException(HttpErrorCode.NOT_FOUND);
    }

    this.logger.info(
      `[GetUserByIdUseCase.execute] User found successfully with ID: ${id}`,
    );

    return user;
  }
}
