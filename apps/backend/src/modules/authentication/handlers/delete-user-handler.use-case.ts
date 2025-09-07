import { Injectable } from '@nestjs/common';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { DeleteUserUseCase } from '../use-cases/delete-user.use-case';

@Injectable()
export class DeleteUserHandlerUseCase {
  constructor(
    @InjectPinoLogger(DeleteUserHandlerUseCase.name)
    private readonly logger: PinoLogger,
    private readonly deleteUserUseCase: DeleteUserUseCase,
  ) {}

  async execute(id: string): Promise<{ message: string }> {
    this.logger.info(
      `[DeleteUserHandlerUseCase.execute] Deleting user with ID: ${id}`,
    );

    await this.deleteUserUseCase.execute(id);

    this.logger.info(
      `[DeleteUserHandlerUseCase.execute] User deleted successfully with ID: ${id}`,
    );

    return { message: 'Usuario eliminado exitosamente' };
  }
}
