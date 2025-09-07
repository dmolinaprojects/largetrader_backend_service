import { TTransactionArgs } from '@app/core';
import {
  UsersRepository,
} from '@app/shared';
import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { HttpErrorCode } from '../../../common/filters/internal/internal-exception-error';

@Injectable()
export class DeleteUserUseCase {
  constructor(
    @InjectPinoLogger(DeleteUserUseCase.name)
    private readonly logger: PinoLogger,
    @Inject('UsersRepository')
    private readonly usersRepository: UsersRepository,
  ) {}

  async execute(id: string, tx?: TTransactionArgs): Promise<void> {
    this.logger.info(
      `[DeleteUserUseCase.execute] Deleting user with ID: ${id}`,
    );

    // Verificar si el usuario existe
    const existingUser = await this.usersRepository.findOne(
      { where: { Id: parseInt(id) } },
      tx,
    );

    if (!existingUser) {
      this.logger.error(
        `[DeleteUserUseCase.execute] User with ID ${id} not found`,
      );
      throw new ConflictException(HttpErrorCode.NOT_FOUND);
    }

    // Eliminar el usuario
    await this.usersRepository.deleteOne({ where: { Id: parseInt(id) } }, tx);

    this.logger.info(
      `[DeleteUserUseCase.execute] User deleted successfully with ID: ${id}`,
    );
  }
}
